# Implementation Plan - Empty Account System

This plan outlines the steps to remove the current mock/demo account logic and hardcoded data, leaving the system "empty" and ready for integration by a backend developer.

## Proposed Changes

### Auth Pages
The login and registration pages currently set a "Demo User" in the [AccountContext](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/contexts/account.tsx#15-19). This will be removed to ensure the system starts in an unauthenticated state.

#### [MODIFY] [login.tsx](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/pages/auth/login.tsx)
- Remove the `setAccount` block inside [handleSubmit](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/pages/auth/login.tsx#16-29).
- Add a comment: `// TODO: Implement backend login API call`.
- The user will remain unauthenticated (account: null) after clicking "Sign In".

#### [MODIFY] [register.tsx](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/pages/auth/register.tsx)
- Remove the `setAccount` block inside [handleSubmit](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/pages/auth/login.tsx#16-29).
- Add a comment: `// TODO: Implement backend registration API call`.
- The user will remain unauthenticated (account: null) after clicking "Register".

---

### Mock Data
The [profile.ts](file:///c:/Users/noval/Documents/PROJECT/Codaptive/data/profile.ts) file contains hardcoded statistics like XP and module progress. These will be reset to "zero" or "empty" states.

#### [MODIFY] [profile.ts](file:///c:/Users/noval/Documents/PROJECT/Codaptive/data/profile.ts)
- Set `currentXP` to `0`.
- Update `modules` to have `progress: 0` and `completed: 0`.
- This ensures that once a user is eventually created/logged in, they start with a clean slate unless the backend provides data.

---

### Layout Components
No functional changes are needed for [Navbar](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/components/layout/navbar.tsx#8-106), [Sidebar](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/components/layout/sidebar.tsx#22-114), or [Profile](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/pages/dashboard/profile.tsx#34-490), as they already correctly handle the `account === null` state by showing "Login" buttons or a "No account" card.

## Verification Plan

### Manual Verification
1. **Login Flow**:
   - Navigate to `/login`.
   - Click "Sign In".
   - Verify that you are redirected to `/profile` but see the "No account" placeholder instead of "Demo User".
2. **Register Flow**:
   - Navigate to `/register`.
   - Complete the steps and click "Register".
   - Verify that you are redirected to `/profile` but see the "No account" placeholder.
3. **Empty Data**:
   - (Temporarily) Manually set an account in [AccountContext](file:///c:/Users/noval/Documents/PROJECT/Codaptive/frontend/src/contexts/account.tsx#15-19) to verify that the profile shows `0 XP` and `0% progress` as per the new [profile.ts](file:///c:/Users/noval/Documents/PROJECT/Codaptive/data/profile.ts) defaults.
