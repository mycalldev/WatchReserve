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

## 24 September 2026 — Top bar after valuation requests

- After a successful submission of the Free Valuation popup or Ask Me Later
  form, replace the homepage valuation CTA with the existing Google Reviews
  widget immediately.
- Use the shared valuation-submitted flag so the Google Reviews state survives
  navigation and refreshes, including previously submitted requests in the same
  browser. Dismissing a form or clicking Ask Me Later alone does not switch it.
- Keep the existing Google Reviews top bar on the Valuation Link page and other
  pages. Do not introduce a hard-coded rating.

## 24 September 2026 — Valuation Link customer confirmation

- Give Valuation Link submissions their own customer confirmation wording:
  “{month} Free Valuation”, using the shared Europe/London offer month.
- Use this wording in the email subject, heading and form name in both HTML
  and plain text. Do not call this funnel consignment.
- Keep the Sell page customer confirmation's Consignment Page Valuation Form
  wording and the scheduled valuation-link invitation as separate templates.

## 24 September 2026 — Monthly free valuation wording

- Derive the offer month from Europe/London time throughout the popup,
  Ask Me Later, navigation, Valuation Link page and their success messages.
- Keep open pages updated at month rollover and when returning to the tab.
- Use the current offer month in customer and internal free valuation emails;
  use the scheduled delivery month for the delayed secure-link email.
- Preserve historical review dates and the Sell page's consignment wording.
