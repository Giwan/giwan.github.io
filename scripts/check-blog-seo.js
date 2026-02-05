#!/usr/bin/env node

/**
 * @fileoverview Blog SEO Check Script
 * This script validates blog posts for SEO best practices.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---

const BLOG_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src/pages/blog');

const SEO_LIMITS = {
  MIN_WORDS: 300,
  TITLE: { MIN: 30, MAX: 70 },
  DESCRIPTION: { MIN: 120, MAX: 160 },
};

const REQUIRED_FRONTMATTER = ['title', 'description', 'pubDate', 'status', 'readTime'];

// --- Types & Constants ---

/**
 * @typedef {Object} ValidationResult
 * @property {string[]} errors
 * @property {string[]} warnings
 */

/**
 * @typedef {Object} PostData
 * @property {Object} frontmatter
 * @property {string} content
 * @property {string} slug
 */

// --- Pure Utility Functions ---

/**
 * Parses frontmatter from a markdown string.
 * @param {string} rawContent
 * @returns {PostData|null}
 */
const parsePostData = (rawContent, slug) => {
  const frontmatterRegex = /^---\r?\n([\s\S]+?)\r?\n---/;
  const match = rawContent.match(frontmatterRegex);
  if (!match) return null;

  const yamlStr = match[1];
  const frontmatter = {};

  yamlStr.split(/\r?\n/).forEach(line => {
    const keyValueMatch = line.match(/^(\w+):\s*(.*)/);
    if (keyValueMatch) {
      let value = keyValueMatch[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[keyValueMatch[1].trim()] = value;
    }
  });

  return {
    frontmatter,
    content: rawContent.slice(match[0].length).trim(),
    slug
  };
};

/**
 * Counts words in a string.
 * @param {string} text
 * @returns {number}
 */
const countWords = (text) => text.split(/\s+/).filter(Boolean).length;

/**
 * Extracts all image definitions from markdown/HTML content.
 * @param {string} content
 * @returns {Array<{alt: string, src: string, type: 'markdown'|'html'}>}
 */
const extractImages = (content) => {
  const images = [];

  // Markdown images: ![alt](src)
  const mdRegex = /!\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    images.push({ alt: match[1], src: match[2], type: 'markdown' });
  }

  // HTML images: <img alt="..." src="..." />
  const htmlRegex = /<img\s+([^>]*?)>/g;
  while ((match = htmlRegex.exec(content)) !== null) {
    const tag = match[1];
    const altMatch = tag.match(/alt=["'](.*?)["']/);
    const srcMatch = tag.match(/src=["'](.*?)["']/);
    images.push({
      alt: altMatch ? altMatch[1] : null,
      src: srcMatch ? srcMatch[1] : 'unknown',
      type: 'html'
    });
  }

  return images;
};

// --- SEO Validation Rules (Pure Functions) ---

/** @type {Array<(data: PostData) => ValidationResult>} */
const SEO_RULES = [
  // 1. Slug format
  ({ slug }) => {
    const isValid = /^\d{4}-\d{2}-\d{2}-[\w-]+$/.test(slug);
    return {
      errors: isValid ? [] : [`Invalid slug format: "${slug}". Expected YYYY-MM-DD-slug`],
      warnings: []
    };
  },

  // 2. Required frontmatter
  ({ frontmatter }) => ({
    errors: REQUIRED_FRONTMATTER
      .filter(field => !frontmatter[field])
      .map(field => `Missing required frontmatter field: "${field}"`),
    warnings: []
  }),

  // 3. Title length
  ({ frontmatter }) => {
    if (!frontmatter.title) return { errors: [], warnings: [] };
    const len = frontmatter.title.length;
    const isOutOfRange = len < SEO_LIMITS.TITLE.MIN || len > SEO_LIMITS.TITLE.MAX;
    return {
      errors: [],
      warnings: isOutOfRange ? [`Title length (${len}) is outside recommended range [${SEO_LIMITS.TITLE.MIN}-${SEO_LIMITS.TITLE.MAX}]`] : []
    };
  },

  // 4. Description length
  ({ frontmatter }) => {
    if (!frontmatter.description) return { errors: [], warnings: [] };
    const len = frontmatter.description.length;
    const isOutOfRange = len < SEO_LIMITS.DESCRIPTION.MIN || len > SEO_LIMITS.DESCRIPTION.MAX;
    return {
      errors: [],
      warnings: isOutOfRange ? [`Description length (${len}) is outside recommended range [${SEO_LIMITS.DESCRIPTION.MIN}-${SEO_LIMITS.DESCRIPTION.MAX}]`] : []
    };
  },

  // 5. Word count
  ({ content }) => {
    const wordCount = countWords(content);
    return {
      errors: [],
      warnings: wordCount < SEO_LIMITS.MIN_WORDS ? [`Content length (${wordCount} words) is below recommended minimum of ${SEO_LIMITS.MIN_WORDS}`] : []
    };
  },

  // 6. Heading structure
  ({ content }) => {
    const results = { errors: [], warnings: [] };
    if (/^#\s+/m.test(content)) {
      results.errors.push('Avoid using H1 (#) in markdown content; the title is already H1');
    }
    if (!/^##\s+/m.test(content)) {
      results.warnings.push('At least one H2 (##) is recommended for SEO');
    }
    return results;
  },

  // 7. Image accessibility
  ({ content }) => {
    const images = extractImages(content);
    const errors = images
      .filter(img => img.alt === null || img.alt.trim() === '')
      .map(img => `Image missing alt text: ${img.src} (${img.type})`);
    return { errors, warnings: [] };
  },

  // 8. Authority links
  ({ content }) => ({
    errors: [],
    warnings: !/\[.*?\]\((https?:\/\/.*?)\)/.test(content) ? ['No external links found; adding authority links is good for SEO'] : []
  })
];

// --- Main Logic ---

/**
 * Validates a single post.
 * @param {string} postDir
 */
const validatePost = (postDir) => {
  const getPostPath = (ext) => path.join(BLOG_PATH, postDir, `index.${ext}`);
  const mdPath = getPostPath('md');
  const mdxPath = getPostPath('mdx');
  const actualPath = fs.existsSync(mdPath) ? mdPath : (fs.existsSync(mdxPath) ? mdxPath : null);

  if (!actualPath) return null;

  const rawContent = fs.readFileSync(actualPath, 'utf8');
  const postData = parsePostData(rawContent, postDir);

  if (!postData) {
    return { errors: ['Missing or invalid frontmatter'], warnings: [], title: postDir };
  }

  const results = SEO_RULES.reduce((acc, rule) => {
    const { errors, warnings } = rule(postData);
    return {
      errors: [...acc.errors, ...errors],
      warnings: [...acc.warnings, ...warnings]
    };
  }, { errors: [], warnings: [] });

  return { ...results, title: postData.frontmatter.title || postDir };
};

const main = () => {
  if (!fs.existsSync(BLOG_PATH)) {
    console.error(`❌ Blog path not found: ${BLOG_PATH}`);
    process.exit(1);
  }

  const postDirs = fs.readdirSync(BLOG_PATH).filter(f => {
    const fullPath = path.join(BLOG_PATH, f);
    return fs.statSync(fullPath).isDirectory() &&
           (fs.existsSync(path.join(fullPath, 'index.md')) || fs.existsSync(path.join(fullPath, 'index.mdx')));
  });

  console.log(`🔍 Checking ${postDirs.length} blog posts for SEO best practices...\n`);

  let stats = { totalErrors: 0, totalWarnings: 0, postsWithIssues: 0 };

  postDirs.forEach(dir => {
    const result = validatePost(dir);
    if (result && (result.errors.length > 0 || result.warnings.length > 0)) {
      stats.postsWithIssues++;
      console.log(`Post: ${dir}${result.title !== dir ? ` (${result.title})` : ''}`);
      result.errors.forEach(e => console.log(`  ❌ Error: ${e}`));
      result.warnings.forEach(w => console.log(`  ⚠️ Warning: ${w}`));
      console.log('');

      stats.totalErrors += result.errors.length;
      stats.totalWarnings += result.warnings.length;
    }
  });

  console.log('Summary:');
  console.log(`  Total Posts: ${postDirs.length}`);
  console.log(`  Posts with issues: ${stats.postsWithIssues}`);
  console.log(`  Total Errors: ${stats.totalErrors}`);
  console.log(`  Total Warnings: ${stats.totalWarnings}`);

  process.exit(stats.totalErrors > 0 ? 1 : 0);
};

main();
