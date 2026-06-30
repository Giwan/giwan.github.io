import { TIME_CONSTANTS } from '../../constants/storage';

export function isStale(timestamp: number, now: number): boolean {
  return (now - timestamp) >= TIME_CONSTANTS.FIVE_MINUTES_MS;
}

export function isFresh(timestamp: number, now: number): boolean {
  return !isStale(timestamp, now);
}

export function isBlogPath(path: string): boolean {
  return path.startsWith("/blog");
}

export interface ScrollBlueprint {
  top: number;
  behavior: 'smooth' | 'auto';
  isLegacy: boolean;
}

export function getScrollToTopBlueprint(supportsSmooth: boolean): ScrollBlueprint {
  return {
    top: 0,
    behavior: 'smooth',
    isLegacy: !supportsSmooth
  };
}

export function getRestoreScrollBlueprint(pos: number, supportsSmooth: boolean): ScrollBlueprint {
  return {
    top: pos,
    behavior: 'smooth',
    isLegacy: !supportsSmooth
  };
}
