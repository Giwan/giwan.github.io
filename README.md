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
The blog is deployed at [deno.land](https://dash.deno.com/projects/mytoori-blog) now. Previously it was deployed on [Netlify](https://app.netlify.com/sites/giwan-astro-blog/overview). 
This allows for easily [tracking analytics](https://dash.deno.com/projects/mytoori-blog/analytics/24h) for the site. 
It might not be very reliable but it's better than nothing. Plus it means there is little dependencies to add. 

## Server side rendering (not required after all)
On [Netlify](https://app.netlify.com/sites/giwan-astro-blog/overview) the site was hosted as a static site. 
dash.deno.com does not offer static hosting [according to the guide on astro.build](https://docs.astro.build/en/guides/deploy/deno/#project-configuration). The site **has** to be server rendered it said but that turned out to not be the case. 

## Static hosting on deno deploy

> In the deno docs I found [static hosting](https://docs.deno.com/deploy/tutorials/static-site). 

Avoid SSR by removing `output: 'server'` from `astro.config.mjs`. The `build` will build for static hosting. 

### deployctl CLI tool from Deno 
The `deployctl` tool facilitates CLI deployment. See [official docs]( config used differ from the config found in '/Users/giwan/Projects/gear/d) for details. 

#### Install deployctl

```sh
deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# make sure to add it to path as described by the script comment. 
```

#### Deploy with parameters
If there is a [`deno.json`](deno.json) file present `deployctl` will use the config. However it's possible to overwrite it by passing the values in the command line a well. 

```sh
# example

deployctl deploy --project=blog.mytoori.com --entrypoint=https://deno.land/std@0.211.0/http/file_server.ts 

```

According to the documentation it's possible to use `--include=./dist` to indicate that only the `dist` folder should be upoaded. However it seems that for static deployments it **always** uploads the entire folder where the script is executed from. 

To solve that, enter in the `dist` folder with `cd dist` and run the script from there. 
With that the script has been added to `package.json#scripts.deploy:deno`. That performs a fresh build. Moves into the `dist` folder and deploys the content. 

A confirmation will be required. It will not deploy to production immediately. Instead a preview url is generated. 
That preview can be promoted to production in the UI. 
