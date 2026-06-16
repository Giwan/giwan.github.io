---
layout: "../../../layouts/BlogArticle.astro"
title: "Narrative Code: Writing Software That Reads Like a Story"
description: "Discover how to transform your codebase into a readable narrative using intention-revealing names, SLAP, and functional composition for better maintainability."
pubDate: "2026-06-16"
createdDate: "2026-06-16"
status: "published"
published: true
readTime: "8 min read"
tags: ["Clean Code", "Software Architecture", "Developer Experience", "JavaScript", "TypeScript"]
category: "Technology"
---

> "Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman, *Structure and Interpretation of Computer Programs*

We've all been there: opening a file you wrote six months ago and feeling like you're staring at an ancient, undecipherable script. You spend the next hour "archaeologically" digging through layers of nested if-statements and cryptically named variables just to understand a single bug fix.

This isn't just a personal failing; it's a statistical reality. Developers spend approximately **70% of their maintenance time reading code** just to understand it, and only about 5% actually writing new lines. Yet, we often write code as if the machine is our only audience.

**Narrative Coding** is the practice of writing code so it reads like a story. By using intention-revealing names, respecting levels of abstraction, and favoring small, named functions, we can transform puzzles into prose.

## TLDR: How to Write Narrative Code

- **Name by Outcome**: Use `enforceRateLimit` instead of `checkDualRateLimit`.
- **Functions as Chapters**: Top-level functions should summarize the "what," not the "how."
- **Respect Brain Spans**: Keep functions under 7 lines to fit within short-term memory.
- **SLAP**: Apply the Single Level of Abstraction Principle; don't mix regex with business logic.
- **AI-Ready**: Narrative code provides richer semantic signals, making AI agents like [Claude](https://www.anthropic.com/claude) and [Gemini](https://deepmind.google/technologies/gemini/) significantly more effective.

---

## 🧠 The Cognitive Science of Reading Code

Why is some code "clean" and other code "messy"? It often comes down to how well the code respects our biological limitations. Yehonathan Sharvit, writing for [Semaphore](https://semaphore.io/blog/storytelling-programming), identifies three critical **brain spans** that dictate our ability to process information:

| Brain Span | Capacity | Violation in Code |
| :--- | :--- | :--- |
| **Memory Span** | ~7 items | Long functions with dozens of local variables. |
| **Attention Span** | ~20 minutes | Mixing low-level implementation with high-level logic. |
| **Structure Span** | Needs "What" vs "How" | Comments describing *what* the code does instead of *why*. |

When we violate these spans, we force the reader to manually track state and context, leading to cognitive fatigue and bugs.

<div class="my-8 flex justify-center">
  <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing the flow from low-level mechanism to high-level narrative">
    <rect width="400" height="200" rx="8" fill="hsl(36 33% 98%)" stroke="hsl(30 15% 90%)" />
    <path d="M50 150 L150 100 L250 150 L350 50" stroke="hsl(30 10% 40%)" stroke-width="2" stroke-dasharray="4 4" />
    <circle cx="50" cy="150" r="6" fill="hsl(24 10% 10%)" />
    <circle cx="150" cy="100" r="6" fill="hsl(24 10% 10%)" />
    <circle cx="250" cy="150" r="6" fill="hsl(24 10% 10%)" />
    <circle cx="350" cy="50" r="6" fill="hsl(24 10% 10%)" />
    <text x="50" y="175" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Mechanism</text>
    <text x="150" y="85" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Logic</text>
    <text x="250" y="175" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(24 10% 10%)">Patterns</text>
    <text x="350" y="35" text-anchor="middle" font-family="serif" font-size="12" font-weight="bold" fill="hsl(24 10% 10%)">Narrative</text>
  </svg>
</div>

## 📚 Core Techniques for Storytelling

### 1. Functions as Chapters
In a well-written book, a chapter title tells you what to expect, and the first few paragraphs summarize the action. Your top-level functions should do the same.

Consider this [Remix](https://remix.run/) action:

```ts
export async function action({ request }: ActionFunctionArgs) {
  const csrfError = await rejectInvalidCsrf(request);
  if (csrfError) return csrfError;

  const { intent, formData } = await parseFormSubmission(request);
  return routeByIntent(intent, formData, request);
}
```

Even without seeing the implementation of `rejectInvalidCsrf` or `parseFormSubmission`, you know exactly what is happening. Each line is a story beat.

### 2. The Single Level of Abstraction Principle (SLAP)
SLAP states that all code within a single function should be at the same level of abstraction. Don't mix high-level business rules with low-level details like regex or bitwise operations.

**Violation:**
```ts
function processUser(user) {
  // High level
  if (user.isPremium) {
    // Low level - Regex mixed in!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) throw new Error("Invalid");
  }
}
```

**Narrative Version:**
```ts
function processUser(user) {
  if (user.isPremium) {
    validateEmailFormat(user.email);
  }
}

function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Invalid");
}
```

### 3. Intention-Revealing Names
As Dmitri Pavlutin argues in [Coding Like Shakespeare](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/), we should prefer explanatory names over mechanism-based names.

| Mechanism Name | Intention-Revealing Name |
| :--- | :--- |
| `extractEmail` | `requireValidEmail` |
| `handleApiResponse` | `unwrapApiResult` |
| `checkDualRateLimit` | `enforceRateLimit` |
| `formatValidationErrors` | `validationErrorResponse` |

### 4. Extracting Conditions into Predicates
Complex boolean logic is the "plot hole" of the coding world. It's where the reader gets lost. By extracting conditions into named functions (predicates), you make the logic self-documenting.

Instead of:
```ts
if (user.age > 18 && user.hasVerifiedEmail && !user.isBanned) { ... }
```

Write:
```ts
if (canAccessPremiumContent(user)) { ... }

function canAccessPremiumContent(user) {
  return isAdult(user) && hasVerifiedAccount(user) && isActiveMember(user);
}
```

## 🤖 Why This Matters for AI Coding Agents

In 2026, we aren't just writing for other humans; we're writing for AI agents. Whether you're using [OpenCode](/blog/2026-02-05-opencode-ai-coding-agent), [Cursor](https://www.cursor.com/), or [Windsurf](https://codeium.com/windsurf), these tools rely on Large Language Models (LLMs).

LLMs are essentially sophisticated pattern matchers trained on language. When your code reads like prose, you are providing the AI with high-quality semantic signals. A well-named function like `enforceSubscriptionPolicy` gives the AI much more context to work with than a generic `checkStatus` function. Narrative code makes your AI collaborators smarter, faster, and less likely to hallucinate.

## 📌 Conclusion

Narrative coding transforms a codebase from a collection of puzzles into a coherent story. For a solo developer, it's an act of kindness to your future self. For a team, it's the foundation of a high-velocity culture where onboarding is measured in minutes, not weeks.

Next time you write a function, ask yourself: *If I read this aloud, does it tell a story?*

---

## 🔗 Sources & Further Reading

- [The Secret Art of Storytelling in Programming](https://semaphore.io/blog/storytelling-programming) — Yehonathan Sharvit
- [Coding like Shakespeare: Practical Function Naming Conventions](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/) — Dmitri Pavlutin
- [Your Code Should Tell a Story](https://medium.com/better-programming/your-code-should-tell-a-story-8e9d42e91ef2) — Madhavan Nagarajan
- [Intent-Revealing Code: Writing for Humans, Not Just Machines](https://naveenkumarmuguda.medium.com/intent-revealing-code-writing-for-humans-not-just-machines-f1a310f0b934) — Naveen Muguda
- [Single Level of Abstraction Principle](https://www.c-sharpcorner.com/article/single-level-of-abstraction-principle-slap-write-code-that-tells-a-story-in-c/) — Naresh Kumar Katta
