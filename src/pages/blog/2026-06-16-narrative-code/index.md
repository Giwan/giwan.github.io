---
layout: "../../../layouts/BlogArticle.astro"
title: "Narrative Code: Writing Software That Reads Like a Story"
description: "Code is read far more than it is written. Explore how intention-revealing names, the SLAP principle, and functional storytelling transform puzzles into prose."
pubDate: "2026-06-16"
createdDate: "2026-06-16"
status: "published"
published: true
readTime: "10 min read"
tags: ["Clean Code", "Software Architecture", "Developer Experience", "JavaScript", "TypeScript", "Security"]
category: "Technology"
---

> "Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman, [SICP](https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/)

Developers spend approximately **70% of their maintenance time reading code** just to understand it. Yet, we often write as if the machine is our only audience, forcing readers to hold dozens of low-level details in their head simultaneously. Narrative coding treats the codebase as a communication medium—a series of chapters that guide the reader through business logic without the friction of implementation details.

## TLDR: The Narrative Protocol

- **Respect Brain Spans**: Keep functions under 7 lines to fit within biological short-term memory limits.
- **SLAP (Single Level of Abstraction)**: Never mix high-level policy with low-level primitives (like regex or raw API calls) in the same function.
- **Name by Outcome**: Use `enforceRateLimit` instead of `checkDualRateLimit`. Focus on the *what*, delegating the *how*.
- **Functions as Chapters**: Use entry points to summarize the narrative flow; keep implementation details in "supporting" functions.
- **Auditable Security**: Narrative code makes logic flaws and missing validations—the "plot holes" of software—visually obvious to humans and AI.

---

## 🧠 The Cognitive Case for Storytelling

Coding is not merely logic; it is an exercise in respecting biological constraints. Yehonathan Sharvit, writing for [Semaphore](https://semaphore.io/blog/storytelling-programming), identifies three "brain spans" that define our capacity for code comprehension:

| Brain Span | Capacity | Code Violation |
| :--- | :--- | :--- |
| **Memory Span** | ~7 items | Long functions with excessive local variables. |
| **Attention Span** | ~20 minutes | Mixing abstraction levels (SLAP violation). |
| **Structure Span** | What vs How | Comments describing *what* code does instead of *why*. |

When code reads like a story, it aligns with our natural organizational patterns, drastically reducing the cognitive overhead of "code archaeology."

<div class="my-8 flex justify-center"><svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing the flow from low-level mechanism to high-level narrative"><rect width="400" height="200" rx="8" fill="hsl(36 33% 98%)" stroke="hsl(30 15% 90%)" /><path d="M50 150 L150 100 L250 150 L350 50" stroke="hsl(30 10% 40%)" stroke-width="2" stroke-dasharray="4 4" /><circle cx="50" cy="150" r="6" fill="hsl(24 10% 10%)" /><circle cx="150" cy="100" r="6" fill="hsl(24 10% 10%)" /><circle cx="250" cy="150" r="6" fill="hsl(24 10% 10%)" /><circle cx="350" cy="50" r="6" fill="hsl(24 10% 10%)" /><text x="50" y="175" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Mechanism</text><text x="150" y="85" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Logic</text><text x="250" y="175" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Patterns</text><text x="350" y="35" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold" fill="hsl(24 10% 10%)">Narrative</text></svg></div>

## 📚 Perspectives on the Craft

The art of narrative programming has been refined by practitioners focusing on different layers of readability:

### The Secret Art of Storytelling — Yehonathan Sharvit
Advocates for extreme decomposition. Sharvit demonstrates refactoring complex search handlers into a hierarchy where every node reads as a distinct story beat.

### Coding Like Shakespeare — Dmitri Pavlutin
Focuses on the linguistics of names. [Pavlutin](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/) argues for natural language sentences in function calls and strict "one word per concept" consistency to avoid linguistic drift.

### Your Code Is a Story — CodeCraft
Introduces the literary metaphor: functions are chapters, patterns are recurring themes, and bugs are "plot holes." Narrative prose makes missing security validations or logical contradictions stand out.

### Pragmatics and Grammar — Manuel Suricastro
[Suricastro](https://blog.stackademic.com/code-teller-the-art-of-narrating-code-69523493e6b6) emphasizes "vertical" (business) vs "horizontal" (technical) naming. He also highlights "grammatical number"—consistent pluralization for collections—as a tool to prevent category errors.

---

## 🎯 Core Techniques

### 1. Functions as Chapters
Your entry points—like an [Astro](https://astro.build) page or a [Remix](https://remix.run/) action—should read like a table of contents. Each line should hide implementation complexity, making the business logic immediately auditable.

```ts
export async function action({ request }: ActionFunctionArgs) {
  const csrfError = await rejectInvalidCsrf(request);
  if (csrfError) return csrfError;

  const { intent, formData } = await parseFormSubmission(request);
  return routeByIntent(intent, formData, request);
}
```

### 2. Curried Dispatch Factory
Replace growing `switch` blocks with declarative handler maps. This keeps logic flat and prevents "megafunctions" that mask security edge cases.

```ts
function dispatchByIntent(handlers: Record<string, IntentHandler>) {
  return (intent: string, ...args: any[]) => {
    const handler = handlers[intent];
    return handler ? handler(...args) : unsupportedIntentError();
  };
}
```

### 3. Extract Conditions into Predicates
Complex boolean logic is a breeding ground for vulnerabilities. Extracting logic into named predicates makes validation rules explicit.

```ts
// Instead of:
if (options.query.wholeWord && user.isLoggedIn && !user.isSuspended) { ... }

// Write:
if (isAuthorizedSearch(options, user)) { ... }
```

---

## ⚠️ Anti-Patterns and Security Risks

- **Misleading Names**: A function named `extractEmail` that secretly performs side effects or handles network errors is a liability.
- **Deep Composition**: Over-engineering with complex `pipe()` chains can create "black box" logic that is difficult to audit during security reviews.
- **Primitive Obsession**: Using raw strings for sensitive domain data. Narrative code leverages type-driven development to ensure only "validated" data reaches critical sinks.
- **Mixing Abstractions**: Mixing high-level policy (e.g., `isPremiumUser`) with low-level data fetching (e.g., `db.query()`) hides the very checks auditors look for.

## 🤖 The AI Advantage: Semantic Signaling

In 2026, narrative code is a strategic necessity for AI-assisted development. AI coding agents like [OpenCode](/blog/2026-02-05-opencode-ai-coding-agent), [Claude Code](https://www.anthropic.com/claude), [Cursor](https://www.cursor.com/), and [Windsurf](https://codeium.com/windsurf) are built on Large Language Models.

When your code reads like prose, you provide richer semantic signals. A well-named function like `enforceSubscriptionPolicy` allows an LLM to engage its reasoning capabilities. Conversely, generic names like `checkStatus` force the AI to hallucinate intent based on implementation, increasing the risk of subtle logic flaws.

## 📌 Conclusion

Narrative coding transforms codebases from archaeological sites into living documentation. For the solo developer, it is an investment in your future self. For teams, it is the foundation of a high-velocity, security-first culture where "plot holes" are caught before they ever reach production.

---

## 🔗 Sources & References

- [The Secret Art of Storytelling in Programming](https://semaphore.io/blog/storytelling-programming) — Yehonathan Sharvit
- [Coding like Shakespeare](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/) — Dmitri Pavlutin
- [Your Code Is a Story](https://www.nottldr.com/CodeCraft/your-code-is-a-story-writing-software-that-reads-like-prose-0g4oi0d) — CodeCraft
- [Intent-Revealing Code](https://naveenkumarmuguda.medium.com/intent-revealing-code-writing-for-humans-not-just-machines-f1a310f0b934) — Naveen Muguda
- [Single Level of Abstraction Principle](https://www.c-sharpcorner.com/article/single-level-of-abstraction-principle-slap-write-code-that-tells-a-story-in-c/) — Naresh Kumar Katta
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) — Robert C. Martin
- [Code-teller: The Art of Narrating Code](https://blog.stackademic.com/code-teller-the-art-of-narrating-code-69523493e6b6) — Manuel Suricastro
