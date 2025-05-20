---
path: "/deploy-nextjs-static-to-github"
date: "2020-11-21"
title: "Deploy a Nextjs static site to github pages"
summary: "Easily host any static site directly on github pages."
image: ""
author: "Giwan Persaud"
published: true
---

It's perfect for small personal projects. NextJS is also a static site generator, providing the benefits of the JAM stack.
This post goes through the steps to deploy the static site on github.

---

# Quickly setup a new NextJS project

Using `npx` create a new project.

```bash
# Create new NextJS project
$ npx create-next-app nextjs-demo
```

Enter the project and open the file `/pages/index.js`. Replace the contents of the file with this:

```jsx
/* /pages/index.js */

import Head from "next/head"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Deploy next site to gh-pages</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1>How to deploy a next static site to github pages</h1>
            </main>
        </div>
    )
}
```

Login to github and create a new project. Then push the current code to the master / main branch.

# gh-pages library

It's possible to create a static export of the project with `next export`. The exported contents in the `out` folder can be hosted now by any static host. There are some small things that might need fixing. Overall it should work though.

The gh-pages package copies the contents of the `out` folder to a separate branch named `gh-pages`. Github, once configured, looks for the `gh-pages` branch and will host the contents of that branch. (Check the project settings to configure github)

`npm i gh-pages` installs `gh-pages` into the project.
Next use gh-pages to generate the out folder and copy it to gh-pages git branch.

```bash
# deploy to github pages
$ rm -rf node_modules/.cache && rm -rf out && next build && next export && touch out/.nojekyll && gh-pages -d out -t true
```

Add it with a script to `package.json`. For example `deploy`.
Then, execute `npm run deploy`.

# github configuration

With the deployment done, open the project in github.
In the settings, scroll down to the section where you can configure gh-pages.

There switch to the branch `gh-pages`. The folder should be pointed to `/` (root).

Your project should now be available at: `https://github.io/<username>/<project-name>`

## Custom domain name

Add the custom domain name you plan to use. For example `test.example.com`.

Login to your DNS provider. For example if you're using vercel it can be added with.

```bash
# add DNS subdomain
$ now dns add example.com test CNAME github.io/<username>/<project-name>
```

## Sources

| Name   | Link                |
| ------ | ------------------- |
| NextJS | https://nextjs.org/ |
| Vercel | https://vercel.com/ |
