# UI/UX Bug Analysis and Verification Guide

This report lists the UI/UX issues I found in the codebase and the automated tests I added to reliably reproduce and verify each bug. All tests are runnable using Vitest. I executed the tests locally and confirmed they reproduce the issues.

---

## How to run the tests (quick)

1. Install dependencies (if you haven’t already):

```powershell
npm install
```

2. Run the tests once (headless):

```powershell
npm test -- --run
```

Notes:
- Tests use jsdom and Vitest; the repo has a `vitest.config.ts` and `src/setupTests.ts` to enable jest-dom matchers.
- Some tests use real timers to exercise interval behavior (longer-running). The `Dashboard` notification test may take ~11s because it exercises the 5s interval behavior.

---

## Summary — Issues found (by component)

1) Component: `Dashboard` (src/components/Dashboard.tsx)
   - Bug: Notification count shown in header is the size of the latest batch only, not the cumulative total of stored notifications. This makes the badge misleading when multiple batches arrive.
   - Why it’s bad: Users expect a notification badge to show the total number of unread/new notifications, not just the latest batch.
   - Steps to reproduce (manual):
     1. Open Dashboard and let notifications arrive in repeated batches.
     2. Observe notification badge number — it stays equal to the latest batch size, not cumulative.
   - Automated test that reproduces this: `src/components/__tests__/Dashboard.notifications.test.tsx` — verifies first and second batch behavior.
   - Test result (run here): Passed

2) Component: `Modal` (src/components/Modal.tsx)
   - Bug: Focus handling is incomplete — the modal manages focus of its first input when opened, but closing the modal does not restore focus to the previously-focused element.
   - Why it’s bad: Keyboard users and screen reader users lose their place; poor accessibility and unexpected UX.
   - Steps to reproduce (manual):
     1. Focus a button (or element) on the page.
     2. Open a modal that focuses its internal first input.
     3. Close the modal and observe where focus lands.
   - Automated test: `src/components/__tests__/Modal.focus.test.tsx` — asserts focus is not restored.
   - Test result (run here): Passed

3) Component: `DataTable` (src/components/DataTable.tsx)
   - Bug A — Pagination / zero results:
     - Bug: When filters produce zero results, the UI displays "Page 1 of 0" and "Next" remains enabled which is confusing and contradictory.
     - Why it’s bad: Misleading pagination state can confuse users.
     - Steps to reproduce: Enter a search term that matches no rows. Observe "Page 1 of 0" and navigation controls.
     - Automated test: `src/components/__tests__/DataTable.pagination.test.tsx` — validates the problematic state.
     - Test result (run here): Passed

   - Bug B — Keyboard accessibility of sortable headers:
     - Bug: Column headers are clickable to sort but they are not keyboard-focusable (missing keyboard affordance / role/tabindex), making them inaccessible to keyboard-only users.
     - Why it’s bad: Fails accessible interactions and keyboard navigation expectations.
     - Steps to reproduce: Tab through the table headers — the headers cannot be focused nor operated using keyboard.
     - Automated test: `src/components/__tests__/DataTable.accessibility.test.tsx` — checks header focusability.
     - Test result (run here): Passed

   - Bug C — Select-all semantics:
     - Bug: The "select all" checkbox only selects rows visible on the current page rather than all filtered results. This is surprising UX (not necessarily wrong, but inconsistent w/ many apps) and should be documented and/or changed.
     - Why it’s bad: Users often expect select-all to operate on the entire filtered set.
     - Steps to reproduce: Use select-all and compare selected count against total filtered results.
     - Automated test: `src/components/__tests__/DataTable.accessibility.test.tsx` — verifies select-all picks current page rows.
     - Test result (run here): Passed

4) Component: `ChartWidget` (src/components/ChartWidget.tsx)
   - Bug: The chart bars (SVG rects) lack accessible descriptions/labels (no `<title>`, aria-label, role, or visible text describing values).
   - Why it’s bad: Screen reader users cannot get values/meaning from the chart.
   - Steps to reproduce: Inspect SVG bars using accessibility tools or screen reader.
   - Automated test: `src/components/__tests__/ChartWidget.accessibility.test.tsx` — checks there is no `<title>` in the SVG.
   - Test result (run here): Passed

5) Component: `NotificationPanel` (src/components/NotificationPanel.tsx)
   - Bug: The toggle button uses single characters (`+`/`−`) as visible text and no aria-label, which gives a poor accessible name and not very descriptive for AT users.
   - Why it’s bad: Users relying on screen readers see a very short symbol as the accessible name.
   - Steps to reproduce: Inspect toggle button with a screen reader or check `aria-label`.
   - Automated test: `src/components/__tests__/NotificationPanel.accessibility.test.tsx` — asserts the button uses `+` as accessible name and lacks an aria-label.
   - Test result (run here): Passed

6) Component: `UserManagement` (src/components/UserManagement.tsx)
   - Bug: Deleting a user happens immediately and there is no confirmation step.
   - Why it’s bad: Dangerous destructive action with no confirmation can lead to accidental data loss.
   - Steps to reproduce: Open a user card, click Delete and observe removal.
   - Automated test: `src/components/__tests__/UserManagement.delete.test.tsx` — verifies a user is removed after clicking Delete.
   - Test result (run here): Passed

---

## Test files added

- src/components/__tests__/Dashboard.notifications.test.tsx
- src/components/__tests__/Modal.focus.test.tsx
- src/components/__tests__/DataTable.pagination.test.tsx
- src/components/__tests__/DataTable.accessibility.test.tsx
- src/components/__tests__/ChartWidget.accessibility.test.tsx
- src/components/__tests__/NotificationPanel.accessibility.test.tsx
- src/components/__tests__/UserManagement.delete.test.tsx

All tests were executed locally and passed (note `Dashboard` notification test is longer due to timing the real interval — the Vitest timeout has been increased globally in `vitest.config.ts`).

---

## Recommendations / Next steps (short)

1. Dashboard: Make `notificationCount` represent total unread/new notifications (e.g. sum or length of stored list) rather than just the size of the last batch.
2. Modal: Remember previously focused element and restore focus after closing (use a ref to store previously focused element). Also ensure focus trapping within modal.
3. DataTable: Fix page state when there are zero filtered results (show "Page 0 of 0" or hide pagination controls) and consider making select-all optionally act on entire filtered results (or add explicit copy explaining selection scope).
4. DataTable headers: Make sortable headers keyboard accessible (role=button or tabindex=0 and proper aria-sort) so keyboard users can operate them.
5. ChartWidget: Add meaningful accessible labels to each chart bar (title or aria-describedby) and consider keyboard interactivity to reveal values.
6. NotificationPanel: Add descriptive aria-labels for the toggle and ensure the badge describes its purpose e.g., aria-label="2 unread notifications".
7. UserManagement: Add a confirmation dialog / undo snackbar when deleting a user.

---

If you want, I can implement fixes for the most severe or highest-priority items (I can submit PRs for each fix and update tests accordingly).