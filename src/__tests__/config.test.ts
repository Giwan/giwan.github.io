import { FrameworkConfigSchema } from '../schemas/config';

describe('Framework Configuration Schema', () => {
  it('validates a valid configuration', () => {
    const validConfig = {
      site: {
        title: 'Test Blog',
        description: 'A test description',
        author: 'Test Author',
        siteUrl: 'https://example.com',
        social: {
          twitter: '@test',
        },
      },
      navigation: {
        header: [{ label: 'Home', href: '/' }],
        footer: [{ label: 'Privacy', href: '/privacy' }],
      },
      features: {
        enableSearch: true,
      },
      theme: {
        active: 'minimal',
      },
      routing: {
        homepage: 'blog',
      },
      assets: {
        favicon: '/favicon.svg',
      },
      publication: {
          issueNumber: 1
      }
    };

    const result = FrameworkConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('fails on invalid configuration (missing site title)', () => {
    const invalidConfig = {
      site: {
        description: 'Missing title',
        author: 'Test Author',
        siteUrl: 'https://example.com',
      },
    };

    const result = FrameworkConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('fails on invalid URL', () => {
    const invalidConfig = {
      site: {
        title: 'Test Blog',
        description: 'Test description',
        author: 'Test Author',
        siteUrl: 'not-a-url',
      },
    };

    const result = FrameworkConfigSchema.safeParse(invalidConfig);
    expect(result.success).toBe(false);
  });

  it('applies default values', () => {
    const minimalConfig = {
        site: {
          title: 'Test Blog',
          description: 'A test description',
          author: 'Test Author',
          siteUrl: 'https://example.com',
          social: {},
        },
        navigation: {
          header: [],
          footer: [],
        }
    };

    const result = FrameworkConfigSchema.parse(minimalConfig);
    expect(result.site.lang).toBe('en');
    expect(result.features.enableSearch).toBe(true);
    expect(result.theme.active).toBe('newspaper');
    expect(result.routing.homepage).toBe('blog');
  });
});
