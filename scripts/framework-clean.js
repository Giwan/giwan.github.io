import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'src/pages/blog');
const DATA_DIR = path.join(process.cwd(), 'src/data');

function cleanDirectory(dir, keepFiles = []) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (keepFiles.includes(file)) continue;

    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
}

console.log('🧹 Cleaning demo content...');

// Clean blog posts but keep a template
const templatePost = `---
title: "Welcome to your new Framework Blog"
description: "This is your first post. You can edit or delete this in src/pages/blog/hello-world/index.mdx"
pubDate: "${new Date().toISOString().split('T')[0]}"
heroImage: "/placeholder-social.jpg"
---

Welcome! This blog was bootstrapped using the Astro Framework.
`;

cleanDirectory(BLOG_DIR);
const helloWorldDir = path.join(BLOG_DIR, 'hello-world');
if (!fs.existsSync(helloWorldDir)) fs.mkdirSync(helloWorldDir, { recursive: true });
fs.writeFileSync(path.join(helloWorldDir, 'index.mdx'), templatePost);

// All individual tool data files mentioned in src/data/tools.ts
const toolFiles = [
    'readingTools.ts', 'designTools.ts', 'developerTools.ts',
    'softwareTools.ts', 'writingTools.ts', 'projectManagementTools.ts',
    'socialTools.ts', 'dataTools.ts', 'wireframeTools.ts',
    'searchTools.ts', 'ideAgentTools.ts', 'hostingTools.ts',
    'frameworkTools.ts', 'testingTools.ts', 'monitoringTools.ts'
];

// Clean data tools
const essentialFiles = ['categories.ts', 'labels.ts', 'tools.ts'];
cleanDirectory(DATA_DIR, essentialFiles);

// Reset individual tool files to empty arrays
for (const file of toolFiles) {
    const filePath = path.join(DATA_DIR, file);
    fs.writeFileSync(filePath, 'export default [];\n');
}

// Ensure categories.ts has a clean list
const cleanCategories = `export const categoriesList = ["all"];\nexport default {};\n`;
fs.writeFileSync(path.join(DATA_DIR, 'categories.ts'), cleanCategories);

console.log('✅ Framework cleaned and ready for your content!');
