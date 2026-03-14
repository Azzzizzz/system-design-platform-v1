---
name: Git Rules
description: Strict rules for handling version control operations.
---

# Git Operations

You are strictly forbidden from performing any git tracking or commiting operations in this repository unless explicitly commanded by the user to do so in the prompt.

## Prohibited Commands
Do not run any of the following commands:
*   `git add .` or `git add <file>`
*   `git commit`
*   `git push`
*   `git reset`
*   `git checkout`

## Rationale
The user manages their own version control manually. Your job is to generate and edit files in the file system. Staging data or committing work on behalf of the user breaks their workflow and is unacceptable.
