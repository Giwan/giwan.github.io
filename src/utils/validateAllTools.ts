import type { TTool } from "../types/tools.d";
import { validateToolArray, validateToolUrls, ValidationResult } from "./toolValidation";
import { validateAllToolConsistency } from "./toolConsistencyChecks";

// Import all tool data files
import readingTools from "../data/readingTools";
import designTools from "../data/designTools";
import developerTools from "../data/developerTools";
import softwareTools from "../data/softwareTools";
import writingTools from "../data/writingTools";
import projectManagementTools from "../data/projectManagementTools";
import socialTools from "../data/socialTools";
import dataTools from "../data/dataTools";
import wireframeTools from "../data/wireframeTools";
import searchTools from "../data/searchTools";
import aiMlTools from "../data/aiMlTools";
import hostingTools from "../data/hostingTools";
import frameworkTools from "../data/frameworkTools";
import testingTools from "../data/testingTools";
import monitoringTools from "../data/monitoringTools";

/**
 * All tool data files with their names for validation
 */
const toolDataFiles = [
  { tools: readingTools, fileName: "readingTools.ts" },
  { tools: designTools, fileName: "designTools.ts" },
  { tools: developerTools, fileName: "developerTools.ts" },
  { tools: softwareTools, fileName: "softwareTools.ts" },
  { tools: writingTools, fileName: "writingTools.ts" },
  { tools: projectManagementTools, fileName: "projectManagementTools.ts" },
  { tools: socialTools, fileName: "socialTools.ts" },
  { tools: dataTools, fileName: "dataTools.ts" },
  { tools: wireframeTools, fileName: "wireframeTools.ts" },
  { tools: searchTools, fileName: "searchTools.ts" },
  { tools: aiMlTools, fileName: "aiMlTools.ts" },
  { tools: hostingTools, fileName: "hostingTools.ts" },
  { tools: frameworkTools, fileName: "frameworkTools.ts" },
  { tools: testingTools, fileName: "testingTools.ts" },
  { tools: monitoringTools, fileName: "monitoringTools.ts" }
];

/**
 * Comprehensive validation report
 */
export interface ValidationReport {
  structuralValidation: {
    [fileName: string]: ValidationResult;
  };
  consistencyValidation: ReturnType<typeof validateAllToolConsistency>;
  urlValidation?: {
    [fileName: string]: Awaited<ReturnType<typeof validateToolUrls>>;
  };
  summary: {
    totalFiles: number;
    totalTools: number;
    filesWithErrors: number;
    filesWithWarnings: number;
    structuralErrors: number;
    consistencyErrors: number;
    urlErrors?: number;
    overallValid: boolean;
  };
}

/**
 * Validates all tool data files for structure and consistency
 */
export function validateAllToolData(): ValidationReport {
  const report: ValidationReport = {
    structuralValidation: {},
    consistencyValidation: validateAllToolConsistency(toolDataFiles),
    summary: {
      totalFiles: toolDataFiles.length,
      totalTools: 0,
      filesWithErrors: 0,
      filesWithWarnings: 0,
      structuralErrors: 0,
      consistencyErrors: 0,
      overallValid: true
    }
  };

  // Validate structure of each file
  for (const { tools, fileName } of toolDataFiles) {
    const validation = validateToolArray(tools, fileName);
    report.structuralValidation[fileName] = validation;
    
    report.summary.totalTools += tools.length;
    
    if (!validation.isValid) {
      report.summary.filesWithErrors++;
      report.summary.structuralErrors += validation.errors.length;
      report.summary.overallValid = false;
    }
    
    if (validation.warnings.length > 0) {
      report.summary.filesWithWarnings++;
    }
  }

  // Add consistency validation errors to summary
  if (!report.consistencyValidation.categoryConsistency.isConsistent ||
      !report.consistencyValidation.labelConsistency.isConsistent ||
      report.consistencyValidation.duplicates.hasDuplicates) {
    
    report.summary.consistencyErrors = 
      report.consistencyValidation.categoryConsistency.errors.length +
      report.consistencyValidation.labelConsistency.errors.length +
      (report.consistencyValidation.duplicates.hasDuplicates ? 1 : 0);
    
    report.summary.overallValid = false;
  }

  return report;
}

/**
 * Validates all tool data files including URL accessibility checks
 */
export async function validateAllToolDataWithUrls(): Promise<ValidationReport> {
  const report = validateAllToolData();
  
  report.urlValidation = {};
  let totalUrlErrors = 0;

  // Validate URLs for each file
  for (const { tools, fileName } of toolDataFiles) {
    if (tools.length > 0) {
      const urlValidation = await validateToolUrls(tools);
      report.urlValidation[fileName] = urlValidation;
      totalUrlErrors += urlValidation.summary.inaccessible;
    }
  }

  report.summary.urlErrors = totalUrlErrors;
  
  if (totalUrlErrors > 0) {
    report.summary.overallValid = false;
  }

  return report;
}

/**
 * Prints a formatted validation report to console
 */
export function printValidationReport(report: ValidationReport): void {
  console.log('\n=== TOOL DATA VALIDATION REPORT ===\n');
  
  // Summary
  console.log('📊 SUMMARY:');
  console.log(`   Total Files: ${report.summary.totalFiles}`);
  console.log(`   Total Tools: ${report.summary.totalTools}`);
  console.log(`   Overall Status: ${report.summary.overallValid ? '✅ VALID' : '❌ INVALID'}`);
  console.log('');

  // Structural validation
  console.log('🔍 STRUCTURAL VALIDATION:');
  let hasStructuralIssues = false;
  
  for (const [fileName, validation] of Object.entries(report.structuralValidation)) {
    const status = validation.isValid ? '✅' : '❌';
    const toolCount = toolDataFiles.find(f => f.fileName === fileName)?.tools.length || 0;
    
    console.log(`   ${status} ${fileName} (${toolCount} tools)`);
    
    if (validation.errors.length > 0) {
      hasStructuralIssues = true;
      validation.errors.forEach(error => console.log(`      ❌ ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => console.log(`      ⚠️  ${warning}`));
    }
  }
  
  if (!hasStructuralIssues) {
    console.log('   ✅ All files have valid structure');
  }
  console.log('');

  // Consistency validation
  console.log('🔄 CONSISTENCY VALIDATION:');
  
  const { categoryConsistency, labelConsistency, duplicates } = report.consistencyValidation;
  
  // Category consistency
  console.log(`   Categories: ${categoryConsistency.isConsistent ? '✅ Consistent' : '❌ Inconsistent'}`);
  if (categoryConsistency.errors.length > 0) {
    categoryConsistency.errors.forEach(error => console.log(`      ❌ ${error}`));
  }
  
  // Label consistency
  console.log(`   Labels: ${labelConsistency.isConsistent ? '✅ Consistent' : '❌ Inconsistent'}`);
  if (labelConsistency.warnings.length > 0) {
    labelConsistency.warnings.slice(0, 5).forEach(warning => console.log(`      ⚠️  ${warning}`));
    if (labelConsistency.warnings.length > 5) {
      console.log(`      ... and ${labelConsistency.warnings.length - 5} more warnings`);
    }
  }
  
  // Duplicates
  console.log(`   Duplicates: ${duplicates.hasDuplicates ? '❌ Found' : '✅ None'}`);
  if (duplicates.hasDuplicates) {
    duplicates.duplicates.forEach(duplicate => {
      console.log(`      ❌ ${duplicate.type} duplicate: ${duplicate.tools.map(t => t.tool.title).join(', ')}`);
    });
  }
  
  // Suggestions
  if (categoryConsistency.suggestions.length > 0 || labelConsistency.suggestions.length > 0) {
    console.log('\n💡 SUGGESTIONS:');
    [...categoryConsistency.suggestions, ...labelConsistency.suggestions]
      .slice(0, 10)
      .forEach(suggestion => console.log(`   💡 ${suggestion}`));
  }

  // URL validation (if available)
  if (report.urlValidation) {
    console.log('\n🌐 URL VALIDATION:');
    let totalAccessible = 0;
    let totalInaccessible = 0;
    
    for (const [fileName, urlValidation] of Object.entries(report.urlValidation)) {
      totalAccessible += urlValidation.summary.accessible;
      totalInaccessible += urlValidation.summary.inaccessible;
      
      if (urlValidation.summary.inaccessible > 0) {
        console.log(`   ❌ ${fileName}: ${urlValidation.summary.inaccessible} inaccessible URLs`);
        urlValidation.results
          .filter(r => !r.accessible)
          .slice(0, 3)
          .forEach(result => {
            console.log(`      ❌ ${result.tool.title}: ${result.error || `Status ${result.status}`}`);
          });
      }
    }
    
    console.log(`   📊 Total: ${totalAccessible} accessible, ${totalInaccessible} inaccessible`);
  }

  console.log('\n=== END REPORT ===\n');
}

/**
 * Quick validation function for development use
 */
export function quickValidate(): void {
  const report = validateAllToolData();
  printValidationReport(report);
}

/**
 * Full validation function including URL checks
 */
export async function fullValidate(): Promise<void> {
  console.log('🔍 Running full validation (including URL checks)...\n');
  const report = await validateAllToolDataWithUrls();
  printValidationReport(report);
}