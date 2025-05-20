# Server Side Rendering
It's possible to active SSR for the entire site. 
Do that in `astro.config.mjs`

https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server'
});
```

This however requires an adapter from the hosting provider. In the case of netlify it's this. 
https://docs.astro.build/en/guides/integrations-guide/netlify/

That's easy enough but I'm not sure that I want to SSR all the routes. 
Only the tools route might make sense to render on the server. 

---
In the end, I disabled SSR for now as it was a bit of overkill. 
I can run the component on the client only where users can filter the content after the component has loaded. 
