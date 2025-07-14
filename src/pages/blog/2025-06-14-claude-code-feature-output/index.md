---
title: "How Claude Code Helped Ship an Image Generation Feature in Half the Time"
description: "I leveraged Claude Code to implement an AI image generation feature for Mytoori, comparing different AI models and sharing key learnings."
createdDate: "2025-06-14"
published: "2025-06-14"
pubDate: "2025-06-14"
status: "published"
readTime: 5
layout: "../../../layouts/BlogArticle.astro"
---

Mytoori's admin backend already had a page where users can upload images for a
given item. However I wanted to also add a feature that would allow users to
tell an AI assistant to generate an image.

In this case it's for short stories in [Mytoori](https://mytoori.com). The user
should be able to select from multiple AI image generators but would first
develop the feature with one. I chose
[gpt-image-1 from OpenAI](https://openai.com/index/image-generation-api/).

## The Challenge: Adding AI-Generated Story Covers

Mytoori, a platform for short stories, already allowed users to upload their own
images. However, I wanted to take it a step further by allowing users to tell an
AI assistant to generate an image. It would also upload the image to the
database saving the user clicks.

The user would only input a basic prompt, select an AI model and predetermined
set of styles. The result of these styles can be seen on Mytoori.

After evaluating a few options for AI image generation, I decided to start with
[OpenAI's GPT-Image-1 API](https://openai.com/index/image-generation-api/) for
its balance of quality.

## Exploring Image Generation Options

During development, I tested multiple AI models to compare their outputs:

- **GPT-Image-1**: Produced the most consistent and high-quality results for
  story covers
- **Gemini 2.5 Flash**: A close second, though with a slightly more "plastic"
  aesthetic

An interesting observation was how different models handled various prompts. For
example, when generating covers for specific story themes, Microsoft CoPilot
would decline without clear reasoning. That's when I used the
[copilot.microsoft.com](https://copilot.microsoft.com) directly though.

You can see the difference in output quality in stories like
["The Nixie of the Mill-Pond"](https://mytoori.com/view/686bbacf3f1565bd3e5d24f2/en/en),
where the AI's interpretation of the mystical elements varies significantly
between models.

<div style="display: flex; gap: 20px; justify-content: center;">
  <div style="max-width: 45%; height: auto;"><img src="https://ik.imagekit.io/mytoori/mytoori-PROD-ai-covers/686bbacf3f1565bd3e5d24f2?tr=w-300&tr=h-375" alt="Nixie of the mill-pond">
  <sup>Nixie of the mill-pond (CoPilot.microsoft.com)</sup></div>
  <div style="max-width: 45%; height: auto;"><img src="https://ik.imagekit.io/mytoori/mytoori-PROD-ai-covers/686c18449a19cc5602f22156?tr=w-300&tr=h-375" alt="The water Nixie">
  <sup>The water Nixie (Gemini 2.5 Flash)</sup></div>
</div>

## Preparing the feature

I wrote out what I needed for the feature in a task document. Claude code has
since introduced a planning mode which is great for this.
[Claude code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)
are a good read.

Having a plan ready meant that I could tell CC to start working on the feature
while I did something else. I was able to let it process that and when I came
back it had 90% the way I wanted it.

## Code Quality and Best Practices

While Claude Code is powerful, I found that it works best with clear guidelines.
In my `CLAUDE.md` file, I specified:

- Clean, modular function design
- Comprehensive error handling
- Consistent code style
- Clear documentation requirements

That said, I did notice that some manual cleanup was often necessary to meet my
standards. The trade-off between speed and perfection is something worth
considering when using AI-assisted development tools.

## The Verdict: Is Claude Code Worth It?

At $20/month, Claude Code has proven to be a valuable addition to my development
toolkit for now. I'm also excited about SWE-1 from Windsurf and Google's Gemini
models. I've used these, although to a lesser extent.

### Key Takeaways:

1. **Plan Before You Code**: Clear specifications lead to better AI assistance
2. **Quality Varies by Task**: Some code requires more human oversight than
   others
3. **Consider the Alternatives**: While I'm happy with Claude, tools like SWE-1
   in Windsurf and Google's Gemini models offer compelling free alternatives

## What's Next?

I'm excited to explore more ways to integrate AI into Mytoori's development. In
future posts, I'll dive deeper into:

- Comparing different AI coding assistants
- Advanced prompt engineering techniques
- Cost-benefit analysis of paid vs. free AI tools

Have you tried using AI in your development workflow? I'd love to hear about
your experiences in the comments below!
