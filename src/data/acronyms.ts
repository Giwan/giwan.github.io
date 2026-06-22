export interface AcronymDefinition {
  acronym: string;
  fullForm: string;
  description?: string;
  url?: string;
}

export const acronyms: AcronymDefinition[] = [
  { acronym: 'AI', fullForm: 'Artificial Intelligence', url: 'https://en.wikipedia.org/wiki/Artificial_intelligence' },
  { acronym: 'API', fullForm: 'Application Programming Interface', url: 'https://en.wikipedia.org/wiki/API' },
  { acronym: 'AST', fullForm: 'Abstract Syntax Tree', url: 'https://en.wikipedia.org/wiki/Abstract_syntax_tree' },
  { acronym: 'CI', fullForm: 'Continuous Integration', url: 'https://en.wikipedia.org/wiki/Continuous_integration' },
  { acronym: 'CD', fullForm: 'Continuous Deployment', url: 'https://en.wikipedia.org/wiki/Continuous_deployment' },
  { acronym: 'CLI', fullForm: 'Command Line Interface', url: 'https://en.wikipedia.org/wiki/Command-line_interface' },
  { acronym: 'CSS', fullForm: 'Cascading Style Sheets', url: 'https://en.wikipedia.org/wiki/CSS' },
  { acronym: 'DOM', fullForm: 'Document Object Model', url: 'https://en.wikipedia.org/wiki/Document_Object_Model' },
  { acronym: 'ESLint', fullForm: 'ECMAScript Linting Utility', url: 'https://eslint.org/' },
  { acronym: 'ESM', fullForm: 'ECMAScript Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
  { acronym: 'Git', fullForm: 'Global Information Tracker', url: 'https://git-scm.com/' },
  { acronym: 'HTML', fullForm: 'HyperText Markup Language', url: 'https://en.wikipedia.org/wiki/HTML' },
  { acronym: 'HTTP', fullForm: 'HyperText Transfer Protocol', url: 'https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol' },
  { acronym: 'HTTPS', fullForm: 'HyperText Transfer Protocol Secure', url: 'https://en.wikipedia.org/wiki/HTTPS' },
  { acronym: 'IDE', fullForm: 'Integrated Development Environment', url: 'https://en.wikipedia.org/wiki/Integrated_development_environment' },
  { acronym: 'JSON', fullForm: 'JavaScript Object Notation', url: 'https://en.wikipedia.org/wiki/JSON' },
  { acronym: 'JSX', fullForm: 'JavaScript XML', url: 'https://react.dev/learn/writing-markup-with-jsx' },
  { acronym: 'LLM', fullForm: 'Large Language Model', url: 'https://en.wikipedia.org/wiki/Large_language_model' },
  { acronym: 'MCP', fullForm: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/' },
  { acronym: 'MDX', fullForm: 'Markdown with JSX', url: 'https://mdxjs.com/' },
  { acronym: 'MFA', fullForm: 'Multi-Factor Authentication', url: 'https://en.wikipedia.org/wiki/Multi-factor_authentication' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', url: 'https://en.wikipedia.org/wiki/Mixture_of_experts' },
  { acronym: 'MPA', fullForm: 'Multi-Page Application', url: 'https://en.wikipedia.org/wiki/Multi-page_application' },
  { acronym: 'NPM', fullForm: 'Node Package Manager', url: 'https://www.npmjs.com/' },
  { acronym: 'OCR', fullForm: 'Optical Character Recognition', url: 'https://en.wikipedia.org/wiki/Optical_character_recognition' },
  { acronym: 'PWA', fullForm: 'Progressive Web App', url: 'https://en.wikipedia.org/wiki/Progressive_web_app' },
  { acronym: 'React', fullForm: 'React (JavaScript Library)', url: 'https://react.dev/' },
  { acronym: 'REST', fullForm: 'Representational State Transfer', url: 'https://en.wikipedia.org/wiki/REST' },
  { acronym: 'RSS', fullForm: 'Really Simple Syndication', url: 'https://en.wikipedia.org/wiki/RSS' },
  { acronym: 'RTK', fullForm: 'Redux Toolkit', url: 'https://redux-toolkit.js.org/' },
  { acronym: 'SEO', fullForm: 'Search Engine Optimization', url: 'https://en.wikipedia.org/wiki/Search_engine_optimization' },
  { acronym: 'SPA', fullForm: 'Single Page Application', url: 'https://en.wikipedia.org/wiki/Single-page_application' },
  { acronym: 'SQL', fullForm: 'Structured Query Language', url: 'https://en.wikipedia.org/wiki/SQL' },
  { acronym: 'SSE', fullForm: 'Server-Sent Events', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events' },
  { acronym: 'SSR', fullForm: 'Server-Side Rendering', url: 'https://en.wikipedia.org/wiki/Server-side_rendering' },
  { acronym: 'SSG', fullForm: 'Static Site Generation', url: 'https://en.wikipedia.org/wiki/Static_site_generator' },
  { acronym: 'SVG', fullForm: 'Scalable Vector Graphics', url: 'https://en.wikipedia.org/wiki/SVG' },
  { acronym: 'SWE-bench', fullForm: 'Software Engineering Benchmark', url: 'https://www.swebench.com/' },
  { acronym: 'TS', fullForm: 'TypeScript', url: 'https://www.typescriptlang.org/' },
  { acronym: 'UI', fullForm: 'User Interface', url: 'https://en.wikipedia.org/wiki/User_interface' },
  { acronym: 'URL', fullForm: 'Uniform Resource Locator', url: 'https://en.wikipedia.org/wiki/URL' },
  { acronym: 'UX', fullForm: 'User Experience', url: 'https://en.wikipedia.org/wiki/User_experience' },
  { acronym: 'VCS', fullForm: 'Version Control System', url: 'https://en.wikipedia.org/wiki/Version_control' },
  { acronym: 'WCAG', fullForm: 'Web Content Accessibility Guidelines', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
  { acronym: 'WebSocket', fullForm: 'WebSocket Protocol', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket' },
  { acronym: 'WYSIWYG', fullForm: 'What You See Is What You Get', url: 'https://en.wikipedia.org/wiki/WYSIWYG' },
  { acronym: 'XML', fullForm: 'eXtensible Markup Language', url: 'https://en.wikipedia.org/wiki/XML' },
  { acronym: 'YAML', fullForm: 'YAML Ain\'t Markup Language', url: 'https://yaml.org/' },
];

export const acronymSet = new Set(acronyms.map(a => a.acronym.toLowerCase()));

export function getAcronymDefinition(acronym: string): AcronymDefinition | undefined {
  return acronyms.find(a => a.acronym.toLowerCase() === acronym.toLowerCase());
}