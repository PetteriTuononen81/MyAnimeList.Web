# Authentication Implementation

## Overview
This anime tracking site now has a complete authentication system to protect personal features like Library and Profile.

## Features Implemented

### 1. **Auth Models** (`core/models/auth.model.ts`)
- `User` - User profile data
- `LoginRequest` - Login credentials
- `RegisterRequest` - Registration data
- `AuthResponse` - Token + user data from server

### 2. **Auth Service** (`core/services/auth.service.ts`)
Handles all authentication logic:
- **`login()`** - Authenticate user
- **`register()`** - Create new account
- **`logout()`** - Clear session and redirect
- **`getToken()`** - Get JWT token
- **`currentUser$`** - Observable for current user (reactive)
- **`isAuthenticated`** - Check if user is logged in

Uses `localStorage` to persist token and user data.

### 3. **Auth Interceptor** (`core/interceptors/auth.interceptor.ts`)
Automatically adds `Authorization: Bearer <token>` header to all HTTP requests.

### 4. **Auth Guard** (`core/guards/auth.guard.ts`)
Protects routes - redirects to `/login` if not authenticated.

### 5. **Login Component** (`features/auth/login`)
- Toggle between Login and Register forms
- Form validation
- Error handling
- Redirects to `/search` after successful login

### 6. **Protected Routes**
```typescript
{ path: 'library', component: Library, canActivate: [AuthGuard] }
{ path: 'profile', component: Profile, canActivate: [AuthGuard] }
```

## How It Works

### User Flow:

1. **User visits site** → Can browse Search/Home without login
2. **User clicks Library/Profile** → Redirected to `/login` (protected by AuthGuard)
3. **User logs in** → Token saved to localStorage, redirected to `/search`
4. **Subsequent requests** → Token automatically added to headers by AuthInterceptor
5. **User clicks logout** → Token cleared, redirected to `/login`

### Technical Flow:

```
Login Form → AuthService.login() → Backend API
                  ↓
            Save token & user to localStorage
                  ↓
            Update currentUser$ BehaviorSubject
                  ↓
            Navigate to /search
```

```
Protected Route → AuthGuard checks isAuthenticated
                       ↓
                  Yes → Allow access
                  No → Redirect to /login
```

```
HTTP Request → AuthInterceptor adds token header → Backend
```

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### POST `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

### POST `/api/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123"
}

Response: Same as login
```

## UI Changes

### Sidebar
- Shows **Login button** when not authenticated
- Shows **username + Logout button** when authenticated
- Uses `currentUser$ | async` for reactive updates

### Navigation
- Search/Home: Public (no auth required)
- Library/Profile: Protected (requires auth)

## Storage

**localStorage keys:**
- `auth_token` - JWT token
- `current_user` - User object (JSON string)

## Security Notes

1. **Token in localStorage** - Simple but vulnerable to XSS. For production, consider:
   - HttpOnly cookies
   - Refresh tokens
   - Token expiration handling

2. **Password validation** - Currently basic (6+ chars). Consider:
   - Stronger requirements
   - Password strength meter

3. **HTTPS** - Always use HTTPS in production

4. **Token refresh** - Not implemented. Add refresh token logic for long sessions.

## Testing

### Manual Testing:
1. Start app: `ng serve`
2. Navigate to `/library` → Should redirect to `/login`
3. Register new account
4. Should redirect to `/search` with auth
5. Navigate to `/library` → Should work now
6. Click logout → Should redirect to `/login`
7. Try `/library` again → Should redirect to `/login`

### What to Test in Backend:
- Login with valid credentials
- Login with invalid credentials (should return 401)
- Register new user
- Register duplicate email (should return 409)
- Access protected endpoints with token
- Access protected endpoints without token (should return 401)

## Future Enhancements

1. **Token expiration handling** - Auto-refresh or redirect on 401
2. **Remember me** - Longer session duration
3. **Password reset** - Forgot password flow
4. **Email verification** - Verify email on signup
5. **Social login** - Google, GitHub OAuth
6. **Profile editing** - Change username, password
7. **Avatar upload** - User profile pictures
8. **Session management** - View/revoke active sessions

## Architecture Benefits

✅ **Separation of Concerns**
- Service handles logic
- Component handles UI
- Guard handles protection
- Interceptor handles headers

✅ **Reactive**
- `currentUser$` updates UI automatically
- No manual state management

✅ **Reusable**
- AuthService can be used anywhere
- AuthGuard protects any route

✅ **Type-Safe**
- TypeScript interfaces for all data
- Compile-time error checking

## Files Created/Modified

### Created:
- `core/models/auth.model.ts`
- `core/services/auth.service.ts`
- `core/interceptors/auth.interceptor.ts`
- `core/guards/auth.guard.ts`
- `features/auth/login.ts`
- `features/auth/login.html`
- `features/auth/login.css`

### Modified:
- `core/models/index.ts` - Export auth models
- `app.routes.ts` - Add login route, protect routes
- `app.config.ts` - Add auth interceptor
- `layout/sidebar/sidebar.ts` - Add auth state
- `layout/sidebar/sidebar.html` - Show login/logout
- `layout/sidebar/sidebar.css` - Style auth UI
