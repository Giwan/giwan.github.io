---
layout: "../../../layouts/BlogArticle.astro"
title: "Narrative Code: Writing Software That Reads Like a Story"
description: "Code is read far more than written. Learn how intention-revealing names, SLAP, and framework decoupling transform complex puzzles into future-proof prose."
pubDate: "2026-06-16"
createdDate: "2026-06-16"
status: "published"
published: true
readTime: "12 min read"
tags: ["Clean Code", "Software Architecture", "React", "TypeScript", "Security"]
category: "Technology"
---

> "Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman, [SICP](https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/)

Developers spend approximately **70% of their maintenance time reading code** just to understand it. Yet, for the last decade, we've fallen into a subtle trap: we've inter-woven our business logic with our framework "glue." In the React era, business rules are often inseparable from hooks, lifecycles, and component state.

Narrative coding, paired with architectural separation, offers a way out. It treats the codebase as a communication medium—a series of chapters that guide the reader through the business story, independent of the machinery that executes it.

## TLDR: The Narrative Protocol

- **Separate the 'Story' from the 'Glue'**: Keep business rules in pure TypeScript modules, delegating framework-specific tasks to "Adapters."
- **Respect Brain Spans**: Keep functions under 7 lines to fit within biological short-term memory limits.
- **SLAP (Single Level of Abstraction)**: Never mix high-level policy with low-level primitives (like regex or raw API calls) in the same function.
- **Auditable Security**: Narrative code makes logic flaws and missing validations—the "plot holes" of software—visually obvious to humans and AI.
- **Future-Proofing**: When logic is decoupled from the framework, upgrades and migrations become trivial refactors rather than existential crises.

---

## 🏗️ The 10-Year Trap: Logic vs. Framework Glue

Over the last ten years, especially within the React ecosystem, we’ve witnessed a massive "entanglement." Business logic—the rules that define how an application actually *works*—has been increasingly placed inside custom hooks, `useEffect` blocks, and component methods.

While this felt productive at first, it created a massive maintenance tax. When business logic is coupled to a framework’s lifecycle, you aren't just writing an app; you're writing a "React App." Moving to Svelte, Solid, or even upgrading to the next major version of your current framework becomes a project-wide rewrite because the "Story" is glued to the "Machinery."

### Narrative Logic vs. Framework Glue
- **The Core (Narrative)**: Pure functions and domain models. This is the "What." It doesn't know about `useState`, `fetch`, or `BrowserRouter`.
- **The Glue (Infrastructure)**: The components, the loaders, and the API clients. This is the "How." Its only job is to translate framework events into Domain commands.

<div class="my-8 flex justify-center"><svg width="500" height="250" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing the separation of Domain Narrative and Framework Glue"><rect width="500" height="250" rx="12" fill="hsl(36 33% 98%)" stroke="hsl(30 15% 90%)" /><circle cx="250" cy="125" r="70" fill="hsl(36 20% 94%)" stroke="hsl(30 10% 40%)" stroke-dasharray="4 4" /><text x="250" y="125" text-anchor="middle" font-family="serif" font-size="16" font-weight="bold" fill="hsl(24 10% 10%)">The Story</text><text x="250" y="145" text-anchor="middle" font-family="serif" font-size="12" fill="hsl(30 10% 40%)">(Domain Logic)</text><path d="M100 125 L180 125" stroke="hsl(24 10% 10%)" stroke-width="2" marker-end="url(#arrowhead)" /><path d="M400 125 L320 125" stroke="hsl(24 10% 10%)" stroke-width="2" marker-end="url(#arrowhead)" /><text x="100" y="110" text-anchor="middle" font-family="sans-serif" font-size="12" fill="hsl(24 10% 10%)">Framework Glue</text><text x="400" y="110" text-anchor="middle" font-family="sans-serif" font-size="12" fill="hsl(24 10% 10%)">Infrastructure</text><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="hsl(24 10% 10%)" /></marker></defs></svg></div>

## 🧠 The Cognitive Case for Storytelling

Coding is not merely logic; it is an exercise in respecting biological constraints. Yehonathan Sharvit identifies three "brain spans" that define our capacity for code comprehension:

| Brain Span | Capacity | Code Violation |
| :--- | :--- | :--- |
| **Memory Span** | ~7 items | Long functions with excessive local variables. |
| **Attention Span** | ~20 minutes | Mixing abstraction levels (SLAP violation). |
| **Structure Span** | What vs How | Comments describing *what* code does instead of *why*. |

When code reads like a story, it aligns with our natural organizational patterns, drastically reducing the cognitive overhead of "code archaeology."

---

## 🎯 Core Techniques

### 1. Separate the 'Story' from the 'Glue'
Instead of putting logic in a hook, put it in a pure TypeScript file. Let the framework merely "dispatch" to the story.

**The Narrative Core (Pure JS/TS):**
```ts
// checkout.domain.ts
export function applyDiscount(cart: Cart, code: string): Cart {
  if (!isValidDiscount(code)) return cart;
  const discount = calculateMarkdown(cart.total, code);
  return { ...cart, total: cart.total - discount, discountApplied: true };
}
```

**The Framework Glue (React):**
```tsx
// CheckoutButton.tsx
export function CheckoutButton({ cartId }) {
  const { cart, updateCart } = useCart(cartId);

  const handleDiscount = (code: string) => {
    // The framework "glue" merely orchestrates the narrative
    const updatedCart = applyDiscount(cart, code);
    updateCart(updatedCart);
  };

  return <button onClick={() => handleDiscount('SUMMER20')}>Apply</button>;
}
```

### 2. Single Level of Abstraction (SLAP)
SLAP ensures that a "Chapter" (Function) stays on topic. Don't mix high-level business rules with regex or API primitives.

### 3. Intention-Revealing Names
As Dmitri Pavlutin argues in [Coding Like Shakespeare](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/), we should prefer explanatory names over mechanism-based names. Use `enforceRateLimit` instead of `checkDualRateLimit`.

---

## ⚠️ Anti-Patterns and Security Risks

- **Framework Entanglement**: Putting business logic directly into `useEffect` or framework-specific hooks makes the logic un-testable in isolation and impossible to audit.
- **The Megafunction**: A 100-line "Service" that mixes data fetching, validation, and UI state. These are the "archaeological sites" of the future, where security vulnerabilities like missing authorization checks hide in plain sight.
- **Primitive Obsession**: Using raw strings for sensitive domain data (like `Email` or `Money`). Narrative code leverages type-driven development to ensure only "validated" data reaches critical functions, preventing a whole class of injection and logic errors.
- **The "Bystander" Effect in Reviews**: When code is dense and mechanism-heavy, reviewers often skip the logic and check only for syntax. Narrative code forces the reviewer to engage with the *business intent*, making "plot holes" (like missing edge cases) obvious.

## 🤖 The AI Advantage: Semantic Signaling

In 2026, narrative code is a strategic necessity for AI-assisted development. AI coding agents like [OpenCode](/blog/2026-02-05-opencode-ai-coding-agent) are language models. When your code reads like prose and your architecture is cleanly separated, you provide richer semantic signals.

A well-named function like `enforceSubscriptionPolicy` in a pure domain module allows an LLM to engage its reasoning capabilities. Conversely, mixing that logic into a React component forces the AI to navigate framework-specific noise, increasing the risk of hallucinations or introducing subtle security vulnerabilities.

## 📌 Conclusion: Future-Proofing via Prose

Narrative coding transforms codebases from archaeological sites into living documentation. By separating the "Story" from the "Glue," you ensure your business logic is future-proof. You aren't just building for today’s framework; you're building a portable asset that can survive the next ten years of frontend evolution.

Next time you write a function, ask yourself: *If I read this aloud, does it tell a story? And if I changed my framework tomorrow, would this story still be true?*

---

## 🔗 Sources & References

- [The Secret Art of Storytelling in Programming](https://semaphore.io/blog/storytelling-programming) — Yehonathan Sharvit
- [Coding like Shakespeare](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/) — Dmitri Pavlutin
- [Hexagonal Architecture: Decoupling Logic from Frameworks](https://medium.com/@vansh.khandelwal06/hexagonal-architecture-decoupling-business-logic-from-frameworks-02bfbfbd7162) — Vansh Khandelwal
- [Path To A Cleaner React Architecture](https://dev.to/jkettmann/path-to-a-cleaner-react-architecture-part-6-business-logic-separation-221g) — Johannes Kettmann
- [Single Level of Abstraction Principle](https://www.c-sharpcorner.com/article/single-level-of-abstraction-principle-slap-write-code-that-tells-a-story-in-c/) — Naresh Kumar Katta
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) — Robert C. Martin
