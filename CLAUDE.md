# Claude Code Preferences

## Communication Style

- Work step-by-step, one task at a time (unless steps are extremely basic)
- Let me troubleshoot each fix before moving on
- Keep explanations clear and direct
- I process information quickly; keep explanations concise unless I ask for more detail (TLDR First)
- Use plain, simple language with minimal jargon; define any non-basic term briefly in-line if you must use it.
- Prefer short bullet lists over long paragraphs, and keep sections clearly labeled.

## Code Edits

- Apply edits directly to files so I can approve/reject them
- Only show snippets if I specifically ask
  - If I ask for snippets, give exact snippet to change and the exact change needed.

## Preferred Stack

- **Frontend:** React, TypeScript, Next.js
- **Backend:** Node.js (when needed), Express.js (when needed)
- **Database:** MongoDB
- **Styling:** SCSS
- I use Windows with VS Code and prefer to use Powershell terminal directly in VS Code (but if Claude only works with Git Bash, I can use it).

## Development Philosophy

- Build for scalability from the start
- Follow industry best practices at all times
- MVP means production-ready and professional quality, not quick and dirty
- Avoid shortcuts that will require refactoring later
- Proper architecture, error handling, and structure from day one
- Prefer the simplest possible implementation that is still solid and maintainable, rather than clever abstractions.
  ​- Prioritize working functionality first, then refinement; avoid introducing patterns that are overkill for a small app or early MVP.
- Keep business logic separate from JSX (JSX should be written last) and prefer clear, flat component structures over deeply nested trees.
  ​

## Project & Architecture Preferences

- Keep API routes, database logic, and business logic out of React components; components should mainly handle rendering and simple event handlers.
- Prefer clear, flat component hierarchies with small, focused components over deep trees or heavy abstractions.
- Assume I am the only dev (full-stack, QA, UX), so favor patterns that are easy for one person to maintain.

## Accessibility, Mobile, and UX

- Treat layouts as mobile and accessible first: always consider screen size and basic WCAG/ARIA practices in any UI suggestion.
- Design for users who are not tech-savvy: clear labels, obvious buttons, plain language, and no hidden or “clever” interactions.
- Design for users with sensory sensitivities: avoid rapid animations, flashing effects, auto-playing media, and overly bright or cluttered visuals.
- Prefer simple flows: minimal clicks, minimal fields, no unnecessary wizards or extra hero pages.
- Use predictable patterns: consistent navigation, consistent button placement, and clear feedback after each action (e.g., “saved”, “error”, “loading”).
- If suggesting a UI change, briefly explain how it impacts accessibility, sensory comfort, or mobile usage.

## Code Style Rules

- Zero inline styling
- Styling should be as global as possible across the project
- Keep code as simple as possible
- Maintain strong separation of concerns
- Keep files short — avoid files over 150-200 lines
- Organize code for readability and maintainability
- Favor clean, minimal UIs over visually complex ones; fewer inputs, fewer steps, less friction.
- Styling should be global/top-down (layouts, themes, typography) with minimal per-component overrides.
  ​- Accessibility and performance are important but should be handled with simple, well-known patterns rather than heavy frameworks.
