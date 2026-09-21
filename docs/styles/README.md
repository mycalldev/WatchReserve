# Watch Reserve diagram styling

`flow-diagrams.css` is the shared stylesheet for project flowcharts and standalone
internal documentation. It preserves the popup pipeline diagram's warm neutral
palette, gold accents, serif headings, SVG node styles, dark mode, horizontal
scrolling and print layout. No external fonts or libraries are required.

## Use in a new document

For an HTML file saved directly in `docs/`, include:

```html
<link rel="stylesheet" href="styles/flow-diagrams.css" />
```

Use `popup-modal-pipeline-codex.html` as the working layout example. Wrap the
content in `<main>`, and each diagram in:

```html
<figure>
	<div class="scroll">
		<svg viewBox="0 0 1080 500" role="img" aria-labelledby="example-title">
			<title id="example-title">Describe the process</title>
			<!-- SVG nodes, connectors and arrow marker definition -->
		</svg>
	</div>
	<figcaption>Explain the mechanism and any limitations here.</figcaption>
</figure>
```

Every diagram needs an arrow marker definition. The default `.edge` rule refers
to `url(#arrow)`. For multiple diagrams on one page, give each marker a unique ID
and override `marker-end` for that diagram, as the popup pipeline HTML does.
Keep diagram-specific marker rules and coordinates in the document.

## Shared visual vocabulary

| Class                       | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `node`                      | Base shape for a visitor action                               |
| `node offer`                | Gold-tinted UI or offer shown to the visitor                  |
| `node system`               | Dashed automatic system action                                |
| `node end`                  | Muted endpoint or inactive stage; explain status in its label |
| `decision`                  | Diamond decision shape                                        |
| `edge`                      | Connector with an arrowhead                                   |
| `sub`                       | Secondary text inside a node                                  |
| `label`                     | Connector label                                               |
| `eyebrow`, `intro`, `badge` | Document introduction and status labels                       |
| `scroll`                    | Horizontally scrollable diagram container                     |

## Maintain and reuse

- Change shared colors in the `:root` variables and their dark-mode overrides.
- Edit this stylesheet to update every HTML document that links to it.
- Use the existing 1080-unit diagram grid, orthogonal arrows and concise labels.
- Follow `../flowchart-illustration-method.md` for diagram planning guidance.
- When sharing the HTML, include the `styles/` folder so the relative link works.
- Standalone SVG exports currently embed a snapshot of the styles to remain
  portable. Refresh that embedded CSS from this stylesheet when regenerating
  exports; existing exports do not update automatically.

This stylesheet styles entire documentation pages, including `body`, headings,
tables and SVGs. For customer-facing Svelte pages, scope the desired styles to a
component before importing them; the documentation stylesheet is not an app-wide
theme.
