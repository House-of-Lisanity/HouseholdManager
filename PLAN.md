# Authentication Implementation Plan

## Overview
Add full multi-user authentication to the Weekly Planner app using **bcrypt** (password hashing), **JWT** (access/refresh tokens in httpOnly cookies), and **Resend** (email for password resets). Leverage patterns from the admin-toolkit template.

---

## Architecture Decisions

- **Login identifier:** Email (not username — simpler, industry standard)
- **Token strategy:** Access token (15 min) + refresh token (7 days), both in httpOnly cookies
- **Refresh token rotation:** On refresh, issue new refresh token and invalidate old one (stored hashed in DB)
- **CSRF protection:** SameSite=Strict cookies + origin check on mutations
- **Password rules:** Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 symbol
- **Forgot password:** Email-based reset link (1-hour expiry, single-use, token stored hashed in DB)
- **"Forgot username":** Since login is email-based, this becomes "forgot which email I used" — we can add a "look up by name" feature, or skip this. (Clarification needed)
- **Rate limiting:** Track failed login attempts per email in DB, lockout after 5 failures for 15 minutes
- **Roles:** `admin` and `user` (from admin-toolkit pattern) — first registered user becomes admin

---

## Phase 1: Foundation (New Files)

### 1a. Install Dependencies
```
npm install bcryptjs jsonwebtoken resend
npm install -D @types/bcryptjs @types/jsonwebtoken
```

### 1b. Environment Variables (add to `.env`)
```
JWT_ACCESS_SECRET=<generate-random-secret>
JWT_REFRESH_SECRET=<generate-different-secret>
RESEND_API_KEY=<your-resend-api-key>
APP_URL=http://localhost:3000
```

### 1c. Create User Model — `src/models/User.ts`
```
Fields:
  - email: String, required, unique, lowercase, trimmed
  - name: String, required, trimmed
  - password: String, required (bcrypt hash)
  - role: 'admin' | 'user', default 'user'
  - refreshTokenHash: String (hashed refresh token for server-side invalidation)
  - failedLoginAttempts: Number, default 0
  - lockoutUntil: Date (null if not locked)
  - passwordResetToken: String (hashed)
  - passwordResetExpires: Date
  - emailVerified: Boolean, default false
  - timestamps: true
```

### 1d. Auth Utilities — `src/lib/auth.ts`
- `hashPassword(password)` — bcrypt hash with 12 salt rounds
- `comparePassword(plain, hash)` — bcrypt compare
- `generateAccessToken(user)` — JWT sign with userId, email, role (15 min)
- `generateRefreshToken(user)` — JWT sign with userId (7 days)
- `verifyAccessToken(token)` — JWT verify
- `verifyRefreshToken(token)` — JWT verify
- `setAuthCookies(response, accessToken, refreshToken)` — set httpOnly, secure, sameSite cookies
- `clearAuthCookies(response)` — clear both cookies
- `validatePassword(password)` — returns `{ valid: boolean, errors: string[] }` for the password rules

### 1e. Auth Middleware — `src/lib/apiAuth.ts` (adapted from admin-toolkit)
- `requireAuth(request)` — extract access token from cookie, verify, return user payload or 401
- `requireAdmin(request)` — call requireAuth, then check role === 'admin' or return 403
- Auto-refresh: if access token expired but refresh token valid, issue new tokens transparently

### 1f. Email Utility — `src/lib/email.ts`
- `sendPasswordResetEmail(email, resetUrl)` — send via Resend
- Template: simple, clean HTML email with reset link button

---

## Phase 2: Auth API Routes (New Files)

### 2a. `POST /api/auth/register` — `src/app/api/auth/register/route.ts`
- Accept: `{ email, name, password, confirmPassword }`
- Validate email format, password rules, password match
- Check if email already exists
- Hash password with bcrypt
- Create user (first user gets `role: 'admin'`)
- Generate tokens, set cookies
- Return `{ user: { id, email, name, role } }`

### 2b. `POST /api/auth/login` — `src/app/api/auth/login/route.ts`
- Accept: `{ email, password }`
- Check lockout status (reject if locked)
- Find user by email
- Compare password with bcrypt
- On failure: increment failedLoginAttempts, lock if >= 5
- On success: reset failedLoginAttempts, generate tokens, set cookies
- Return `{ user: { id, email, name, role } }`

### 2c. `GET /api/auth/me` — `src/app/api/auth/me/route.ts`
- Requires auth (middleware)
- Return current user data (no password)

### 2d. `POST /api/auth/logout` — `src/app/api/auth/logout/route.ts`
- Clear refresh token hash in DB
- Clear auth cookies
- Return success

### 2e. `POST /api/auth/refresh` — `src/app/api/auth/refresh/route.ts`
- Verify refresh token from cookie
- Verify token hash matches DB
- Issue new access + refresh tokens (rotation)
- Update refresh token hash in DB
- Set new cookies

### 2f. `POST /api/auth/forgot-password` — `src/app/api/auth/forgot-password/route.ts`
- Accept: `{ email }`
- Generate random reset token, hash it, store in DB with 1-hour expiry
- Send email via Resend with reset link
- Always return success (don't reveal if email exists)

### 2g. `POST /api/auth/reset-password` — `src/app/api/auth/reset-password/route.ts`
- Accept: `{ token, newPassword, confirmPassword }`
- Hash the incoming token, find user with matching hash + non-expired
- Validate new password rules
- Hash new password, save, clear reset token fields
- Return success

### 2h. `POST /api/auth/change-password` — `src/app/api/auth/change-password/route.ts`
- Requires auth
- Accept: `{ currentPassword, newPassword, confirmPassword }`
- Verify current password
- Validate new password rules
- Hash and save

---

## Phase 3: Frontend Auth (New Files)

### 3a. Auth Context — `src/contexts/AuthContext.tsx`
- Adapted from admin-toolkit's AuthContext
- State: `user | null`, `loading`, `isAuthenticated`
- On mount: call `GET /api/auth/me`
- Expose: `login()`, `logout()`, `register()`, `refreshUser()`

### 3b. Auth Pages (new routes)
- `/login` — `src/app/login/page.tsx` — email + password form
- `/register` — `src/app/register/page.tsx` — name + email + password + confirm password form
- `/forgot-password` — `src/app/forgot-password/page.tsx` — email form, success message
- `/reset-password` — `src/app/reset-password/page.tsx` — reads token from URL query, new password + confirm form

### 3c. Route Protection — `src/components/auth/AuthGuard.tsx`
- Wraps protected content
- If not authenticated and not loading, redirect to `/login`
- Show loading spinner while checking auth

### 3d. Auth Styles — `src/app/styles/_auth.scss`
- Login/register/forgot-password page styles
- Centered card layout, consistent with existing design (warm, paper-planner aesthetic)
- Password strength indicator
- Error/success message styling

---

## Phase 4: Integrate Auth into Existing App

### 4a. Update Root Layout — `src/app/layout.tsx`
- Wrap app with `AuthProvider` (outside ProfileProvider, since profile depends on auth)
- Add `AuthGuard` around the main content
- Login/register/forgot-password/reset-password pages render OUTSIDE the guard (public routes)

### 4b. Update Navigation — `src/components/navigation/Navigation.tsx`
- Add user name display + logout button
- Show different nav for logged-in vs. logged-out state

### 4c. Update ProfileContext — `src/contexts/ProfileContext.tsx`
- Profile fetch/save should now be user-scoped (handled by API middleware extracting userId from token)
- No changes needed to the context itself — the API routes handle scoping

---

## Phase 5: Multi-User Data Scoping

### 5a. Add `userId` to All Models (11 models)
Add `userId: { type: String, required: true, index: true }` to:
- Profile, CalendarPlan, CalendarResult, MealPlan, MealsResult
- WorkoutPlan, WorkoutsResult, TodoItem, RecurringItem, MealLog, WorkoutLog

### 5b. Update All API Routes (18 routes)
For every existing API route:
1. Add `requireAuth()` middleware call at the top
2. Extract `userId` from the auth payload
3. Add `userId` to all queries (find, findOne, create, update, delete)
4. Add `userId` when creating new documents

### 5c. Data Migration Script — `src/scripts/migrate-user-data.ts`
- Run once after first user registers
- Find all documents without a `userId` field
- Assign them to the first admin user
- Can be run via `npx ts-node src/scripts/migrate-user-data.ts`

---

## Phase 6: Admin Features (from admin-toolkit)

### 6a. Admin User Management — `src/app/admin/users/page.tsx`
- Adapted from admin-toolkit
- List all users, reset passwords
- Only accessible by admin role

### 6b. Admin API Routes
- `GET /api/admin/users` — list users (admin only)
- `POST /api/admin/users/[id]/reset-password` — admin password reset (from admin-toolkit)

---

## Implementation Order
Work in this order so each phase is testable before moving on:

1. **Phase 1** — Foundation (models, utilities, middleware)
2. **Phase 2** — Auth API routes
3. **Phase 3** — Frontend auth (context, pages, guard)
4. **Phase 4** — Wire auth into existing app layout
5. **Phase 5** — Add userId to models + update all routes
6. **Phase 6** — Admin features

---

## Files Created (New)
| File | Purpose |
|------|---------|
| `src/models/User.ts` | User account schema |
| `src/lib/auth.ts` | Token + password utilities |
| `src/lib/apiAuth.ts` | API middleware (requireAuth, requireAdmin) |
| `src/lib/email.ts` | Resend email service |
| `src/contexts/AuthContext.tsx` | Frontend auth state |
| `src/components/auth/AuthGuard.tsx` | Route protection wrapper |
| `src/app/login/page.tsx` | Login page |
| `src/app/register/page.tsx` | Registration page |
| `src/app/forgot-password/page.tsx` | Forgot password page |
| `src/app/reset-password/page.tsx` | Reset password page |
| `src/app/api/auth/register/route.ts` | Registration endpoint |
| `src/app/api/auth/login/route.ts` | Login endpoint |
| `src/app/api/auth/me/route.ts` | Current user endpoint |
| `src/app/api/auth/logout/route.ts` | Logout endpoint |
| `src/app/api/auth/refresh/route.ts` | Token refresh endpoint |
| `src/app/api/auth/forgot-password/route.ts` | Forgot password endpoint |
| `src/app/api/auth/reset-password/route.ts` | Reset password endpoint |
| `src/app/api/auth/change-password/route.ts` | Change password endpoint |
| `src/app/styles/_auth.scss` | Auth page styles |
| `src/app/admin/users/page.tsx` | Admin user management |
| `src/app/api/admin/users/route.ts` | Admin list users |
| `src/app/api/admin/users/[id]/reset-password/route.ts` | Admin password reset |
| `src/scripts/migrate-user-data.ts` | One-time data migration |

## Files Modified (Existing)
| File | Change |
|------|--------|
| `package.json` | Add bcryptjs, jsonwebtoken, resend deps |
| `.env` | Add JWT secrets, Resend key, app URL |
| `src/app/layout.tsx` | Add AuthProvider, AuthGuard |
| `src/app/globals.scss` | Import `_auth.scss` |
| `src/components/navigation/Navigation.tsx` | Add user menu, logout |
| 11 model files | Add `userId` field |
| 18 API route files | Add auth middleware + userId scoping |
