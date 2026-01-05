import { subCategories } from "./categories";
import labels from "./labels";
import type { TTool } from "../types/tools.d";

const testingTools: TTool[] = [
    {
        title: "Playwright",
        url: "https://playwright.dev/",
        description: `Modern end-to-end testing framework for web applications that works across all browsers. 
        Provides reliable testing with auto-wait, powerful selectors, and comprehensive debugging tools.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.engineering, labels.automation, labels.browser, labels.e2e],
    },
    {
        title: "Cypress",
        url: "https://www.cypress.io/",
        description: `JavaScript end-to-end testing framework that makes testing fast, easy, and reliable. 
        Features real-time browser preview, time-travel debugging, and excellent developer experience.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.engineering, labels.automation, labels.browser, labels.e2e],
    },
    {
        title: "Vitest",
        url: "https://vitest.dev/",
        description: `Blazing fast unit testing framework powered by Vite with Jest-compatible API. 
        Provides instant feedback, TypeScript support, and excellent integration with modern build tools.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.engineering, labels.typescript, labels.performance, labels.unit],
    },
    {
        title: "Jest",
        url: "https://jestjs.io/",
        description: `Delightful JavaScript testing framework with focus on simplicity and comprehensive features. 
        Includes built-in mocking, code coverage, and snapshot testing capabilities.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.engineering, labels.javascript, labels.unit, labels.mocking],
    },
    {
        title: "Testing Library",
        url: "https://testing-library.com/",
        description: `Family of packages that help test UI components in a user-centric way. 
        Encourages better testing practices by focusing on how users interact with applications.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.engineering, labels.react, labels.accessibility, labels.unit],
    },
    {
        title: "Storybook",
        url: "https://storybook.js.org/",
        description: `Tool for building UI components and pages in isolation with comprehensive testing capabilities. 
        Enables visual testing, interaction testing, and component documentation.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.design, labels.react, labels.documentation, labels.visual],
    },
    {
        title: "Puppeteer",
        url: "https://pptr.dev/",
        description: `Node.js library that provides high-level API to control Chrome/Chromium browsers. 
        Excellent for automated testing, web scraping, and generating PDFs or screenshots.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.automation, labels.nodejs, labels.browser, labels.scraping],
    },
    {
        title: "WebdriverIO",
        url: "https://webdriver.io/",
        description: `Next-gen browser and mobile automation test framework for Node.js. 
        Supports multiple testing protocols and provides extensive plugin ecosystem.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.automation, labels.mobile, labels.browser, labels.e2e],
    },
    {
        title: "Selenium",
        url: "https://www.selenium.dev/",
        description: `Portable framework for testing web applications across different browsers and platforms. 
        Industry standard for automated browser testing with support for multiple programming languages.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.automation, labels.browser, labels.e2e, labels.crossplatform],
    },
    {
        title: "Mocha",
        url: "https://mochajs.org/",
        description: `Feature-rich JavaScript test framework running on Node.js and in the browser. 
        Provides flexible and accurate reporting with support for asynchronous testing.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.javascript, labels.nodejs, labels.async, labels.reporting],
    },
    {
        title: "Jasmine",
        url: "https://jasmine.github.io/",
        description: `Behavior-driven development framework for testing JavaScript code. 
        Provides clean syntax for writing tests without dependencies on other JavaScript frameworks.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.javascript, labels.bdd, labels.unit, labels.framework],
    },
    {
        title: "Karma",
        url: "https://karma-runner.github.io/",
        description: `Test runner that allows testing JavaScript code in multiple real browsers. 
        Provides continuous integration support and works with popular testing frameworks.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.browser, labels.ci, labels.runner, labels.integration],
    },
    {
        title: "Chromatic",
        url: "https://www.chromatic.com/",
        description: `Visual testing platform for Storybook that catches UI bugs automatically. 
        Provides visual regression testing, review workflows, and component library publishing.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.visual, labels.design, labels.regression, labels.collaboration],
    },
    {
        title: "Percy",
        url: "https://percy.io/",
        description: `Visual testing and review platform that integrates with your existing workflow. 
        Automatically detects visual changes and provides collaborative review tools.`,
        price: 0,
        category: subCategories.TESTING,
        labels: [labels.testing, labels.visual, labels.regression, labels.collaboration, labels.ci],
    }
];

export default testingTools;