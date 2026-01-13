# Agent Protocol

Step-by-step protocol for AI agents to ensure high-quality output.

## Phase 1: Context & Planning

1. **Analyze Requirements**: Thoroughly read the user request.
2. **Read Docs**: Start by reading `AGENTS.md` and relevant files in
   `agent-docs/`.
3. **Draft Plan**: Create an `implementation_plan.md` (for complex tasks) and
   get user approval.

## Phase 2: Implementation

1. **Test-Driven (where applicable)**: Write tests before or alongside code.
2. **Atomic Commits**: Keep changes focused and logically grouped.
3. **Follow Guidelines**: Adhere to `guidelines.md`.

## Phase 3: Verification

1. **Build Check**: Run `npm run build` for any structural or config changes.
2. **Test Check**: Ensure all tests pass (`npm run test`).
3. **Manual Review**: Create a `walkthrough.md` to demonstrate the changes.

> [!TIP]
> Always rewrite user prompts internally for maximum expertise before executing.
