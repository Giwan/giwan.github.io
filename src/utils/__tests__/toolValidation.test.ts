import { validateToolEntry, validateToolArray, validateUrlFormat } from '../toolValidation';
import { validateCategoryConsistency, validateLabelConsistency, detectDuplicateTools } from '../toolConsistencyChecks';
import type { TTool } from '../../types/tools.d';
import { subCategories } from '../../data/categories';
import labels from '../../data/labels';

describe('Tool Validation', () => {
  const validTool: TTool = {
    title: 'Test Tool',
    url: 'https://example.com',
    description: 'This is a test tool with a proper description that is long enough',
    price: 0,
    category: subCategories.DEVELOPER,
    labels: [labels.engineering, labels.productivity]
  };

  describe('validateToolEntry', () => {
    it('should validate a correct tool entry', () => {
      const result = validateToolEntry(validTool);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidTool = { title: 'Test' };
      const result = validateToolEntry(invalidTool);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate URL format', () => {
      const toolWithInvalidUrl = { ...validTool, url: 'not-a-url' };
      const result = validateToolEntry(toolWithInvalidUrl);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('valid HTTP/HTTPS URL'))).toBe(true);
    });

    it('should validate category exists', () => {
      const toolWithInvalidCategory = { ...validTool, category: 'NonExistentCategory' };
      const result = validateToolEntry(toolWithInvalidCategory);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('category'))).toBe(true);
    });

    it('should warn about short descriptions', () => {
      const toolWithShortDescription = { ...validTool, description: 'Short' };
      const result = validateToolEntry(toolWithShortDescription);
      expect(result.warnings.some(warning => warning.includes('quite short'))).toBe(true);
    });
  });

  describe('validateToolArray', () => {
    it('should validate an array of tools', () => {
      const tools = [validTool, { ...validTool, title: 'Another Tool' }];
      const result = validateToolArray(tools);
      expect(result.isValid).toBe(true);
    });

    it('should detect invalid array input', () => {
      const result = validateToolArray('not an array' as any);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Must export an array'))).toBe(true);
    });
  });

  describe('validateUrlFormat', () => {
    it('should validate correct URLs', () => {
      expect(validateUrlFormat('https://example.com')).toBe(true);
      expect(validateUrlFormat('http://test.org/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrlFormat('not-a-url')).toBe(false);
      expect(validateUrlFormat('ftp://example.com')).toBe(false);
    });
  });
});

describe('Tool Consistency Checks', () => {
  const validTools: TTool[] = [
    {
      title: 'Tool 1',
      url: 'https://example1.com',
      description: 'First tool with proper description length',
      price: 0,
      category: subCategories.DEVELOPER,
      labels: [labels.engineering]
    },
    {
      title: 'Tool 2', 
      url: 'https://example2.com',
      description: 'Second tool with proper description length',
      price: 10,
      category: subCategories.DESIGN,
      labels: [labels.design, labels.productivity]
    }
  ];

  describe('validateCategoryConsistency', () => {
    it('should pass for valid categories', () => {
      const result = validateCategoryConsistency(validTools);
      expect(result.isConsistent).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid categories', () => {
      const toolsWithInvalidCategory = [
        { ...validTools[0], category: 'InvalidCategory' }
      ];
      const result = validateCategoryConsistency(toolsWithInvalidCategory);
      expect(result.isConsistent).toBe(false);
      expect(result.errors.some(error => error.includes('Invalid category'))).toBe(true);
    });
  });

  describe('validateLabelConsistency', () => {
    it('should pass for valid labels', () => {
      const result = validateLabelConsistency(validTools);
      expect(result.isConsistent).toBe(true);
    });

    it('should warn about invalid labels', () => {
      const toolsWithInvalidLabel = [
        { ...validTools[0], labels: ['invalid-label'] }
      ];
      const result = validateLabelConsistency(toolsWithInvalidLabel);
      expect(result.warnings.some(warning => warning.includes('not in predefined labels'))).toBe(true);
    });

    it('should warn about missing labels', () => {
      const toolsWithoutLabels = [
        { ...validTools[0], labels: [] }
      ];
      const result = validateLabelConsistency(toolsWithoutLabels);
      expect(result.warnings.some(warning => warning.includes('No labels specified'))).toBe(true);
    });
  });

  describe('detectDuplicateTools', () => {
    it('should detect exact duplicates', () => {
      const toolsData = [{
        tools: [validTools[0], validTools[0]], // Same tool twice
        fileName: 'test.ts'
      }];
      
      const result = detectDuplicateTools(toolsData);
      expect(result.hasDuplicates).toBe(true);
      expect(result.duplicates.some(dup => dup.type === 'exact')).toBe(true);
    });

    it('should detect title duplicates', () => {
      const duplicateTitle = { ...validTools[1], title: validTools[0].title };
      const toolsData = [{
        tools: [validTools[0], duplicateTitle],
        fileName: 'test.ts'
      }];
      
      const result = detectDuplicateTools(toolsData);
      expect(result.hasDuplicates).toBe(true);
      expect(result.duplicates.some(dup => dup.type === 'title')).toBe(true);
    });

    it('should detect URL duplicates', () => {
      const duplicateUrl = { ...validTools[1], url: validTools[0].url };
      const toolsData = [{
        tools: [validTools[0], duplicateUrl],
        fileName: 'test.ts'
      }];
      
      const result = detectDuplicateTools(toolsData);
      expect(result.hasDuplicates).toBe(true);
      expect(result.duplicates.some(dup => dup.type === 'url')).toBe(true);
    });

    it('should pass for unique tools', () => {
      const toolsData = [{
        tools: validTools,
        fileName: 'test.ts'
      }];
      
      const result = detectDuplicateTools(toolsData);
      expect(result.hasDuplicates).toBe(false);
    });
  });
});