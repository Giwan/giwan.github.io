# blog.mytoori.com

This is a blog built with astro. The original [readme is in the docs folder]("./docs/Astro-README.md"). 
One of the main benefits for using Astro is the **islands architecture**. Most of the site is static. Only those areas that need some interactivity (islands) are given that with a **small** bundle of JavaScript. 

The end result is a mucht lighter page with the interactivity benefits. 

## The content
The first page lists the articles. These are written in markdown or **mdx**. The articles can be found in `src/pages/blog`. 
Each folder in the `blog` folder is an article. It starts with the `index.mdx` file. Other related content like images, videos or even components that are specific to that article can be placed inside the folder. 

### Drafts
There is a separate drafts folder next to the blog folder. There all the draft articles are kept. This because it's a bit tricky to get astro to only read "published" articles. 
Having them in a separate drafts folder means less smart solutions that need to be built and maintained (for now)

## Search 
There is a search feature. 
An index can either be manually created or is created on deploy. 
Users can search per keyword which searches the title of the article which is based on the folder name of the article.

# Tools
There is a [tools page]("/tools") that allows the user to see the listed tools. They can be subfiltered by category. 

## Islands architecture 

# Deploy
The blog is deployed on [GitHub Pages](https://giwan.github.io) now. Previously it was deployed on [Netlify](https://app.netlify.com/sites/giwan-astro-blog/overview) and [Deno Deploy](https://dash.deno.com/projects/mytoori-blog).

## Static hosting on GitHub Pages

The project is configured to build to the `docs` directory, which is a supported publishing source for GitHub Pages. In the `astro.config.mjs` file, you'll find:

```js
output: "static",
outDir: "./docs",
```

This configuration tells Astro to build the site as static assets in the `docs` folder.

### GitHub Pages Configuration

To deploy the site:

1. Push your changes to the main branch of your repository
2. Ensure your repository settings have GitHub Pages enabled and set to use the `docs` folder from the main branch
3. GitHub will automatically build and deploy your site when changes are pushed

No additional build step or deployment CLI is required, as GitHub Pages handles this automatically when changes are detected in the repository.

### Running Locally

To test the site locally:

```sh
npm run dev     # Start development server
npm run build   # Build the site
npm run preview # Preview the built site
```

The `build` script also runs the `populateSearchData` script to ensure the search index is up to date.
