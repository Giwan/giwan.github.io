import {
    validateToolArray,
    validateToolUrls,
    ValidationResult,
} from './toolValidation';
import {validateAllToolConsistency} from './toolConsistencyChecks';
// Import all tool data files
import readingTools from '../data/readingTools';
import designTools from '../data/designTools';
import developerTools from '../data/developerTools';
import softwareTools from '../data/softwareTools';
import writingTools from '../data/writingTools';
import projectManagementTools from '../data/projectManagementTools';
import socialTools from '../data/socialTools';
import dataTools from '../data/dataTools';
import wireframeTools from '../data/wireframeTools';
import searchTools from '../data/searchTools';
import aiMlTools from '../data/aiMlTools';
import hostingTools from '../data/hostingTools';
import frameworkTools from '../data/frameworkTools';
import testingTools from '../data/testingTools';
import monitoringTools from '../data/monitoringTools';


/**
 * All tool data files with their names for validation
 */
const toolDataFiles = [{
    tools: readingTools,
    fileName: 'readingTools.ts',
}, {
    tools: designTools,
    fileName: 'designTools.ts',
}, {
    tools: developerTools,
    fileName: 'developerTools.ts',
}, {
    tools: softwareTools,
    fileName: 'softwareTools.ts',
}, {
    tools: writingTools,
    fileName: 'writingTools.ts',
}, {
    tools: projectManagementTools,
    fileName: 'projectManagementTools.ts',
}, {
    tools: socialTools,
    fileName: 'socialTools.ts',
}, {
    tools: dataTools,
    fileName: 'dataTools.ts',
}, {
    tools: wireframeTools,
    fileName: 'wireframeTools.ts',
}, {
    tools: searchTools,
    fileName: 'searchTools.ts',
}, {
    tools: aiMlTools,
    fileName: 'aiMlTools.ts',
}, {
    tools: hostingTools,
    fileName: 'hostingTools.ts',
}, {
    tools: frameworkTools,
    fileName: 'frameworkTools.ts',
}, {
    tools: testingTools,
    fileName: 'testingTools.ts',
}, {
    tools: monitoringTools,
    fileName: 'monitoringTools.ts',
}];

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
            overallValid: true,
        },
    };
    
    // Validate structure of each file
    for (const {tools, fileName} of toolDataFiles) {
        const validation = validateToolArray(tools, fileName);
        
        report.structuralValidation[fileName] = validation;
        
        report.summary.totalTools += tools.length;
        
        if (!validation.isValid) {
            report.summary.filesWithErrors++;
            report.summary.structuralErrors += validation.errors.length;
            report.summary.overallValid = false;
        }
        
        if (validation.warnings.length > 0)
            report.summary.filesWithWarnings++;
    }
    
    // Add consistency validation errors to summary
    if (!report.consistencyValidation.categoryConsistency.isConsistent || !report.consistencyValidation.labelConsistency.isConsistent || report.consistencyValidation.duplicates.hasDuplicates) {
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
    for (const {tools, fileName} of toolDataFiles) {
        if (tools.length > 0) {
            const urlValidation = await validateToolUrls(tools);
            
            report.urlValidation[fileName] = urlValidation;
            totalUrlErrors += urlValidation.summary.inaccessible;
        }
    }
    
    report.summary.urlErrors = totalUrlErrors;
    
    if (totalUrlErrors > 0)
        report.summary.overallValid = false;
    
    return report;
}

/**
 * Prints a formatted validation report to console
 */
export function printValidationReport(): void {
    // TODO: Implement report printing
}
/**
 * Quick validation function for development use
 */
export function quickValidate(): void {
    printValidationReport();
}

/**
 * Full validation function including URL checks
 */
export function fullValidate(): void {
    printValidationReport();
}
