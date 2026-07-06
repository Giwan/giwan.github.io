import { getFriendlyPageTitle, formatNavigationAnnouncement } from '../announcements.domain';

describe('Announcements Domain', () => {
  it('gets friendly title for home', () => {
    expect(getFriendlyPageTitle('/')).toBe('Home');
  });

  it('gets friendly title for blog post', () => {
    expect(getFriendlyPageTitle('/blog/hello')).toBe('Blog Article');
  });

  it('formats navigation announcement', () => {
    expect(formatNavigationAnnouncement('Home', 'Blog')).toBe('Navigating from Home to Blog');
  });
});
