#!/usr/bin/env node

/**
 * Tool Freshness Tracker
 * 
 * Tracks when tools were last verified and identifies tools needing review.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tool data files to check
const toolFiles = [
    'src/data/aiMlTools.ts',
    'src/data/designTools.ts',
    'src/data/developerTools.ts',
    'src/data/frameworkTools.ts',
    'src/data/hostingTools.ts',
    'src/data/monitoringTools.ts',
    'src/data/testingTools.ts',
    'src/data/projectManagementTools.ts',
    'src/data/readingTools.ts',
    'src/data/writingTools.ts',
    'src/data/socialTools.ts',
    'src/data/dataTools.ts',
    'src/data/wireframeTools.ts',
    'src/data/searchTools.ts',
    'src/data/softwareTools.ts'
];

/**
 * Extract tools from TypeScript file
 */
function extractToolsFromFile(filePath) {
    try {
        const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
        
        // Extract tool objects using regex
        const toolMatches = content.match(/{\s*title:\s*"([^"]+)"[\s\S]*?}/g);
        
        if (!toolMatches) return [];
        
        return toolMatches.map(match => {
            const titleMatch = match.match(/title:\s*"([^"]+)"/);
            const urlMatch = match.match(/url:\s*"([^"]+)"/);
            const dateAddedMatch = match.match(/dateAdded:\s*"([^"]+)"/);
            const lastVerifiedMatch = match.match(/lastVerified:\s*"([^"]+)"/);
            
            return {
                title: titleMatch ? titleMatch[1] : 'Unknown',
                url: urlMatch ? urlMatch[1] : '',
                dateAdded: dateAddedMatch ? dateAddedMatch[1] : null,
                lastVerified: lastVerifiedMatch ? lastVerifiedMatch[1] : null,
                file: filePath
            };
        });
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return [];
    }
}/**
 * An
alyze tool freshness
 */
function analyzeToolFreshness() {
    const allTools = [];
    const now = new Date();
    
    // Collect all tools
    for (const file of toolFiles) {
        if (fs.existsSync(path.join(__dirname, '..', file))) {
            const tools = extractToolsFromFile(file);
            allTools.push(...tools);
        }
    }
    
    const analysis = {
        total: allTools.length,
        withDateAdded: 0,
        withLastVerified: 0,
        neverVerified: 0,
        needsReview: [],
        stale: [],
        fresh: []
    };
    
    allTools.forEach(tool => {
        if (tool.dateAdded) analysis.withDateAdded++;
        if (tool.lastVerified) analysis.withLastVerified++;
        
        if (!tool.lastVerified) {
            analysis.neverVerified++;
            analysis.needsReview.push({
                ...tool,
                reason: 'Never verified',
                priority: 'high'
            });
        } else {
            const lastVerified = new Date(tool.lastVerified);
            const daysSinceVerified = Math.floor((now - lastVerified) / (1000 * 60 * 60 * 24));
            
            if (daysSinceVerified > 180) { // 6 months
                analysis.stale.push({
                    ...tool,
                    daysSinceVerified,
                    reason: `Not verified for ${daysSinceVerified} days`,
                    priority: 'medium'
                });
            } else if (daysSinceVerified > 90) { // 3 months
                analysis.needsReview.push({
                    ...tool,
                    daysSinceVerified,
                    reason: `Not verified for ${daysSinceVerified} days`,
                    priority: 'low'
                });
            } else {
                analysis.fresh.push({
                    ...tool,
                    daysSinceVerified
                });
            }
        }
    });
    
    return analysis;
}

/**
 * Generate freshness report
 */
function generateFreshnessReport() {
    const analysis = analyzeToolFreshness();
    
    console.log('🔍 TOOL FRESHNESS REPORT');
    console.log('========================\n');
    
    console.log('📊 Summary:');
    console.log(`   Total tools: ${analysis.total}`);
    console.log(`   With dateAdded: ${analysis.withDateAdded} (${Math.round(analysis.withDateAdded/analysis.total*100)}%)`);
    console.log(`   With lastVerified: ${analysis.withLastVerified} (${Math.round(analysis.withLastVerified/analysis.total*100)}%)`);
    console.log(`   Never verified: ${analysis.neverVerified}`);
    console.log(`   Need review: ${analysis.needsReview.length}`);
    console.log(`   Stale (6+ months): ${analysis.stale.length}`);
    console.log(`   Fresh (< 3 months): ${analysis.fresh.length}\n`);
    
    if (analysis.neverVerified > 0) {
        console.log('🚨 NEVER VERIFIED (High Priority):');
        analysis.needsReview
            .filter(tool => tool.reason === 'Never verified')
            .slice(0, 10)
            .forEach(tool => {
                console.log(`   • ${tool.title} (${tool.file})`);
            });
        if (analysis.neverVerified > 10) {
            console.log(`   ... and ${analysis.neverVerified - 10} more\n`);
        } else {
            console.log('');
        }
    }
    
    if (analysis.stale.length > 0) {
        console.log('⚠️  STALE TOOLS (Medium Priority):');
        analysis.stale.slice(0, 10).forEach(tool => {
            console.log(`   • ${tool.title} - ${tool.daysSinceVerified} days ago`);
        });
        if (analysis.stale.length > 10) {
            console.log(`   ... and ${analysis.stale.length - 10} more\n`);
        } else {
            console.log('');
        }
    }
    
    console.log('💡 Recommendations:');
    if (analysis.neverVerified > 0) {
        console.log(`   • Verify ${analysis.neverVerified} tools that have never been checked`);
    }
    if (analysis.stale.length > 0) {
        console.log(`   • Review ${analysis.stale.length} stale tools (6+ months old)`);
    }
    console.log('   • Add lastVerified dates when adding new tools');
    console.log('   • Run monthly verification to keep tools fresh\n');
    
    // Save detailed report
    const reportData = {
        timestamp: new Date().toISOString(),
        summary: {
            total: analysis.total,
            withDateAdded: analysis.withDateAdded,
            withLastVerified: analysis.withLastVerified,
            neverVerified: analysis.neverVerified,
            needsReview: analysis.needsReview.length,
            stale: analysis.stale.length,
            fresh: analysis.fresh.length
        },
        neverVerified: analysis.needsReview.filter(t => t.reason === 'Never verified'),
        staleTools: analysis.stale,
        needsReview: analysis.needsReview.filter(t => t.reason !== 'Never verified')
    };
    
    fs.writeFileSync(
        path.join(__dirname, 'freshness-report.json'),
        JSON.stringify(reportData, null, 2)
    );
    
    console.log('💾 Detailed report saved to scripts/freshness-report.json');
}

// Run the analysis
generateFreshnessReport();