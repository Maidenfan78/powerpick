# AGENTS.md

## Project Structure

- `/app`: main React Native screens and components
- `/lib`: business logic, helpers, and contexts
- `/components`: reusable UI elements (use PascalCase)
- `/app/__tests__`: unit tests using Jest + testing-library
- `/vendor`: all runtime and development packages

## Dependencies

- Run `yarn install --offline` to install from the `/vendor` mirror (configured via `.yarnrc`)
- Update the mirror with `npm install --prefix vendor`
- `requirements.txt` is intentionally empty as no Python packages are needed
- Do not edit packages inside `/vendor` manually

## Coding Conventions

- Use TypeScript for all files (`.ts/.tsx`)
- Prefer functional components and React hooks
- Use meaningful variable names
- Keep component logic focused (<200 lines, <5 props)

## Testing

- Run `npm test -- --coverage`
- Preference for assertions from `@testing-library/react-native`
- Mock all external API or Supabase calls
- Tests must run without network access

## Formatting & Linting

- Lint with `npm run lint`
- Format with `npm run format` before PR

## Pull Requests

- Title format: `[feat][fix][chore]: short description`
- Add test summary and step-by-step instructions in the PR body
- Commit messages should match `[feat][fix][chore]: summary`

## Agent Behavior

- If generating new code, include relevant tests
- Do not upload or create non binary files
- Keep `.env` local by copying from `.env.example`
- Feature branches should use `feat/`, `fix/` or `chore/` prefixes
- Do not commit `node_modules/` or compiled output
