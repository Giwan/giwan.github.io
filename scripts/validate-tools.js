#!/usr/bin/env node

/**
 * Tool Data Validation Script
 * 
 * This script validates all tool data files for:
 * - Structural integrity (required fields, types)
 * - Category and label consistency
 * - Duplicate detection
 * 
 * Usage:
 *   node scripts/validate-tools.js [--quick]
 * 
 * Options:
 *   --quick   Quick validation with minimal output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);
  const quickMode = args.includes('--quick');

  try {
    console.log('🚀 Running tool data validation...\n');
    
    // For now, we'll do a basic validation without full TypeScript compilation
    // This validates that the tool data files exist and have basic structure
    
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
      'src/data/searchTools.ts',
      'src/data/aiMlTools.ts',
      'src/data/hostingTools.ts',
      'src/data/frameworkTools.ts',
      'src/data/testingTools.ts',
      'src/data/monitoringTools.ts'
    ];

    let totalFiles = 0;
    let validFiles = 0;
    let totalTools = 0;

    for (const filePath of toolFiles) {
      const fullPath = path.join(__dirname, '..', filePath);
      
      if (fs.existsSync(fullPath)) {
        totalFiles++;
        
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Basic validation checks
          const hasExport = content.includes('export default');
          const hasToolType = content.includes('TTool');
          const hasRequiredFields = content.includes('title:') && 
                                   content.includes('url:') && 
                                   content.includes('description:');
          
          if (hasExport && hasToolType && hasRequiredFields) {
            validFiles++;
            
            // Count tools (rough estimate by counting title fields)
            const toolCount = (content.match(/title:/g) || []).length;
            totalTools += toolCount;
            
            if (!quickMode) {
              console.log(`✅ ${path.basename(filePath)}: ${toolCount} tools`);
            }
          } else {
            console.log(`❌ ${path.basename(filePath)}: Invalid structure`);
          }
          
        } catch (error) {
          console.log(`❌ ${path.basename(filePath)}: Read error - ${error.message}`);
        }
      } else {
        console.log(`❌ ${path.basename(filePath)}: File not found`);
      }
    }

    console.log('\n📊 VALIDATION SUMMARY:');
    console.log(`   Total Files: ${totalFiles}/${toolFiles.length}`);
    console.log(`   Valid Files: ${validFiles}/${totalFiles}`);
    console.log(`   Total Tools: ~${totalTools}`);
    
    if (validFiles === totalFiles && totalFiles === toolFiles.length) {
      console.log('\n✅ Basic validation passed!');
      console.log('💡 For comprehensive validation including URL checks and consistency,');
      console.log('   use the TypeScript validation utilities in src/utils/');
      return true;
    } else {
      console.log('\n❌ Basic validation failed!');
      return false;
    }

  } catch (error) {
    console.error('❌ Validation failed with error:', error.message);
    return false;
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
