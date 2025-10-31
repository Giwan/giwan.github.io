/**
 * Transition Preloader - Preloads transitions using Astro's prefetch capabilities
 * 
 * This module provides intelligent preloading of page transitions to ensure
 * smooth navigation by preparing resources and transition states in advance.
 */

import { transitionRegistry } from './transitionRegistry';
import { transitionController } from './transitionController';

export interface PreloadOptions {
  priority?: 'high' | 'low';
  prefetchImages?: boolean;
  prefetchFonts?: boolean;
  prefetchCSS?: boolean;
  prefetchJS?: boolean;
}

export interface PreloadedTransition {
  fromPath: string;
  toPath: string;
  transitionConfig: any;
  preloadedAt: number;
  resources: PreloadedResource[];
}

export interface PreloadedResource {
  url: string;
  type: 'image' | 'font' | 'css' | 'js' | 'page';
  status: 'loading' | 'loaded' | 'error';
  loadTime?: number;
}

export class TransitionPreloader {
  private preloadedTransitions: Map<string, PreloadedTransition> = new Map();
  private preloadQueue: string[] = [];
  private isPreloading: boolean = false;
  private observer?: IntersectionObserver;
  private prefetchLinks: Set<string> = new Set();

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the preloader with intersection observer for link prefetching
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Set up intersection observer for automatic link prefetching
    this.setupLinkObserver();

    // Listen for navigation events to clean up old preloads
    document.addEventListener('astro:before-preparation', this.handleNavigationStart.bind(this));
    document.addEventListener('astro:after-swap', this.handleNavigationComplete.bind(this));

    // Preload critical transitions on page load
    this.preloadCriticalTransitions();
  }

  /**
   * Set up intersection observer to automatically prefetch visible links
   */
  private setupLinkObserver(): void {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = link.href;
            
            if (href && this.shouldPrefetchLink(href)) {
              this.prefetchTransition(href, { priority: 'low' });
            }
          }
        });
      },
      {
        rootMargin: '100px', // Start prefetching when link is 100px from viewport
        threshold: 0.1
      }
    );

    // Observe all internal links
    this.observeLinks();
  }

  /**
   * Observe all internal links on the page
   */
  private observeLinks(): void {
    if (!this.observer) return;

    const links = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    links.forEach((link) => {
      this.observer!.observe(link);
    });
  }

  /**
   * Check if a link should be prefetched
   */
  private shouldPrefetchLink(href: string): boolean {
    try {
      const url = new URL(href, window.location.origin);
      
      // Only prefetch internal links
      if (url.origin !== window.location.origin) return false;
      
      // Don't prefetch current page
      if (url.pathname === window.location.pathname) return false;
      
      // Don't prefetch if already prefetched
      if (this.prefetchLinks.has(url.pathname)) return false;
      
      // Don't prefetch certain file types
      const excludeExtensions = ['.pdf', '.zip', '.exe', '.dmg'];
      if (excludeExtensions.some(ext => url.pathname.endsWith(ext))) return false;
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Prefetch a transition for a specific path
   */
  public async prefetchTransition(toPath: string, options: PreloadOptions = {}): Promise<void> {
    const currentPath = window.location.pathname;
    const preloadKey = `${currentPath}->${toPath}`;
    
    // Skip if already preloaded or in progress
    if (this.preloadedTransitions.has(preloadKey) || this.preloadQueue.includes(preloadKey)) {
      return;
    }

    this.preloadQueue.push(preloadKey);
    this.prefetchLinks.add(toPath);

    try {
      // Get transition configuration
      const fromPageType = transitionRegistry.getPageType(currentPath);
      const toPageType = transitionRegistry.getPageType(toPath);
      const relationship = transitionRegistry.getPageRelationship(fromPageType, toPageType, currentPath, toPath);
      
      const context = {
        direction: 'forward' as const,
        fromPageType,
        toPageType,
        relationship
      };
      
      const transitionConfig = transitionRegistry.getTransitionForNavigation(context);
      
      // Start preloading resources
      const resources = await this.preloadResources(toPath, options);
      
      // Use Astro's prefetch if available
      await this.prefetchWithAstro(toPath, options);
      
      // Store preloaded transition
      const preloadedTransition: PreloadedTransition = {
        fromPath: currentPath,
        toPath,
        transitionConfig,
        preloadedAt: Date.now(),
        resources
      };
      
      this.preloadedTransitions.set(preloadKey, preloadedTransition);
      
      // Remove from queue
      const queueIndex = this.preloadQueue.indexOf(preloadKey);
      if (queueIndex > -1) {
        this.preloadQueue.splice(queueIndex, 1);
      }
      
    } catch (error) {
      console.warn('Failed to prefetch transition:', error);
      
      // Remove from queue on error
      const queueIndex = this.preloadQueue.indexOf(preloadKey);
      if (queueIndex > -1) {
        this.preloadQueue.splice(queueIndex, 1);
      }
    }
  }

  /**
   * Preload resources for a specific page
   */
  private async preloadResources(path: string, options: PreloadOptions): Promise<PreloadedResource[]> {
    const resources: PreloadedResource[] = [];
    
    // Prefetch the page itself
    if (options.priority === 'high') {
      resources.push(await this.preloadResource(path, 'page'));
    }
    
    // Prefetch critical CSS if needed
    if (options.prefetchCSS !== false) {
      const cssResources = await this.findCriticalCSS(path);
      for (const css of cssResources) {
        resources.push(await this.preloadResource(css, 'css'));
      }
    }
    
    // Prefetch critical images if needed
    if (options.prefetchImages) {
      const imageResources = await this.findCriticalImages(path);
      for (const image of imageResources) {
        resources.push(await this.preloadResource(image, 'image'));
      }
    }
    
    // Prefetch fonts if needed
    if (options.prefetchFonts) {
      const fontResources = await this.findCriticalFonts(path);
      for (const font of fontResources) {
        resources.push(await this.preloadResource(font, 'font'));
      }
    }
    
    return resources;
  }

  /**
   * Use Astro's prefetch capabilities
   */
  private async prefetchWithAstro(path: string, options: PreloadOptions): Promise<void> {
    // Check if Astro's prefetch is available
    if (typeof (window as any).astro?.prefetch === 'function') {
      try {
        await (window as any).astro.prefetch(path, {
          priority: options.priority || 'low'
        });
      } catch (error) {
        console.warn('Astro prefetch failed:', error);
      }
    } else {
      // Fallback to manual prefetch using link rel="prefetch"
      this.manualPrefetch(path, options);
    }
  }

  /**
   * Manual prefetch using link elements
   */
  private manualPrefetch(path: string, options: PreloadOptions): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    
    if (options.priority === 'high') {
      link.setAttribute('importance', 'high');
    }
    
    document.head.appendChild(link);
    
    // Clean up after a reasonable time
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 30000); // 30 seconds
  }

  /**
   * Preload a specific resource
   */
  private async preloadResource(url: string, type: PreloadedResource['type']): Promise<PreloadedResource> {
    const resource: PreloadedResource = {
      url,
      type,
      status: 'loading'
    };
    
    const startTime = Date.now();
    
    try {
      switch (type) {
        case 'page':
          await fetch(url, { method: 'HEAD' });
          break;
        case 'image':
          await this.preloadImage(url);
          break;
        case 'font':
          await this.preloadFont(url);
          break;
        case 'css':
          await this.preloadCSS(url);
          break;
        case 'js':
          await this.preloadJS(url);
          break;
      }
      
      resource.status = 'loaded';
      resource.loadTime = Date.now() - startTime;
    } catch (error) {
      resource.status = 'error';
      console.warn(`Failed to preload ${type}:`, url, error);
    }
    
    return resource;
  }

  /**
   * Preload an image
   */
  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Preload a font
   */
  private preloadFont(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload CSS
   */
  private preloadCSS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Preload JavaScript
   */
  private preloadJS(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Find critical CSS for a page
   */
  private async findCriticalCSS(path: string): Promise<string[]> {
    // CSS is already bundled and loaded by Astro, no need to preload
    // Return empty array to avoid 404 errors on source paths
    return [];
  }

  /**
   * Find critical images for a page
   */
  private async findCriticalImages(path: string): Promise<string[]> {
    // This would typically analyze the page to find above-the-fold images
    // For now, return empty array as this requires page analysis
    return [];
  }

  /**
   * Find critical fonts for a page
   */
  private async findCriticalFonts(path: string): Promise<string[]> {
    // Fonts are already preloaded by BaseHead component, no need to duplicate
    // Return empty array to avoid duplicate preloading
    return [];
  }

  /**
   * Preload critical transitions based on current page
   */
  private preloadCriticalTransitions(): void {
    const currentPath = window.location.pathname;
    const currentPageType = transitionRegistry.getPageType(currentPath);
    
    // Define critical navigation paths based on page type
    const criticalPaths: string[] = [];
    
    switch (currentPageType) {
      case 'home':
        criticalPaths.push('/blog', '/tools', '/about');
        break;
      case 'blog-list':
        // Prefetch first few blog posts
        const blogLinks = document.querySelectorAll('a[href^="/blog/"]');
        Array.from(blogLinks).slice(0, 3).forEach((link) => {
          const href = (link as HTMLAnchorElement).href;
          if (href) criticalPaths.push(new URL(href).pathname);
        });
        break;
      case 'blog-post':
        criticalPaths.push('/blog'); // Back to blog list
        break;
      case 'tools-list':
        // Prefetch tool categories
        const toolLinks = document.querySelectorAll('a[href^="/tools/"]');
        Array.from(toolLinks).slice(0, 3).forEach((link) => {
          const href = (link as HTMLAnchorElement).href;
          if (href) criticalPaths.push(new URL(href).pathname);
        });
        break;
    }
    
    // Prefetch critical paths with high priority
    criticalPaths.forEach((path) => {
      this.prefetchTransition(path, { 
        priority: 'high',
        prefetchCSS: true,
        prefetchImages: false,
        prefetchFonts: true
      });
    });
  }

  /**
   * Handle navigation start - prepare preloaded transition
   */
  private handleNavigationStart(event: Event): void {
    const customEvent = event as CustomEvent;
    const toPath = customEvent.detail?.to?.pathname;
    
    if (!toPath) return;
    
    const currentPath = window.location.pathname;
    const preloadKey = `${currentPath}->${toPath}`;
    const preloaded = this.preloadedTransitions.get(preloadKey);
    
    if (preloaded) {
      // Apply preloaded transition configuration
      console.log('Using preloaded transition for:', toPath);
      
      // Set transition context based on preloaded config
      const root = document.documentElement;
      root.setAttribute('data-transition-preloaded', 'true');
      root.setAttribute('data-preload-time', (Date.now() - preloaded.preloadedAt).toString());
    }
  }

  /**
   * Handle navigation complete - clean up old preloads
   */
  private handleNavigationComplete(): void {
    const currentTime = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    // Clean up old preloaded transitions
    for (const [key, preloaded] of this.preloadedTransitions.entries()) {
      if (currentTime - preloaded.preloadedAt > maxAge) {
        this.preloadedTransitions.delete(key);
      }
    }
    
    // Re-observe links on new page
    setTimeout(() => {
      this.observeLinks();
    }, 100);
  }

  /**
   * Get preload statistics
   */
  public getPreloadStats(): {
    totalPreloaded: number;
    averageLoadTime: number;
    successRate: number;
    queueLength: number;
  } {
    const preloaded = Array.from(this.preloadedTransitions.values());
    const totalResources = preloaded.flatMap(p => p.resources);
    const loadedResources = totalResources.filter(r => r.status === 'loaded');
    
    const averageLoadTime = loadedResources.length > 0 
      ? loadedResources.reduce((sum, r) => sum + (r.loadTime || 0), 0) / loadedResources.length
      : 0;
    
    const successRate = totalResources.length > 0 
      ? loadedResources.length / totalResources.length
      : 0;
    
    return {
      totalPreloaded: preloaded.length,
      averageLoadTime,
      successRate,
      queueLength: this.preloadQueue.length
    };
  }

  /**
   * Manually trigger prefetch for specific paths
   */
  public prefetchPaths(paths: string[], options: PreloadOptions = {}): Promise<void[]> {
    return Promise.all(paths.map(path => this.prefetchTransition(path, options)));
  }

  /**
   * Clear all preloaded transitions
   */
  public clearPreloads(): void {
    this.preloadedTransitions.clear();
    this.preloadQueue.length = 0;
    this.prefetchLinks.clear();
  }

  /**
   * Destroy the preloader and clean up resources
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
    
    document.removeEventListener('astro:before-preparation', this.handleNavigationStart.bind(this));
    document.removeEventListener('astro:after-swap', this.handleNavigationComplete.bind(this));
    
    this.clearPreloads();
  }
}

// Export singleton instance
export const transitionPreloader = new TransitionPreloader();