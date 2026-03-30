import {test} from 'supertape';
import filteredList from '../filteredList';
import tools from '../../../data/tools';
import {subCategories} from '../../../data/categories';

describe('Filtering Integration with Expanded Tool Dataset', () => {
    test('should filter tools correctly for all new categories', () => {
        // Test AI & ML category
        const aiMlTools = filteredList(tools, subCategories.AI_ML);
        expect(aiMlTools.length).toBeGreaterThan(0);
        
        for (const tool of aiMlTools) {
            expect(tool.category).toMatch(/ai & ml/i);
        }
        
        // Test Hosting category
        const hostingTools = filteredList(tools, subCategories.HOSTING);
        expect(hostingTools.length).toBeGreaterThan(0);
        
        for (const tool of hostingTools) {
            expect(tool.category).toMatch(/hosting/i);
        }
        
        // Test Frameworks category
        const frameworkTools = filteredList(tools, subCategories.FRAMEWORKS);
        expect(frameworkTools.length).toBeGreaterThan(0);
        
        for (const tool of frameworkTools) {
            expect(tool.category).toMatch(/frameworks/i);
        }
        
        // Test Testing category
        const testingTools = filteredList(tools, subCategories.TESTING);
        expect(testingTools.length).toBeGreaterThan(0);
        
        for (const tool of testingTools) {
            expect(tool.category).toMatch(/testing/i);
        }
        
        // Test Monitoring category
        const monitoringTools = filteredList(tools, subCategories.MONITORING);
        expect(monitoringTools.length).toBeGreaterThan(0);
        
        for (const tool of monitoringTools) {
            expect(tool.category).toMatch(/monitoring/i);
        }
    });
    
    test('should return all tools when no category is specified', (t) => {
        const allTools = filteredList(tools);
        t.equal(allTools, tools);
        expect(allTools.length).toBeGreaterThan(50); // Ensure we have a substantial dataset
        t.end();
    });
    
    test('should return all tools when \'all\' category is specified', (t) => {
        const allTools = filteredList(tools, 'all');
        t.equal(allTools, tools);
        t.end();
    });
    
    test('should handle case-insensitive filtering', (t) => {
        const designToolsLower = filteredList(tools, 'design');
        const designToolsUpper = filteredList(tools, 'DESIGN');
        const designToolsMixed = filteredList(tools, 'Design');
        
        t.equal(designToolsLower, designToolsUpper);
        t.equal(designToolsLower, designToolsMixed);
        expect(designToolsLower.length).toBeGreaterThan(0);
        t.end();
    });
    
    test('should return empty array for non-existent categories', (t) => {
        const nonExistentTools = filteredList(tools, 'NonExistentCategory');
        t.deepEqual(nonExistentTools, []);
        t.end();
    });
    
    test('should verify all categories have tools', () => {
        // Ensure each category in subCategories has at least one tool
        for (const category of Object.values(subCategories)) {
            const categoryTools = filteredList(tools, category);
            
            expect(categoryTools.length).toBeGreaterThan(0, `Category "${category}" should have at least one tool`);
        }
    });
    
    test('should verify expanded dataset contains expected new tools', () => {
        // Check that we have tools in new categories that weren't there before
        const aiMlTools = filteredList(tools, 'AI & ML');
        const hostingTools = filteredList(tools, 'Hosting');
        const frameworkTools = filteredList(tools, 'Frameworks');
        
        // Verify we have a reasonable number of tools in each new category
        expect(aiMlTools.length).toBeGreaterThanOrEqual(5);
        expect(hostingTools.length).toBeGreaterThanOrEqual(5);
        expect(frameworkTools.length).toBeGreaterThanOrEqual(5);
    });
    
    test('should maintain data integrity across all tools', () => {
        // Verify all tools have required properties
        for (const tool of tools) {
            expect(tool).toHaveProperty('title');
            expect(tool).toHaveProperty('url');
            expect(tool).toHaveProperty('description');
            expect(tool).toHaveProperty('category');
            expect(tool).toHaveProperty('labels');
            expect(typeof tool.title).toBe('string');
            expect(typeof tool.url).toBe('string');
            expect(typeof tool.description).toBe('string');
            expect(typeof tool.category).toBe('string');
            expect(Array.isArray(tool.labels)).toBe(true);
        }
    });
    
    test('should verify category consistency', () => {
        // Check that all tool categories match defined categories
        const definedCategories = Object.values(subCategories);
        const toolCategories = [...new Set(tools.map((tool) => tool.category))];
        
        for (const category of toolCategories) {
            expect(definedCategories).toContain(category);
        }
    });
});
