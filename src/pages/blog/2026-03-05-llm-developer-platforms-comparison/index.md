---
title: "Comparing Developer Platforms for the LLM Era"
description: "From AGENTS.md to MCP and Skills.sh, the LLM dev ecosystem is fragmenting. We compare leading platforms, pricing, and protocols to help you choose your stack."
createdDate: "2026-03-05"
published: true
status: "published"
pubDate: "2026-03-05"
readTime: "12 min read"
layout: "../../../layouts/BlogArticle.astro"
categories: ["AI", "Development", "Tools"]
tags: ["LLM", "Agents", "Cursor", "Windsurf", "Claude Code", "MCP", "Mistral", "Gemini"]
---

**TL;DR:** The "Chat with your Code" era is evolving into the "Agentic Workflow"
era. While [Skills.sh](https://skills.sh/) focuses on portable procedural memory
and [MCP](https://modelcontextprotocol.io/) provides a universal adapter for
tools, [AGENTS.md](https://agents.md/) has emerged as the simplest way to give
agents repository-level context. Your choice depends on whether you value tool
interoperability (MCP), procedural automation (Skills), or low-friction
documentation (AGENTS.md).

---

The landscape of LLM-powered development is shifting. A short while ago, we were
impressed by simple autocompletion. Six months ago, we were amazed by "Chat with
Codebase." Today, we are in the midst of the **Agent Standard Wars**.

As developers, we are no longer just choosing an IDE; we are choosing an
ecosystem of instructions, protocols, and specialized "skills" that define how
our AI partners interact with our work. This post breaks down the three major
pillars of this new world: **Context Standards**, **Protocol Layers**, and
**Execution Platforms**.

## 1. Context Standards: How Agents "Know" Your Project

Before an agent can help, it needs to understand the "rules of the house." Two
major standards have emerged to solve this:

### AGENTS.md: The "README for Robots"

[AGENTS.md](https://agents.md/) is a simple, open format designed to give agents
a predictable place to find setup commands, code styles, and project-specific
quirks. It is intentionally low-tech: just a Markdown file.

- **Target Audience:** Every developer who wants to "onboard" an agent to their
  repo in 30 seconds.
- **Strengths:** Zero dependencies, human-readable, and supported by almost
  every major agent (Cursor, Windsurf, Claude Code, Aider).
- **Weaknesses:** It is passive. It doesn't "do" anything; it just "tells."
- **Real-World Example:** Check out the `AGENTS.md` in this very repository! It
  guides agents on how to run our Astro build, where the PWA config lives, and
  how to verify changes.

#### How to Structure Your AGENTS.md

The best `AGENTS.md` files follow a three-phase protocol to ensure high-quality
output:

1. **Phase 1: Context & Planning:** Instruct the agent to analyze requirements
   and draft a plan before writing any code.
2. **Phase 2: Implementation:** Define your coding standards (e.g., "Use
   Tailwind first," "Avoid `any` in TypeScript").
3. **Phase 3: Verification:** List the mandatory checks, such as `npm run build`
   and `npm test`, that must be performed before the agent marks a task as
   complete.

> [!TIP]
> **Hot Tip:** Don't bloat your main `AGENTS.md`. Use it as a directory. Use an
> `@import` style approach or link to specialized sub-documents (like
> `agent-docs/protocol.md` or `agent-docs/guidelines.md`) to keep the primary
> instructions lean. Related info is only pulled into the context window if the
> agent needs it.

### Skills.sh / SKILL.md: The "Procedural Brain"

While AGENTS.md is a README, [Skills.sh](https://skills.sh/) (utilizing the
`SKILL.md` format) is a plugin. It allows you to package instructions with
executable scripts.

- **Target Audience:** Developers building specialized workflows (e.g. For
  Mytoori, I have several skills that can be engaged to prepare a story at a
  given reading level or dissect and perform translation).
- **Strengths:** Portable, version-controlled, and actionable. It can activate
  specific logic only when needed, preventing "context bloat."
- **Pricing:** Open standard, with a community registry at Skills.sh. (Created
  and maintained by Vercel team)
- **More Detail:** We've previously covered how to
  [leverage agent skills for web development](/blog/2026-02-18-leveraging-agent-skills-in-web-development).

#### Why Use Skills?

Skills excel when your workflow requires a specific sequence of "thought" and
"action." Instead of hoping the agent remembers to check for broken links after
a build, you create a skill that _forces_ that check. It transforms the LLM from
a generalist into a specialized artisan for your codebase.

> [!TIP]
> **Hot Tip:** Use Skills.sh to codify "Tribal Knowledge." If there’s a weird
> bug that only happens on M1 Macs when the Docker cache is full, don't just put
> it in a README. Write a skill that detects the environment and provides the
> exact fix automatically.

## 2. The Protocol Layer: MCP (Model Context Protocol)

Introduced by Anthropic, [MCP](https://modelcontextprotocol.io/) is the
"Universal Serial Bus" (USB) of the AI world. Instead of writing a custom
integration for every tool, you build an MCP server once, and any MCP-compatible
client (like Claude Desktop or Cursor) can use it.

- **Features:** Real-time data access (Google Drive, Slack, Postgres) and tool
  execution.
- **Case Study:** A developer at a fintech startup used an MCP server to let
  Claude query their internal staging database directly. This turned a 20-minute
  manual data lookup into a 5-second chat query.
- **Beginner Tip:** Use [Smithery.ai](https://smithery.ai/) to find and install
  pre-built MCP servers without writing code.

#### The Security Edge

MCP servers run locally. This means your sensitive API keys or database
credentials never need to be sent to the LLM provider. The agent only gets the
_output_ of the tool, keeping your "secrets" within your own infrastructure.

> [!TIP]
> **Hot Tip:** Before building custom MCP integrations, check if a
> **Skill** already exists for your use case at
> [Skills.sh](https://skills.sh/). Skills are easier to share, version, and
> debug than full MCP servers—and they keep your agent’s context lean.

## 3. Execution Platforms: Where the Work Happens

The choice of IDE or CLI is where most developers feel the "cost" and "friction"
of these tools. Here is how the leaders stack up as of March 2026:

| Platform        | Key Feature                   | Pricing (Pro/Max)  | Best For                                   |
| :-------------- | :---------------------------- | :----------------- | :----------------------------------------- |
| **Cursor**      | "Composer" (multi-file edits) | $20/mo             | The "Gold Standard" for AI-first IDEs.     |
| **Windsurf**    | "Cascade" engine & Codemaps   | $15/mo             | Deep context awareness in large codebases. |
| **Claude Code** | Terminal-native agent         | $20-$200/mo        | Fast, autonomous CLI workflows.            |
| **Trae**        | ByteDance's "Solo" mode       | Free / $10-$100/mo | High-performance multimodal coding.        |

### User Sentiment & Reviews

- **Cursor:** Remains the favorite for its polish and UI. However, some "power
  users" complain about the lack of a higher-tier plan to bypass usage limits on
  the newest models.
- **Windsurf:** Praised for its speed and its "Codemaps" feature, which many
  users find superior to Cursor's indexing for massive legacy repos.
- **Claude Code:** High quality. Developers love the speed and the "unfiltered"
  access to Claude models. For developers with lots to build this might be the
  one to start with.
- **Trae:** The newcomer. It's winning over developers with its aggressive free
  tier and impressive "Builder" mode, though some express privacy concerns due
  to its ByteDance heritage.

> [!TIP]
> **Hot Tip:** Don't just treat these as chat windows. The "killer feature" of
> Cursor (Composer) and Windsurf (Cascade) is their **structural editing
> engine**. They can refactor code across multiple files while maintaining
> import integrity—something a standard terminal-based agent often struggles
> with.

## Strategic Advice: Which Should You Use?

### For Beginners

Start with **Cursor** and add an **AGENTS.md** to your project. It’s the lowest
barrier to entry. Copy a template from [agents.md](https://agents.md/) and
customize it with your `npm` commands.

> [!TIP]
> **Hot Tip:** Use the "Explain" feature religiously. When an agent changes
> code, ask it _why_ it chose that specific pattern. It’s the fastest way to
> level up your own senior engineering skills.

### For Experienced Developers

Build your own **MCP servers** for your internal tools and start codifying your
complex deployment steps into **Skills**. This moves you away from "pair
programming" and toward "engineering management" of a fleet of specialized
subagents.

> [!TIP]
> **Hot Tip:** Treat your AI instructions as Tier-1 code. Version control your
> `AGENTS.md` and `SKILL.md` files, and include them in your PR reviews. If the
> instructions are stale, the agent will hallucinate.

### For Solo-Preneurs

If you are budget-conscious, **[OpenCode](https://opencode.ai/)** (open source)
or **Trae's** free tier are excellent starting points. Pair them with
**Skills.sh** to ensure you aren't wasting tokens on repetitive explanations.

> [!TIP]
> **Hot Tip:** Leverage "Context Pinning." Most IDEs allow you to pin specific
> files or documentation. Pin your architectural ADRs (Architecture Decision
> Records) so the agent always stays within your established technical
> boundaries.

---

## Learn More

Ready to dive deeper? Here are the tools and resources mentioned in this post,
along with others worth exploring:

### Context & Instruction Standards

- **[AGENTS.md](https://agents.md/)** — The open specification for giving
  agents repository-level context.
- **[Skills.sh](https://skills.sh/)** — Community registry for portable,
  version-controlled agent skills.
- **[MCP (Model Context Protocol)](https://modelcontextprotocol.io/)** —
  Anthropic’s universal adapter for connecting agents to external tools.
- **[Smithery.ai](https://smithery.ai/)** — Discover and install pre-built
  MCP servers without writing code.

### AI-First IDEs

- **[Cursor](https://www.cursor.com/)** — The leading AI-first IDE with
  Composer for multi-file edits.
- **[Windsurf](https://windsurf.com/)** — AI IDE with Cascade engine and
  Codemaps for deep codebase awareness.
- **[Trae](https://trae.ai/)** — ByteDance’s AI IDE with an aggressive free
  tier and Builder mode.
- **[Zed](https://zed.dev/)** — A fast, open-source editor written in Rust
  with built-in AI features.
- **[Void](https://voideditor.com/)** — A promising open-source VS Code fork
  with native AI integration.

### Terminal & CLI Agents

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** —
  Anthropic’s terminal-native coding agent.
- **[OpenCode](https://opencode.ai/)** — Open-source terminal agent with TUI,
  multi-session support, and 75+ model providers.
- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** — Google’s
  terminal agent with a 1M-token context window.
- **[Aider](https://aider.chat/)** — Git-native CLI agent for structured
  refactors and transparent diffs.
- **[Amp](https://ampcode.com/)** — Sourcegraph’s agentic coding tool with
  sub-agents and code review integration.
- **[Goose](https://github.com/block/goose)** — Block’s open-source agent
  with recipes and Agent Client Protocol support.

### VS Code Extensions

- **[Cline](https://cline.bot/)** — VS Code agent with full model flexibility
  and transparent token usage.
- **[Roo Code](https://roocode.com/)** — Reliability-focused VS Code agent for
  large, multi-file changes.
- **[Continue](https://www.continue.dev/)** — Open-source AI extension for
  VS Code and JetBrains.
- **[GitHub Copilot](https://github.com/features/copilot)** — The ubiquitous
  AI assistant with agent mode and workspace features.
- **[Kilo Code](https://kilocode.ai/)** — Multi-mode VS Code agent with
  Memory Bank for persistent context.

### Autonomous & Cloud Agents

- **[Devin](https://devin.ai/)** — Autonomous AI software agent that plans,
  codes, and iterates end-to-end.
- **[OpenAI Codex](https://openai.com/codex/)** — OpenAI’s agent-first coding
  platform for repository-level tasks.
- **[Jules](https://jules.google/)** — Google’s async cloud agent with GitHub
  integration.
- **[AWS Kiro](https://kiro.dev/)** — Amazon’s spec-driven development agent
  with AWS integration.

### Model Aggregation & Infrastructure

- **[OpenRouter](https://openrouter.ai/)** — Unified API for accessing
  models from OpenAI, Anthropic, Google, Meta, and more through a single
  endpoint.
- **[Models.dev](https://models.dev/)** — Curated model directory used by
  OpenCode and other tools for provider discovery.

### Comparison Resources

- **[Coding Agents Matrix](https://coding-agents-matrix.dev/)** — A curated
  side-by-side comparison of 24+ AI coding agents.

The "standard wars" are far from over, but the winners will be the protocols
that remain open and the tools that stay out of the developer's way. Whether you
are writing a simple `AGENTS.md` or a complex MCP server, you are ultimately
doing one thing: **teaching the machine how to be your best colleague.**
