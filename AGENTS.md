# Watch Reserve project guidance

## Form success messages

All form submission success states should use the shared
`src/lib/components/FormSuccess.svelte` component.

The component is the canonical Watch Reserve success treatment. It includes:

- A centered gold circular check icon using `#a1846d`
- Freight Display serif heading typography
- Acumin Pro body typography
- The established spacing, color, and alignment used by the valuation popup
- `role="status"` and `aria-live="polite"` for accessible announcements

Reuse the component instead of creating one-off success markup or CSS. Pass a
contextually appropriate `title` or `message` when needed, while preserving
the established visual treatment. If a genuinely different success pattern is
required, extend the shared component rather than duplicating its styles.

## Commit and session logging

When the user types `commit` in their prompt, treat that as an instruction to
commit the completed changes. Before committing:

1. Append a dated session entry to `docs/session.pdf` describing the work,
   changed files, and validation performed.
2. Keep `docs/session.pdf` as the single append-only session history across
   all sessions. Do not create a new session document, replace the existing
   PDF, or remove earlier entries.
3. Include the updated `docs/session.pdf` in the same commit as the code or
   documentation changes.

Only commit the changes relevant to the user's request, including the session
log update. If `docs/session.pdf` does not exist yet, create it as the initial
session document before committing.
