---
title: Deploy Astro Static on Deno Deploy
description: With a little bit of workaround it's possible to deploy a static Astro site to deno deploy. Initially Astro's docs indicated only SSR was supported. 

createdDate: "2024-01-21"
published: "2024-01-21"
pubDate: "2024-01-21"
status: "published"
readTime: 5
layout: "../../../layouts/BlogArticle.astro"
---

This is a blog site built with Astro. It was hosted elsewhere but I wanted to deploy it on [Deno deploy](https://deno.com/deploy). According to [Astro's documentation at the time activating server side rendering](https://docs.astro.build/en/guides/deploy/deno/#project-configuration) was required. 

```js

// astro.config.mjs
import { defineConfig } from 'astro/config';
import deno from '@astrojs/deno';

export default defineConfig({
  output: 'server',
  adapter: deno(),
});

```

Up until now the blog had been built at build time and deployed as a static site. Server Side Rendering (SSR) seemed like overkill since the blog does not use any features that require it.

## Deno cloud deploy basic analytics
Deno cloud deploy offers some basic analytics that I could benefit from. 


## Deploy a static site on Deno deploy
[There is this option to deploy a static site on Deno Deploy](https://docs.deno.com/deploy/tutorials/static-site). Note that it does not specifically mention Astro. 
However using this feature we can also deploy a static astro site. 

When running a deno site, it needs to be pointed to the `.ts` file that will start the app. Since this is a static site, the start file is `index.html` most likely in `./dist` where the `build` script has output the build-time results. 

Using the information from the linked article, build the site, then cd into the dist folder. 
`deployctl` used for the deployment will upload the contents of the folder that it's run in. It will need to be installed first as described in the [CLI deployment documentation](https://docs.astro.build/en/guides/deploy/deno/#cli-deployment). 
So run it from the `./dist` folder to only upload the contents of that folder. 

To make it easy, add this script to your `package.json`. 

```json
// package.json
{ 
    "scripts": {
        "deploy:deno": "npm run build && cd dist && deployctl deploy",
    }
}

```

## deno.json
`deno.json` is **not** mandatory but it helps. to make the script a bit more readable. In it, configure the parameters required by deno when deploying. 


```json
// deno.json
{
    "deploy": {
        "project": "<your_project_id_in_deno_deploy>",
        "exclude": ["**/node_modules"],
        "include": [],
        "entrypoint": "https://deno.land/std@0.211.0/http/file_server.ts"
    }
}

```

The `entrypoint` here allows for the use of a static file server. Essentially, the files in the `./dist` folder will be statically served by `file_server.ts`. 

## Command line
As indicate the `deno.json` is optional. It's feasible to run the entire command directly from the terminal. 


```sh

deployctl deploy \ 
--project <your_project_id_in_deno_deploy> \
--exclude "**/node_modules" \
--entrypoint "https://deno.land/std@0.211.0/http/file_server.ts"
```

## Optional
Use `--prod` to deploy directly to production. By default Deno deploy creates a preview deploy which can be promoted to production after testing. 