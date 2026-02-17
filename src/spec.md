# Specification

## Summary
**Goal:** Make the admin dashboard (Manage Videos) appear and become accessible immediately after a signed-in user enters the admin code "Security777".

**Planned changes:**
- Ensure entering the admin token exactly "Security777" in the Admin Sign In dialog grants admin access for the current Internet Identity session, updating `useIsAdmin()` to `isAdmin=true` without a page refresh.
- After admin access is granted, reveal/enable the top navigation entry for the admin dashboard (“Manage Videos”) and allow navigation to the management UI (Add/Edit/Delete).
- Improve post-login UX by automatically navigating to “Manage Videos” after successful admin token application and showing a clear English confirmation; on incorrect token, show a clear English error and do not navigate.

**User-visible outcome:** Signed-in users who enter "Security777" will immediately see the “Manage Videos” dashboard in navigation and be taken to it automatically; incorrect codes won’t grant access and will show an English error.
