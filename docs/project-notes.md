# Watch Reserve Project Notes

This document records ongoing product, design, and implementation decisions
that should be preserved throughout the project.

## 22 September 2026 — Valuation Link page top bar

- Keep the Google Reviews message in the top bar on the Valuation Link page.
- The Google Reviews message provides useful credibility and reassurance at
  this stage of the user's journey, so it should remain an advertisement for
  third-party social proof.
- Do not display the Valuation Link request CTA in the top bar when the user
  is already on the Valuation Link page. That message is redundant in this
  context.
- Any future changes to the Valuation Link page, announcement bar, navigation,
  or review messaging should preserve this distinction.

## Third-party service reminders

Use this section for reminders that should be revisited whenever related
pages, components, or integrations are changed.

- **Google Reviews:** Preserve the credibility-focused review message in the
  Valuation Link page top bar. Review this note whenever the announcement bar,
  navbar, or social-proof content is updated.
- Add similar reminders here for other third-party services, integrations, or
  external dependencies when a project decision depends on them.

## 23 September 2026 — Valuation email wording

- Use “Warm Regards” for customer email sign-offs across the popup modal,
  Ask Me Later, Valuation Link page, and Sell form, including the scheduled
  secure valuation link email. Keep the wording shared between HTML and text.
- Label staff notifications for these forms sent to info@watchreserve.co.uk
  with “[Internal]” in the subject and “Internal” in the HTML and plain-text body.
