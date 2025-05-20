export interface IPost {
    frontmatter: {
        pubDate?: Date;
        published?: string;
        title: string;
        description: string;
    }
    url: string;
}