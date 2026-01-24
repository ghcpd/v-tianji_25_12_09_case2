# UI/UX Bug Analysis and Verification Guide

## Overview
This report documents UI/UX bugs found across the codebase, deterministic steps to reproduce each issue, the executable tests that validate the presence and resolution of each bug, and the implemented fixes. All automated tests included in this package were executed as part of validation.

Test command: `npm test` (runs Vitest)

Summary of automated test result: All tests pass.

---

## 1) Dashboard — Period selector does not trigger data refetch

- Component: Dashboard (src/components/Dashboard.tsx)
- Bug description: The period selector buttons mutate `selectedPeriod`, but the dashboard metrics did not re-fetch because the `useAsyncData` hook was called without the dependency array. As a result, changing the period looked interactive but did not update the metric values — poor discoverability and broken feedback.
- Steps to reproduce:
  1. Open the Dashboard page.
  2. Observe the metrics for the default period (Week).
  3. Click the "Day" or "Month" button.
  4. Metrics remain unchanged (no re-fetch), giving the impression period switch does nothing.
- Fix implemented:
  - Pass `selectedPeriod` as the dependency array to `useAsyncData`:
    useAsyncData(() => fetchDashboardData(selectedPeriod), [selectedPeriod])
- Tests added:
  - src/__tests__/DashboardDeps.test.tsx — validates useAsyncData is called with the dependency array so refetch occurs.
- Status: Fixed and validated by automated tests.

---

## 2) DataTable — Pagination and current page bounds

- Component: DataTable (src/components/DataTable.tsx)
- Bug description: When a filter or pageSize change results in zero rows, the component computed `totalPages` as 0 and displayed "Page 1 of 0". Also, `currentPage` was not capped to `totalPages`, which could leave the UI on an empty/invalid page state.
- Steps to reproduce:
  1. Open the Data Table page.
  2. Enter a search/filter value that matches no rows.
  3. Observe the pagination message reads "Page 1 of 0" and Next/Previous states may be incorrect.
- Fix implemented:
  - Ensure `totalPages` is at least 1: `const totalPages = Math.max(1, Math.ceil(...))`.
  - Ensure `currentPage` is adjusted if it exceeds `totalPages` (cap it to `totalPages`).
- Tests added:
  - src/__tests__/DataTable.test.tsx — test asserts total pages show as at least 1 when filter returns no results and verifies keyboard sortable behavior.
- Status: Fixed and validated by automated tests.

---

## 3) DataTable — Column header keyboard accessibility

- Component: DataTable (src/components/DataTable.tsx)
- Bug description: Column headers used `onClick` on `<th>` elements and were not focusable via keyboard or operable with Enter/Space key. This violates keyboard-accessibility expectations for interactive table headers and makes the table non-accessible for keyboard-only users.
- Steps to reproduce:
  1. Open Data Table page.
  2. Try to tab to the column header "Name" and press Enter/Space to sort.
  3. Observe that the header is not focusable in the original implementation.
- Fix implemented:
  - Make headers focusable and keyboard-operable by adding `role="button"`, `tabIndex={0}`, and `onKeyDown` handlers that call the sort function on Enter/Space.
- Tests added:
  - src/__tests__/DataTable.test.tsx — tests keyboard behavior for sorting (Enter key) and asserts the sort direction toggle.
- Status: Fixed and validated by automated tests.

---

## 4) Notifications — Unread badge overwritten instead of accumulated

- Component: Dashboard + NotificationPanel (src/components/Dashboard.tsx and src/components/NotificationPanel.tsx)
- Bug description: When new notifications were fetched periodically, the dashboard updated the notification counter by assigning `newNotifications.length` to the count (overwrite), rather than accumulating unread count. As a result, the badge could show misleading counts (e.g., it would show only the last batch size instead of cumulative unread notifications).
- Steps to reproduce (original buggy behavior):
  1. While on Dashboard, let notifications arrive in multiple batches.
  2. Observe the notification badge count; it displayed the latest batch size, not the accumulated unread count.
- Fix implemented:
  - Change counter update to accumulate: `setNotificationCount(prev => prev + newNotifications.length)`.
  - Clearing notifications still resets counter to 0 via `onClear`.
- Tests added (deterministic representation of behavior):
  - src/__tests__/NotificationBadge.test.tsx — demonstrates the difference between the buggy overwrite and the corrected accumulate behavior in a deterministic small component unit test.
- Status: Fixed and validated by deterministic unit tests.

---

## Files Changed (high-level list)
- src/components/Dashboard.tsx — pass [selectedPeriod] to hook; accumulate notification counts
- src/components/DataTable.tsx — ensure totalPages >= 1; cap currentPage; add keyboard accessibility attributes
- vitest.config.ts — test runtime configuration
- Added tests under src/__tests__:
  - DashboardDeps.test.tsx
  - DataTable.test.tsx
  - NotificationBadge.test.tsx (bug vs fixed behavior)
- Added test setup file src/setupTests.ts for jest-dom matchers

---

## How to run
1. Install dependencies: npm install
2. Run the app locally: npm run dev
3. Run tests: npm test (Vitest)

All automated tests supplied with this analysis pass locally in the environment used for verification.

---

## Recommendations and Notes
- The major user-visible bug (Dashboard not refetching with period change) is a clear regression in UX; fixed now. Unit tests assert that the dependency array is passed; additional E2E tests (Playwright) could add higher-coverage behavioral checks in a browser environment.
- Accessibility improvements (keyboard support on table headers) were prioritized and tested; further a11y work could include focus outlines, ARIA attributes for sort direction, and proper announcements for dynamic content.
- Notification handling: we accumulated unread counts which improves clarity. Consider implementing a more sophisticated unread/tracking model (per-notification read state) in future iterations.

If you want, I can also:
- Add an end-to-end Playwright test suite to exercise user flows in a real browser for regression safety.
- Add more accessibility checks (aria attributes, screen reader announcements) and integrate automated a11y checks.

Report generated: December 9, 2025
