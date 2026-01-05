#!/usr/bin/env node

/**
 * Tool Audit Script
 * 
 * This script audits all tools in the data files by:
 * 1. Checking URL accessibility
 * 2. Identifying potential issues with tool entries
 * 3. Generating a report of findings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tool data files to audit
const toolFiles = [
    'src/data/readingTools.ts',
    'src/data/designTools.ts', 
    'src/data/developerTools.ts',
    'src/data/softwareTools.ts',
    'src/data/writingTools.ts',
    'src/data/projectManagementTools.ts',
    'src/data/socialTools.ts',
    'src/data/dataTools.ts',
    'src/data/wireframeTools.ts',
    'src/data/searchTools.ts'
];

// Results tracking
const auditResults = {
    totalTools: 0,
    accessibleTools: 0,
    inaccessibleTools: 0,
    suspiciousTools: 0,
    issues: [],
    recommendations: []
};

/**
 * Check if a URL is accessible
 */
async function checkUrlAccessibility(url, title) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Tool-Audit-Bot/1.0)'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            auditResults.accessibleTools++;
            return { accessible: true, status: response.status };
        } else {
            auditResults.inaccessibleTools++;
            auditResults.issues.push({
                type: 'inaccessible',
                tool: title,
                url: url,
                status: response.status,
                message: `HTTP ${response.status}`
            });
            return { accessible: false, status: response.status };
        }
    } catch (error) {
        auditResults.inaccessibleTools++;
        auditResults.issues.push({
            type: 'error',
            tool: title,
            url: url,
            message: error.message
        });
        return { accessible: false, error: error.message };
    }
}

/**
 * Extract tools from a TypeScript file
 */
function extractToolsFromFile(filePath) {
    try {
        const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
        
        // Simple regex to extract tool objects - this is a basic approach
        // In a real scenario, we might want to use a proper TypeScript parser
        const toolMatches = content.match(/{\s*title:\s*"([^"]+)",\s*url:\s*"([^"]+)",[\s\S]*?}/g);
        
        if (!toolMatches) return [];
        
        return toolMatches.map(match => {
            const titleMatch = match.match(/title:\s*"([^"]+)"/);
            const urlMatch = match.match(/url:\s*"([^"]+)"/);
            const descMatch = match.match(/description:\s*["`]([^"`]+)["`]/);
            const priceMatch = match.match(/price:\s*(\d+)/);
            
            return {
                title: titleMatch ? titleMatch[1] : 'Unknown',
                url: urlMatch ? urlMatch[1] : '',
                description: descMatch ? descMatch[1] : '',
                price: priceMatch ? parseInt(priceMatch[1]) : 0,
                file: filePath
            };
        });
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return [];
    }
}

/**
 * Analyze tool for potential issues
 */
function analyzeToolEntry(tool) {
    const issues = [];
    
    // Check for missing or poor descriptions
    if (!tool.description || tool.description.length < 20) {
        issues.push({
            type: 'poor_description',
            tool: tool.title,
            message: 'Description is missing or too short'
        });
    }
    
    // Check for suspicious URLs
    if (tool.url.includes('localhost') || tool.url.includes('127.0.0.1')) {
        issues.push({
            type: 'suspicious_url',
            tool: tool.title,
            url: tool.url,
            message: 'URL appears to be localhost/development URL'
        });
    }
    
    // Check for potentially outdated tools (basic heuristics)
    const suspiciousPatterns = [
        'flash',
        'silverlight',
        'internet explorer',
        'ie6',
        'ie7',
        'ie8'
    ];
    
    const toolText = (tool.title + ' ' + tool.description).toLowerCase();
    for (const pattern of suspiciousPatterns) {
        if (toolText.includes(pattern)) {
            issues.push({
                type: 'potentially_outdated',
                tool: tool.title,
                message: `May be outdated (mentions: ${pattern})`
            });
        }
    }
    
    return issues;
}

/**
 * Main audit function
 */
async function auditTools() {
    console.log('🔍 Starting tool audit...\n');
    
    // Collect all tools
    const allTools = [];
    
    for (const file of toolFiles) {
        if (fs.existsSync(path.join(__dirname, '..', file))) {
            const tools = extractToolsFromFile(file);
            allTools.push(...tools);
            console.log(`📁 ${file}: Found ${tools.length} tools`);
        } else {
            console.log(`⚠️  ${file}: File not found`);
        }
    }
    
    auditResults.totalTools = allTools.length;
    console.log(`\n📊 Total tools to audit: ${auditResults.totalTools}\n`);
    
    // Audit each tool
    for (let i = 0; i < allTools.length; i++) {
        const tool = allTools[i];
        process.stdout.write(`\r🔍 Auditing: ${tool.title} (${i + 1}/${allTools.length})`);
        
        // Check URL accessibility
        if (tool.url) {
            await checkUrlAccessibility(tool.url, tool.title);
        }
        
        // Analyze tool entry
        const toolIssues = analyzeToolEntry(tool);
        auditResults.issues.push(...toolIssues);
        
        if (toolIssues.length > 0) {
            auditResults.suspiciousTools++;
        }
        
        // Small delay to be respectful to servers
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n\n✅ Audit complete!\n');
    
    // Generate report
    generateReport();
}

/**
 * Generate audit report
 */
function generateReport() {
    console.log('📋 AUDIT REPORT');
    console.log('================\n');
    
    console.log(`📊 Summary:`);
    console.log(`   Total tools: ${auditResults.totalTools}`);
    console.log(`   Accessible: ${auditResults.accessibleTools}`);
    console.log(`   Inaccessible: ${auditResults.inaccessibleTools}`);
    console.log(`   With issues: ${auditResults.suspiciousTools}\n`);
    
    if (auditResults.issues.length > 0) {
        console.log('🚨 Issues Found:\n');
        
        // Group issues by type
        const issuesByType = {};
        auditResults.issues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = [];
            }
            issuesByType[issue.type].push(issue);
        });
        
        Object.entries(issuesByType).forEach(([type, issues]) => {
            console.log(`${type.toUpperCase().replace('_', ' ')} (${issues.length}):`);
            issues.forEach(issue => {
                console.log(`   • ${issue.tool}: ${issue.message}`);
                if (issue.url) console.log(`     URL: ${issue.url}`);
            });
            console.log('');
        });
    }
    
    // Generate recommendations
    generateRecommendations();
    
    // Save detailed report to file
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            totalTools: auditResults.totalTools,
            accessibleTools: auditResults.accessibleTools,
            inaccessibleTools: auditResults.inaccessibleTools,
            suspiciousTools: auditResults.suspiciousTools
        },
        issues: auditResults.issues,
        recommendations: auditResults.recommendations
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'audit-report.json'),
        JSON.stringify(reportData, null, 2)
    );
    
    console.log('💾 Detailed report saved to scripts/audit-report.json');
}

/**
 * Generate recommendations based on findings
 */
function generateRecommendations() {
    console.log('💡 Recommendations:\n');
    
    if (auditResults.inaccessibleTools > 0) {
        console.log(`   • Remove or replace ${auditResults.inaccessibleTools} inaccessible tools`);
        auditResults.recommendations.push('Remove inaccessible tools');
    }
    
    const poorDescriptions = auditResults.issues.filter(i => i.type === 'poor_description');
    if (poorDescriptions.length > 0) {
        console.log(`   • Improve descriptions for ${poorDescriptions.length} tools`);
        auditResults.recommendations.push('Improve tool descriptions');
    }
    
    const outdatedTools = auditResults.issues.filter(i => i.type === 'potentially_outdated');
    if (outdatedTools.length > 0) {
        console.log(`   • Review ${outdatedTools.length} potentially outdated tools`);
        auditResults.recommendations.push('Review outdated tools');
    }
    
    console.log('   • Add modern development tools (AI/ML, hosting, frameworks)');
    console.log('   • Standardize category naming inconsistencies');
    console.log('   • Add dateAdded and lastVerified fields to track tool freshness\n');
    
    auditResults.recommendations.push(
        'Add modern tools',
        'Standardize categories',
        'Add tracking fields'
    );
}

// Run the audit
auditTools().catch(console.error);