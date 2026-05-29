# AI Agent Guidelines

## Purpose

This file defines the global working rules for AI coding agents in this repository.

It is the source of truth for agent behavior, not for task-specific implementation details.

---

## Documentation System

Use the `.ai/` documentation system as follows:

```bash
.ai/
  AGENTS.md          # global agent behavior
  context/           # project background and architecture
  skills/            # task-specific implementation guidance
  adapters/          # tool-specific routing only
```

---

## Source of Truth

* Global agent behavior lives in `.ai/AGENTS.md`.
* Project background lives in `.ai/context/`.
* Task-specific rules live in `.ai/skills/`.
* Skill routing/index lives in `.ai/skills/SKILLS.md`.
* Adapter files only connect tools to this documentation system.

Do not duplicate skill rules inside this file.

---

## Loading Rule

Before working on a task:

1. Read `.ai/AGENTS.md`.
2. Read relevant files in `.ai/context/` when project background is needed.
3. Read `.ai/skills/SKILLS.md` to find the right skill file.
4. Load only the skill files relevant to the current task.

Do not load unrelated skill files.

---

## Working Principles

When modifying code:

* Prefer small, focused changes.
* Preserve existing project conventions.
* Reuse existing components, utilities, hooks, and services before creating new ones.
* Avoid unnecessary refactoring.
* Do not introduce new libraries, frameworks, or architecture unless requested.
* Follow explicit `.ai/skills/` guidance when available.
* If documentation and existing code conflict, mention the conflict instead of silently changing conventions.

---

## Response Expectations

For development tasks:

* Be direct and implementation-focused.
* Include file paths when useful.
* Explain important decisions briefly.
* Avoid long generic explanations.
* State assumptions clearly when needed.
