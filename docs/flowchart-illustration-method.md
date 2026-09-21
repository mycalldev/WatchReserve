# Hand-Drawn SVG Flowchart — Method

How the `Free Valuation Pipeline` artifact was built, so future pipeline/funnel
diagrams can be produced the same way without re-deriving the approach.

## What this actually is

A **hand-authored inline SVG flowchart** published as a Claude Code Artifact
(HTML page). No charting library, no Mermaid, no diagramming tool — every box,
diamond, and arrow is plain `<rect>` / `<polygon>` / `<path>` markup, sized and
positioned by hand from a coordinate plan worked out *before* writing any SVG.

This only works well when the mechanism is genuinely worth drawing — a real
branching process with decisions, parallel effects, and dead ends. A linear
list of steps doesn't need this; a sentence would say it faster.

## Process

1. **Read the real mechanism first, don't invent one.** Before drawing
   anything, go back to source: the actual code (component logic, API routes)
   and any existing internal docs. Every node in the diagram should map to a
   real branch, event, or state in the code — not a paraphrase of a feature
   list. For the pipeline diagram this meant re-reading
   `FreeValuationModal.svelte`, `AskMeLaterReminder.svelte`, and
   `popup-modal-pipeline.pdf` in full before sketching a single box.

2. **Plan the node graph as a table before touching SVG.** List every node
   with: its text (kept short — a label, not a sentence), its type (see
   taxonomy below), and which nodes it connects to. Then assign a coordinate
   grid by hand:
   - Pick 2–3 fixed column x-centers (e.g. left/center/right branches) and
     reuse them across the whole diagram so branches stay visually aligned.
   - Walk top to bottom assigning row y-values, leaving a consistent gap
     (30–40px) between a node's bottom edge and the next node's top edge for
     the connecting arrow.
   - Work out exact merge/fan-out points (where branches split or
     re-converge) as explicit coordinates, not "wherever it fits" — this is
     what keeps arrows orthogonal and legible instead of crossing.
   - Total up the resulting width/height up front and set the SVG
     `viewBox` to match, with a small margin.

3. **Keep node text terse; put the explanation in the figcaption.** A node
   gets a label (2–3 words, maybe a two-line label + one small mono subline
   for a literal code string like a `source` tag). The *why* and the fuller
   mechanism goes in a `<figcaption>` below the diagram, in prose. This one
   rule does more than anything else to keep a busy flowchart readable.

4. **Encode meaning with a small, consistent node taxonomy**, reused across
   every diagram so a reader only has to learn it once. This project's set:

   | Style | Meaning |
   |---|---|
   | Solid border, plain fill | A visitor/user action (submits, clicks, closes) |
   | Solid accent border + tinted fill | A moment where an offer/UI appears on screen |
   | Dashed neutral border, no fill | An automatic backend/system action (email sent, API call, sync) |
   | Dashed muted border + muted fill/text | A dead end — no lead, no further contact |
   | Solid accent fill, no border | A hub/merge point where multiple branches converge |
   | Diamond outline | A decision/branch point |

   Only add a legend when an encoding repeats 3+ times — a one-off doesn't
   need one.

5. **Route arrows orthogonally on the grid**, not as diagonal lines. A
   multi-segment `<path d="M x1,y1 L x1,ymid L x2,ymid L x2,y2">` reads as
   deliberate; anything eyeballed reads as noise. Reuse one `<marker>`
   arrowhead definition with `fill="currentColor"`, and set `color` + `stroke`
   together via a CSS class per arrow type (default / muted / accent) so the
   arrowhead always matches its line.

6. **Theme everything through CSS custom properties, not literals.** Define
   the full light palette on bare `:root`, then redefine only under
   `@media (prefers-color-scheme: dark)` guarded by
   `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]`.
   Style SVG shapes via CSS classes referencing `var(--token)` rather than
   hardcoded hex in the markup, so the whole diagram flips with the page
   theme for free.

7. **One figure, one claim.** If a second, distinct part of the story exists
   (e.g. a *planned but not-yet-built* stage), give it its own `<figure>`
   with its own caption rather than cramming it into the first diagram —
   and visually mark it as different (this project used a muted/reduced-
   opacity treatment + a "Planned — not yet built" tag) so it can't be
   mistaken for something already live.

8. **Wrap wide diagrams in a horizontally-scrolling container**, not a
   shrink-to-fit one. A detailed flowchart has a real minimum legible width;
   fight the phone-width layout rule by giving the SVG a fixed pixel width
   inside an `overflow-x: auto` wrapper, rather than letting `viewBox`
   scaling shrink the text away on mobile.

## Brand tokens used (this project)

Pulled from the actual codebase so the diagram matches the site rather than
inventing a new palette:

- Accent: `#a1846d` (light) / `#c9a882` (dark) — Watch Reserve's brand gold
- Ink: `#1c120f` (light) / `#f5efe9` (dark)
- Paper: `#faf8f6` (light) / `#150e0c` (dark)
- Display type: Fraunces (serif, headings only)
- Body/UI type: Public Sans
- Technical/data labels (event names, `source` strings): IBM Plex Mono

## Tooling notes

- Built via the Artifact tool's `quickstart` step (intent: `other`, no
  matching Artifact type existed), then the `artifact-diagramming` skill for
  the diagram-specific rules above.
- No JavaScript, no external diagram library — everything is static SVG, so
  the page stays small and the diagram renders identically everywhere.
- One rendering-quality check before publish: re-verify no two node
  rectangles overlap and every arrow's start/end coordinates land exactly on
  a node edge, since there is no live preview loop for hand-plotted SVG
  coordinates — this has to be gotten right from the coordinate plan.

## When to reach for this vs. something else

- **Use this** for a real branching process worth a reader tracing by eye:
  a funnel, a state machine, a request's path through several services.
- **Don't use this** for a simple linear sequence (a numbered list is
  faster to read and write) or for a diagram that will need to be edited by
  someone who isn't hand-plotting SVG coordinates — Mermaid (which Artifacts
  render natively via ` ```mermaid ` fences) is the better choice when the
  diagram is simple enough for its syntax and doesn't need this level of
  custom layout/taxonomy control.
