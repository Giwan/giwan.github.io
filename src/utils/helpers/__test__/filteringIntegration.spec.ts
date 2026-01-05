import filteredList from "../filteredList";
import tools from "../../../data/tools";
import { subCategories } from "../../../data/categories";

describe("Filtering Integration with Expanded Tool Dataset", () => {
  it("should filter tools correctly for all new categories", () => {
    // Test AI & ML category
    const aiMlTools = filteredList(tools, subCategories.AI_ML);
    expect(aiMlTools.length).toBeGreaterThan(0);
    aiMlTools.forEach(tool => {
      expect(tool.category).toMatch(/ai & ml/i);
    });

    // Test Hosting category
    const hostingTools = filteredList(tools, subCategories.HOSTING);
    expect(hostingTools.length).toBeGreaterThan(0);
    hostingTools.forEach(tool => {
      expect(tool.category).toMatch(/hosting/i);
    });

    // Test Frameworks category
    const frameworkTools = filteredList(tools, subCategories.FRAMEWORKS);
    expect(frameworkTools.length).toBeGreaterThan(0);
    frameworkTools.forEach(tool => {
      expect(tool.category).toMatch(/frameworks/i);
    });

    // Test Testing category
    const testingTools = filteredList(tools, subCategories.TESTING);
    expect(testingTools.length).toBeGreaterThan(0);
    testingTools.forEach(tool => {
      expect(tool.category).toMatch(/testing/i);
    });

    // Test Monitoring category
    const monitoringTools = filteredList(tools, subCategories.MONITORING);
    expect(monitoringTools.length).toBeGreaterThan(0);
    monitoringTools.forEach(tool => {
      expect(tool.category).toMatch(/monitoring/i);
    });
  });

  it("should return all tools when no category is specified", () => {
    const allTools = filteredList(tools);
    expect(allTools).toEqual(tools);
    expect(allTools.length).toBeGreaterThan(50); // Ensure we have a substantial dataset
  });

  it("should return all tools when 'all' category is specified", () => {
    const allTools = filteredList(tools, "all");
    expect(allTools).toEqual(tools);
  });

  it("should handle case-insensitive filtering", () => {
    const designToolsLower = filteredList(tools, "design");
    const designToolsUpper = filteredList(tools, "DESIGN");
    const designToolsMixed = filteredList(tools, "Design");
    
    expect(designToolsLower).toEqual(designToolsUpper);
    expect(designToolsLower).toEqual(designToolsMixed);
    expect(designToolsLower.length).toBeGreaterThan(0);
  });

  it("should return empty array for non-existent categories", () => {
    const nonExistentTools = filteredList(tools, "NonExistentCategory");
    expect(nonExistentTools).toEqual([]);
  });

  it("should verify all categories have tools", () => {
    // Ensure each category in subCategories has at least one tool
    Object.values(subCategories).forEach(category => {
      const categoryTools = filteredList(tools, category);
      expect(categoryTools.length).toBeGreaterThan(0, 
        `Category "${category}" should have at least one tool`);
    });
  });

  it("should verify expanded dataset contains expected new tools", () => {
    // Check that we have tools in new categories that weren't there before
    const aiMlTools = filteredList(tools, "AI & ML");
    const hostingTools = filteredList(tools, "Hosting");
    const frameworkTools = filteredList(tools, "Frameworks");
    
    // Verify we have a reasonable number of tools in each new category
    expect(aiMlTools.length).toBeGreaterThanOrEqual(5);
    expect(hostingTools.length).toBeGreaterThanOrEqual(5);
    expect(frameworkTools.length).toBeGreaterThanOrEqual(5);
  });

  it("should maintain data integrity across all tools", () => {
    // Verify all tools have required properties
    tools.forEach(tool => {
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
    });
  });

  it("should verify category consistency", () => {
    // Check that all tool categories match defined categories
    const definedCategories = Object.values(subCategories);
    const toolCategories = [...new Set(tools.map(tool => tool.category))];
    
    toolCategories.forEach(category => {
      expect(definedCategories).toContain(category);
    });
  });
});