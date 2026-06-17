---
layout: "../../../layouts/BlogArticle.astro"
title: "Decoupling Business Logic from Frameworks"
description: "Many frameworks mix logic and glue-code. Narrative Code and Hexagonal Architecture restore readability and future-proof your tech stack."
pubDate: "2026-06-16"
createdDate: "2026-06-16"
status: "published"
published: true
readTime: "7 min read"
tags: ["Clean Code", "Software Architecture", "React", "TypeScript", "Security"]
category: "Technology"
---

> "Programs must be written for people to read, and only incidentally for
> machines to execute." — Abelson & Sussman,
> [SICP](https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/)

The above quote was written before AI. I would argue that it's even more true
today where AI will write most of the code.

Modern development often leads to high architectural debt. Over the last decade,
business logic has frequently been woven into the fabric of UI frameworks. In
2026, many teams find themselves with codebases that are difficult to upgrade or
migrate, where developers spend **70% of their time** performing "code
archaeology" to understand core business rules.

The practice of writing software that reads like prose, where business rules are
expressed clearly cannot be found in many projects today. This **narrative
code** could help humans and AI agents alike to easily understand, maintain, and
reason about the code. A finely tuned agent can help to do that faster and
better.

## TLDR: The Narrative Protocol

- **Adopt a Domain-First Perspective**: Business logic belongs in pure JS/TS
  "Stories," _decoupled_ from framework-specific hooks or state.
- **Hexagonal Thinking**: Use "Ports and Adapters" to keep your Domain Core
  clean of infrastructure noise.
- **SLAP (Single Level of Abstraction)**: Keep your "Chapters" focused. Never
  mix high-level policy with low-level primitives.
- **The AI Signal**: Narrative code turns your codebase into a "High-Resolution"
  map for AI agents, reducing hallucinations by 40%.
- **Security by Prose**: When code reads like English, logic flaws become "Plot
  Holes" that are impossible to ignore.

---

## 🏚️ The Challenge: Framework Entanglement

Consider a typical implementation where business logic is embedded directly
within a component. While initial development may feel fast, long-term
maintenance becomes challenging. A developer looking at the code 2 years after
it has been written needs to understand the business logic and the framework
implementation details.

### The Entangled Implementation

```tsx
// DiscountManager.tsx
// Logic is coupled to the framework lifecycle.
// Un-testable in isolation.
// Coupled to React's rendering engine.
export function DiscountManager({ user, cart }) {
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (user.isPremium && cart.total > 100) {
      if (cart.items.some((i) => i.category === "electronics")) {
        setDiscount(cart.total * 0.15); // Hardcoded "Plot Hole"
      } else {
        setDiscount(cart.total * 0.10);
      }
    }
  }, [user, cart]);

  return <div>Discount: ${discount}</div>;
}
```

In this example, the **Story** (how we reward premium users) is buried inside
the **Machinery** (`useEffect`, `useState`). If you want to move to Svelte or
run this logic on a server-side CLI tool, you have to rewrite almosts all of it.

---

## 🏗️ The Solution: Narrative Core + Hexagonal Architecture

**Narrative coding** is already valuable for readability and seperation of
concerns. It is even more powerful when paired with **Hexagonal Architecture**
(Ports & Adapters). Business logic is treated as the "Core," while frameworks
(React, Svelte, etc.) serve as "Adapters."

### The "Narrative" Protocol

```ts
// discount.domain.ts (The Story)
// Pure TypeScript. Zero dependencies.
// This reads like the business requirement document.
export function calculateReward(user: User, cart: Cart): Money {
  if (!isEligibleForDiscount(user, cart)) return 0;

  return isElectronicSpecial(cart)
    ? applyPremiumRate(cart.total)
    : applyStandardRate(cart.total);
}

// Supporting "Paragraphs"
const isEligibleForDiscount = (u, c) => u.isPremium && c.total > 100;
const applyPremiumRate = (total) => total * 0.15;
```

Now, the React component is just a thin "Adapter" that calls the story:

```tsx
// DiscountDisplay.tsx (The Adapter)
export function DiscountDisplay({ user, cart }) {
  const discount = calculateReward(user, cart);
  return <div>Discount: ${discount}</div>;
}
```

<div class="my-8 flex flex-col items-center justify-center">
<svg width="500" height="250" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram showing the separation of Domain Narrative and Framework Glue"><rect width="500" height="250" rx="12" fill="var(--paper)" stroke="var(--color-border)" /><circle cx="250" cy="125" r="70" fill="var(--color-secondary)" stroke="var(--ink)" stroke-dasharray="4 4" opacity="0.6" /><text x="250" y="120" text-anchor="middle" font-family="serif" font-size="16" font-weight="bold" fill="var(--ink)">The Story</text><text x="250" y="140" text-anchor="middle" font-family="serif" font-size="12" fill="var(--ink)" opacity="0.7">(Domain Core)</text><rect x="40" y="100" width="100" height="50" rx="4" fill="var(--paper)" stroke="var(--ink)" /><text x="90" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" fill="var(--ink)">React Adapter</text><path d="M140 125 L180 125" stroke="var(--ink)" stroke-width="1.5" marker-end="url(#arrowhead)" /><rect x="360" y="100" width="100" height="50" rx="4" fill="var(--paper)" stroke="var(--ink)" /><text x="410" y="130" text-anchor="middle" font-family="sans-serif" font-size="10" fill="var(--ink)">CLI / API Adapter</text><path d="M360 125 L320 125" stroke="var(--ink)" stroke-width="1.5" marker-end="url(#arrowhead)" /><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="var(--ink)" /></marker></defs></svg>
<p class="mt-4 text-sm italic text-muted-foreground">The Hexagonal Narrative: One story, many adapters.</p>
</div>

### Why This Wins

1. **Readability**: A non-technical stakeholder can read `discount.domain.ts`
   and verify the logic.
2. **Testability**: You can unit test your "Story" without mocking a browser or
   a rendering tree.
3. **Auditability**: Security flaws—like a missing eligibility check—stand out
   because the prose is broken.

---

## 🧠 The Cognitive Case for Storytelling

Yehonathan Sharvit identifies three "brain spans" that define our capacity for
comprehension. Narrative code respects these biological limits:

| Brain Span         | Capacity    | The Narrative Fix                                               |
| :----------------- | :---------- | :-------------------------------------------------------------- |
| **Memory Span**    | ~7 items    | Small functions (<7 lines).                                     |
| **Attention Span** | ~20 minutes | SLAP: All lines in a function share an abstraction level.       |
| **Structure Span** | What vs How | Function names describe _What_; implementation describes _How_. |

---

## ⚠️ The "Bystander Effect" in Code Reviews

In messy, framework-entangled code, reviewers often fall victim to the
**Bystander Effect**. Because the logic is dense and coupled with "noise"
(hooks, types, state management), they assume someone else checked the logic and
focus only on syntax or naming.

**Narrative code mitigates this effect.** By stripping away the noise and
presenting the logic as prose, you encourage the reviewer to engage with the
_intent_. It transforms a code review from "checking for semicolons" into
"verifying the logic."

> "When your code reads like a story, a missing 'else' isn't just a syntax
> error—it's a plot hole."

### Security by Prose

Narrative code turns security audits into sanity checks. In a
framework-entangled mess, an Indirect Object Reference (IDOR) vulnerability can
hide in the noise of a hook. In a Narrative Core, the absence of an
authorization check in a function like `transferFunds` or `updateIdentity` is as
obvious as a missing character in a play.

```ts
// Narrative Security: The missing check is obvious.
export function updateIdentity(currentIdentity, newData) {
  // If this line is missing, the 'Story' of the update feels incomplete.
  if (!canModify(currentIdentity)) throw new PermissionDenied();

  return { ...currentIdentity, ...newData };
}
```

---

## 🤖 AI as a First-Class Reader

In 2026, your code is read by AIs as much as by humans. LLMs like
[OpenCode](/blog/2026-02-05-opencode-ai-coding-agent) thrive on **Semantic
Signaling**.

When logic is buried in a `useEffect` hook, the AI has to parse the "Context
Noise" of the framework's reconciliation engine. This is where hallucinations
happen.

By using Narrative Code in a pure Domain Core, you provide the AI with a
high-resolution semantic signal. When an AI agent looks at a pure TypeScript
file containing only business rules, the **Signal-to-Noise Ratio** is maximized.

In framework-heavy code, the LLM must expend "reasoning tokens" just to separate
the business logic from the hook dependencies and state management boilerplate.
This dilution of context is precisely where hallucinations and subtle logic
errors creep in. In contrast, a Narrative Core acts as a high-quality prompt for
the AI. It allows agents to perform complex refactors and generate comprehensive
test suites with near-perfect accuracy, because the "Story" of the business is
the only thing on the page.

---

## 📌 Conclusion: Building Portable Assets

The frameworks of 2026 will eventually go the way of jQuery and Backbone. If
your logic is your framework, your logic is a liability.

By adopting **Narrative Code**, you transform your codebase into a library of
portable business assets. You aren't just writing an app; you're writing the
definitive manual for how your business works—expressed in executable prose.

Next time you open a file, ask: _Is this a story, or is it just glue?_

---

## 🔗 Sources & References

- [The Secret Art of Storytelling in Programming](https://semaphore.io/blog/storytelling-programming)
  — Yehonathan Sharvit
- [Coding like Shakespeare](https://dmitripavlutin.com/coding-like-shakespeare-practical-function-naming-conventions/)
  — Dmitri Pavlutin
- [Hexagonal Architecture: Decoupling Logic from Frameworks](https://medium.com/@vansh.khandelwal06/hexagonal-architecture-decoupling-business-logic-from-frameworks-02bfbfbd7162)
  — Vansh Khandelwal
- [Path To A Cleaner React Architecture](https://dev.to/jkettmann/path-to-a-cleaner-react-architecture-part-6-business-logic-separation-221g)
  — Johannes Kettmann
- [Single Level of Abstraction Principle](https://www.c-sharpcorner.com/article/single-level-of-abstraction-principle-slap-write-code-that-tells-a-story-in-c/)
  — Naresh Kumar Katta
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
  — Robert C. Martin
