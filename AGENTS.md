# AI Agent Instructions

This repository is optimized for AI-driven development. Follow these
instructions to ensure maximum performance and technical depth.

## Core Documentation Modules

For detailed instructions, refer to the following modules in the `agent-docs/`
directory:

- [**Project Context**](file:///Users/giwan/Projects/blog-astro-github/agent-docs/context.md):
  Tech stack, architecture, and directory structure.
- [**Development Workflow**](file:///Users/giwan/Projects/blog-astro-github/agent-docs/workflow.md):
  Scripts for running, testing, and building the project.
- [**Coding Guidelines**](file:///Users/giwan/Projects/blog-astro-github/agent-docs/guidelines.md):
  Best practices for Astro, React, styling, and TypeScript.
- [**Agent Protocol**](file:///Users/giwan/Projects/blog-astro-github/agent-docs/protocol.md):
  The systematic approach agents must take for every task.

## Narrative Coding Standards

This project adheres to **Narrative Coding** and **Hexagonal Architecture**.
- **Domain Core**: Business logic resides in `src/domain/`. It must be pure TS/JS, zero framework dependencies.
- **SLAP**: Single Level of Abstraction Principle. Functions should stay at one level.
- **Small Chapters**: Functions should be < 7 lines whenever possible.
- **Prose-like**: Code should read like English. Extracted predicates are preferred over complex conditionals.
- **Ports & Adapters**: Infrastructure (Astro, React, Browser APIs) belongs in Adapters that implement or call Domain Ports.

## Mandatory Reading

Before starting any task, an agent **must** read this file and `@import` it into
its context.

## External Documentation

- `CLAUDE.md`: Additional technical notes and project-specific quirks.
