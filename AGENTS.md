# AGENTS

> **Single source of truth for all automated helpers in this repo** – from the LLM‑powered “Codex” agent to bread‑and‑butter dev utilities like ESLint, Prettier, and Jest.

---

## 1 · Overview

This project ships with **one LLM agent** (powered by *ChatGPT Codex*) and several **traditional CLI utilities** that keep the codebase clean and safe.
New contributors should skim the *Quick Reference* table, then jump to the detailed section for the task they care about.

---

## 2 · Quick Reference

| Name / Script | Purpose                                               | Invocation                                                        | Model / Tool chain         | Key Files                         |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------- | -------------------------- | --------------------------------- |
| **codex**     | AI assistant for code generation, refactors & doc‑gen | `pnpm exec agent codex <task>` <br>`pnpm exec agent codex --help` | ChatGPT Codex (model TBD¹) | `prompts/codex.*`                 |
| **lint**      | Detect style & rule violations (ESLint)               | `yarn lint` · `yarn lint:fix`                                     | eslint @ flat‑config       | `.eslintrc`, `.eslintignore`      |
| **format**    | Apply repository code‑style (Prettier)                | `yarn format` · `yarn format:check`                               | prettier                   | `.prettierrc`                     |
| **test**      | Run unit tests with coverage ≥ 80 %                   | `yarn test`                                                       | jest, @testing‑library     | `jest.config.js`, `app/__tests__` |

¹ *The default Codex model is whatever is configured in* `.env` *via* `OPENAI_MODEL`. *If unset, the OpenAI SDK’s default model is used.*

---

## 3 · Installation / Bootstrap

```bash
# 1 · Install JS deps from the offline mirror
yarn install --offline

# 2 · Copy environment template & add secrets
cp .env.example .env
# Required:
#   OPENAI_API_KEY=sk-…
#   OPENAI_MODEL=gpt-4o # (optional)

# 3 · First‑time setup (vector DB, migrations)
pnpm exec migrate   # <– noop if not using a DB
```

---

## 4 · Shared Prompt Conventions  (LLM agents)

* **System header** – defines persona → see `prompts/_base.system.md`.
* **User template** – tasks fill `{{instructions}}` slot.
* **Style guide** – Keep answers **concise**, cite code with fenced blocks, no backticks inside code.

> **TODO:** formalise a short style‑guide and link it here.

---

## 5 · Agent Details

### ✨ codex

* **Scope**  Generates or edits source files, docstrings, or tests on request.
* **Autonomy**  Semi‑automatic – prompts user before writing to disk unless `--yes`.
* **Key prompt pieces**

  * System → `prompts/codex.system.md`
  * Few‑shot → `prompts/codex.examples.md`
* **Writes to** `/app`, `/lib`, `/components`, and `/docs` only.
  *Never* edits `.env`, `package.json`, or generated files (`.svg`, `.png`, etc.).
* **Success criteria**  CI passes (`lint`, `format`, `test`) after changes.

### 🛠 lint

See **Quick Reference**. No special config beyond `.eslintrc`.

### 🧹 format

See **Quick Reference**. Uses `.prettierrc`.

### 🧪 test

Runs `jest` with `--coverage` and fails if coverage drops by > 2 % vs. `main`.

---

## 6 · Development Workflow

1. **Branch naming**  `feat/<slug>`, `fix/<slug>`, `chore/<slug>`.
2. **Open a PR early** – CI runs lint, format, test, and `codex dry‑run`.
3. **Prompt iterations**  Store prompt tweaks under `prompts/history/<yyyy-mm-dd>-<topic>.md`.
4. **CI**  `ci.yml` enforces:

   * `yarn lint` with no errors.
   * `yarn format:check` with zero diffs.
   * `yarn test` ≥ 80 % coverage.
   * Optional: `codex --validate-prompts`.

---

## 7 · Troubleshooting / FAQ

| Symptom                        | Likely Cause                 | Fix                                       |
| ------------------------------ | ---------------------------- | ----------------------------------------- |
| `OpenAIAuthenticationError`    | `OPENAI_API_KEY` missing     | Add key to `.env` or CI secret            |
| `rate_limit_exceeded`          | Too many Codex calls         | Re‑run with `--sleep 30` or wait          |
| `jest` fails after Codex edits | Agent modified test fixtures | Revert offending diff or regenerate tests |

---

## 8 · Changelog

| Date       | Change                                                                        |
| ---------- | ----------------------------------------------------------------------------- |
| 2025‑06‑28 | **Rewrite:** Adopt structured template, add Quick Reference and Agent details |
| 2025‑06‑10 | Initial skeleton added                                                        |

---

