# Tool Data Validation Utilities

This directory contains comprehensive validation utilities for the tools system, ensuring data quality and consistency across all tool entries.

## Overview

The validation system provides three main types of validation:

1. **Structural Validation** - Validates tool entry structure, required fields, and data types
2. **Consistency Validation** - Ensures categories and labels are consistent across files
3. **URL Validation** - Checks URL accessibility (optional, requires network requests)

## Files

### Core Validation Utilities

- `toolValidation.ts` - Core validation functions for individual tools and tool arrays
- `toolConsistencyChecks.ts` - Category, label consistency, and duplicate detection
- `validateAllTools.ts` - Comprehensive validation orchestration and reporting

### Scripts

- `scripts/validate-tools.js` - CLI script for running validations
- Package.json scripts:
  - `npm run validate:tools` - Full validation with detailed output
  - `npm run validate:tools:quick` - Quick validation with minimal output
  - `npm run validate:tools:urls` - Full validation including URL accessibility checks

## Usage

### Quick Validation

```bash
npm run validate:tools:quick
```

This runs a basic structural validation of all tool data files.

### Full Validation

```bash
npm run validate:tools
```

This runs comprehensive validation including:
- Structural validation of all tool entries
- Category and label consistency checks
- Duplicate detection across all files
- Detailed reporting with suggestions

### URL Validation (Network Required)

```bash
npm run validate:tools:urls
```

This includes all validations plus URL accessibility checks. Note: This requires network access and may take longer.

### Programmatic Usage

```typescript
import { validateAllToolData, printValidationReport } from './utils/validateAllTools';

// Quick validation
const report = validateAllToolData();
printValidationReport(report);

// With URL validation
const fullReport = await validateAllToolDataWithUrls();
printValidationReport(fullReport);
```

## Validation Rules

### Required Fields

Every tool entry must have:
- `title` (non-empty string)
- `url` (valid HTTP/HTTPS URL)
- `description` (non-empty string, recommended 20+ characters)
- `price` (non-negative number)
- `category` (must exist in categories.ts)
- `labels` (array of strings)

### Optional Fields

- `currency` (3-character string, e.g., "USD")
- `dateAdded` (valid date string)
- `lastVerified` (valid date string)

### Category Validation

- All categories must be defined in `src/data/categories.ts`
- Each tool must have exactly one category
- Category names are case-sensitive

### Label Validation

- Labels should be from the predefined list in `src/data/labels.ts`
- Unknown labels generate warnings (not errors)
- Empty label arrays generate warnings
- Duplicate labels within a tool generate warnings

### URL Validation

- Must be valid HTTP or HTTPS URLs
- Accessibility checks verify the URL responds successfully
- Timeout set to 5 seconds per URL
- Processed in batches to avoid overwhelming servers

### Duplicate Detection

The system detects three types of duplicates:
- **Exact duplicates** - Same title and URL
- **Title duplicates** - Same title, different URL
- **URL duplicates** - Same URL, different title

## Validation Report

The validation report includes:

```
📊 SUMMARY:
   Total Files: 15
   Total Tools: 164
   Overall Status: ✅ VALID

🔍 STRUCTURAL VALIDATION:
   ✅ All files have valid structure

🔄 CONSISTENCY VALIDATION:
   Categories: ✅ Consistent
   Labels: ✅ Consistent
   Duplicates: ✅ None

💡 SUGGESTIONS:
   [Any suggestions for improvements]
```

## Adding New Tools

When adding new tools, ensure:

1. **Use existing categories** - Check `src/data/categories.ts` for available categories
2. **Use predefined labels** - Check `src/data/labels.ts` for available labels
3. **Provide good descriptions** - At least 20 characters, describe what the tool does
4. **Verify URLs** - Ensure URLs are accessible and current
5. **Run validation** - Always run `npm run validate:tools` before committing

## Extending Validation

To add new validation rules:

1. **For structural validation** - Modify `validateToolEntry()` in `toolValidation.ts`
2. **For consistency checks** - Add functions to `toolConsistencyChecks.ts`
3. **For new validation types** - Update `validateAllTools.ts` to orchestrate new checks
4. **Add tests** - Create tests in `__tests__/toolValidation.test.ts`

## Testing

Run validation tests:

```bash
npm test -- --testPathPatterns=toolValidation
```

The test suite covers:
- Individual tool validation
- Array validation
- Category consistency
- Label consistency
- Duplicate detection
- URL format validation

## Performance Considerations

- **Structural validation** - Fast, runs in milliseconds
- **Consistency validation** - Fast, processes all tools in memory
- **URL validation** - Slow, requires network requests (5s timeout per URL)
- **Batch processing** - URLs processed in batches of 5 to avoid overwhelming servers

## Error Handling

The validation system uses a structured approach:
- **Errors** - Critical issues that make tools invalid
- **Warnings** - Issues that should be addressed but don't break functionality
- **Suggestions** - Recommendations for improvements

All validation functions return structured results with separate arrays for errors, warnings, and suggestions.