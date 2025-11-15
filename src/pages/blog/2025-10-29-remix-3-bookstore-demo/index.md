---
title: "Running the Remix 3 Bookstore Demo: A First Look"
description: "A hands-on guide to running the official Remix 3 bookstore demo from the Remix repository and understanding the new concepts it showcases."
createdDate: "2025-10-29"
published: "2025-10-29"
pubDate: "2025-10-29"
status: "published"
readTime: 12
layout: "../../../layouts/BlogArticle.astro"
---

The Remix team recently unveiled the future of the framework with Remix 3 at Remix Jam 2025. While Remix 3 is not yet officially released, the team has provided a runnable "bookstore" demo in their public repository. This is a fantastic opportunity to get a hands-on feel for the new concepts.

This guide will walk you through cloning the Remix repository, finding the bookstore demo, and running it on your local machine. We'll also explore some of the code to see how the new features work in practice.

## What's New in Remix 3?

The Remix Jam recap revealed several key new concepts in Remix 3, all of which are demonstrated in the bookstore demo:

*   **A New Component Model:** Remix 3 introduces a new component model that is not based on React.
*   **`hydrated()` and `Frame`:** These are new primitives for selective hydration and asynchronous UI.
*   **`@remix-run/fetch-router`:** This is a new, expressive, and type-safe router for the server, built on the web Fetch API.

## How to Run the Bookstore Demo

### Step 1: Clone the Remix Repository

First, you'll need to clone the official Remix repository from GitHub. Open your terminal and run the following command:

```bash
git clone https://github.com/remix-run/remix.git
```

This will create a new directory called `remix` containing the entire Remix codebase.

### Step 2: Navigate to the Bookstore Demo

Next, navigate to the bookstore demo directory within the cloned repository:

```bash
cd remix/demos/bookstore
```

### Step 3: Install Dependencies

Now, you'll need to install the demo's dependencies. The demo uses `npm`, so run the following command:

```bash
npm install
```

This will install all the necessary packages, including the local, in-development versions of the new Remix 3 packages.

### Step 4: Run the Development Server

Finally, you can start the development server by running the `dev` script:

```bash
npm run dev
```

This will start the bookstore demo on `http://localhost:3000`. Open this URL in your browser, and you should see the running application.

## Exploring the Code

Now that you have the demo running, let's take a look at some of the key files to understand the new concepts:

### `routes.ts`

This file defines the routes for the application using the new `@remix-run/fetch-router`:

```typescript
// routes.ts
import { route } from "@remix-run/fetch-router";

export let routes = route({
  uploads: "/uploads/*key",

  // Public book routes
  books: {
    index: "/books",
    genre: "/books/genre/:genre",
    show: "/books/:slug",
  },
});
```

### `server.ts`

This file is the entry point for the server and demonstrates how the router is used to handle requests:

```typescript
// server.ts
import { createRouter } from "@remix-run/fetch-router";
import { routes } from "../routes.ts";
// ... other imports

export let router = createRouter({ uploadHandler });
router.use(storeContext);
router.map(routes.books, booksHandlers);
```

### A Component Example

While the component files are more complex than the simple demos from the Jam, they showcase the new component model in action. You can find them in the `app/` directory.

## Conclusion

By running the bookstore demo, you can get a real feel for the future of Remix. While the APIs are still in development and subject to change, this hands-on experience is the best way to understand the new direction of the framework.

I encourage you to explore the code, experiment with the demo, and follow the [official Remix blog](https://remix.run/blog) for the latest updates on the Remix 3 release.
