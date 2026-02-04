#!/usr/bin/env node

/**
 * Blog SEO Check Script
 *
 * This script validates blog posts for SEO best practices:
 * - Frontmatter: required fields (title, description, pubDate, status, readTime)
 * - Title length: 30-70 characters
 * - Description length: 120-160 characters
 * - Content length: At least 300 words
 * - Headings: At least one H2, no H1 in markdown content
 * - Images: All images must have alt text
 * - Links: Presence of at least one external link
 * - Slug format: Directory name should match YYYY-MM-DD-slug
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BLOG_PATH = path.join(rootDir, 'src/pages/blog');

const RULES = {
  MIN_WORDS: 300,
  TITLE_MIN: 30,
  TITLE_MAX: 70,
  DESC_MIN: 120,
  DESC_MAX: 160,
};

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---/;
  const match = content.match(frontmatterRegex);
  if (!match) return null;

  const yamlStr = match[1];
  const frontmatter = {};

  // Basic YAML parser for key: value
  const lines = yamlStr.split(/\r?\n/);
  let currentKey = null;

  lines.forEach(line => {
    if (line.trim() === '') return;

    const keyValueMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyValueMatch) {
      currentKey = keyValueMatch[1].trim();
      let value = keyValueMatch[2].trim();

      // Handle quoted values
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[currentKey] = value;
    } else if (currentKey && line.startsWith('  ')) {
      // Handle simple multi-line values (very basic)
      frontmatter[currentKey] += ' ' + line.trim();
    }
  });

  return {
    frontmatter,
    content: content.slice(match[0].length).trim()
  };
}

function checkPost(postDir) {
  let indexPath = path.join(BLOG_PATH, postDir, 'index.md');
  if (!fs.existsSync(indexPath)) {
    indexPath = path.join(BLOG_PATH, postDir, 'index.mdx');
  }

  if (!fs.existsSync(indexPath)) return null;

  const rawContent = fs.readFileSync(indexPath, 'utf8');
  const parsed = parseFrontmatter(rawContent);
  if (!parsed) {
    return { errors: ['Missing or invalid frontmatter'], warnings: [] };
  }

  const { frontmatter, content } = parsed;
  const errors = [];
  const warnings = [];

  // 1. Slug format
  const slugRegex = /^\d{4}-\d{2}-\d{2}-[\w-]+$/;
  if (!slugRegex.test(postDir)) {
    errors.push(`Invalid slug format: "${postDir}". Expected YYYY-MM-DD-slug`);
  }

  // 2. Required frontmatter fields
  const requiredFields = ['title', 'description', 'pubDate', 'status', 'readTime'];
  requiredFields.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required frontmatter field: "${field}"`);
    }
  });

  // 3. Title length
  if (frontmatter.title) {
    const len = frontmatter.title.length;
    if (len < RULES.TITLE_MIN || len > RULES.TITLE_MAX) {
      warnings.push(`Title length (${len}) is outside recommended range [${RULES.TITLE_MIN}-${RULES.TITLE_MAX}]`);
    }
  }

  // 4. Description length
  if (frontmatter.description) {
    const len = frontmatter.description.length;
    if (len < RULES.DESC_MIN || len > RULES.DESC_MAX) {
      warnings.push(`Description length (${len}) is outside recommended range [${RULES.DESC_MIN}-${RULES.DESC_MAX}]`);
    }
  }

  // 5. Word count
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount < RULES.MIN_WORDS) {
    warnings.push(`Content length (${wordCount} words) is below recommended minimum of ${RULES.MIN_WORDS}`);
  }

  // 6. Headings
  const h1Match = content.match(/^#\s+/m);
  if (h1Match) {
    errors.push('Avoid using H1 (#) in markdown content; the title is already H1');
  }
  const h2Match = content.match(/^##\s+/m);
  if (!h2Match) {
    warnings.push('At least one H2 (##) is recommended for SEO');
  }

  // 7. Images alt text
  const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (!match[1].trim()) {
      errors.push(`Image missing alt text: ${match[2]}`);
    }
  }

  // Also check for HTML img tags
  const htmlImgRegex = /<img\s+[^>]*alt=["'](.*?)["'][^>]*>/g;
  const rawHtmlImgRegex = /<img\s+[^>]*>/g;
  const rawImgs = content.match(rawHtmlImgRegex) || [];
  rawImgs.forEach(img => {
    if (!img.includes('alt=')) {
      errors.push(`HTML Image missing alt attribute: ${img}`);
    } else {
      const altMatch = img.match(/alt=["'](.*?)["']/);
      if (altMatch && !altMatch[1].trim()) {
        errors.push(`HTML Image has empty alt attribute: ${img}`);
      }
    }
  });

  // 8. External links
  const linkRegex = /\[.*?\]\((https?:\/\/.*?)\)/g;
  if (!content.match(linkRegex)) {
    warnings.push('No external links found; adding authority links is good for SEO');
  }

  return { errors, warnings, title: frontmatter.title || postDir };
}

function main() {
  if (!fs.existsSync(BLOG_PATH)) {
    console.error(`❌ Blog path not found: ${BLOG_PATH}`);
    process.exit(1);
  }

  const posts = fs.readdirSync(BLOG_PATH).filter(f => {
    const fullPath = path.join(BLOG_PATH, f);
    return fs.statSync(fullPath).isDirectory() && (
      fs.existsSync(path.join(fullPath, 'index.md')) ||
      fs.existsSync(path.join(fullPath, 'index.mdx'))
    );
  });

  let totalErrors = 0;
  let totalWarnings = 0;
  let postsWithIssues = 0;

  console.log(`🔍 Checking ${posts.length} blog posts for SEO best practices...\n`);

  posts.forEach(post => {
    const result = checkPost(post);
    if (result && (result.errors.length > 0 || result.warnings.length > 0)) {
      postsWithIssues++;
      console.log(`Post: ${post}`);
      if (result.title && result.title !== post) {
        console.log(`Title: ${result.title}`);
      }
      result.errors.forEach(e => console.log(`  ❌ Error: ${e}`));
      result.warnings.forEach(w => console.log(`  ⚠️ Warning: ${w}`));
      console.log('');

      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
  });

  console.log('Summary:');
  console.log(`  Total Posts: ${posts.length}`);
  console.log(`  Posts with issues: ${postsWithIssues}`);
  console.log(`  Total Errors: ${totalErrors}`);
  console.log(`  Total Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.log('\n❌ SEO check failed with errors.');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n✅ SEO check passed with warnings.');
    process.exit(0);
  } else {
    console.log('\n✨ All SEO checks passed!');
    process.exit(0);
  }
}

main();
