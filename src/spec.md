# Specification

## Summary
**Goal:** Add an initial splash page that displays “TV STREAMING NETWORK” on first app load before the existing Home view.

**Planned changes:**
- Introduce a new initial “Splash” view/state shown on first load, with the exact title text “TV STREAMING NETWORK”.
- Add a clear continue action on the splash page that transitions into the existing Home view.
- Hide the existing TopNav while the splash page is active, and render it normally after continuing to Home.

**User-visible outcome:** On first loading the app, users see a splash page titled “TV STREAMING NETWORK” with a continue action; after continuing, they reach the unchanged Home view with the normal TopNav and can access Admin Sign In and (if authorized) Manage Videos as before.
