import { defineMiddleware } from "astro:middleware";
import { CONFIG } from "./config";

export const onRequest = defineMiddleware((context, next) => {
    const url = new URL(context.request.url);

    // Feature guards
    if (url.pathname.startsWith("/tools") && !CONFIG.features.enableToolsPage) {
        return context.redirect("/");
    }

    if (url.pathname.startsWith("/search") && !CONFIG.features.enableSearch) {
        return context.redirect("/");
    }

    if (url.pathname === "/rss.xml" && !CONFIG.features.enableRSS) {
        return new Response(null, { status: 404 });
    }

    return next();
});
