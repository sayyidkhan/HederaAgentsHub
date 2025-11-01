# Supabase Authentication Setup

This application uses Supabase for authentication. Follow these steps to set it up:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be set up (this may take a few minutes)

## 2. Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

## 3. Configure Environment Variables

1. Create a `.env.local` file in the `apps/ui` directory:
   ```bash
   cp apps/ui/.env.local.example apps/ui/.env.local
   ```

2. Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 4. Install Dependencies

```bash
pnpm install
```

This will install the required Supabase packages:
- `@supabase/supabase-js` - Supabase client library
- `@supabase/ssr` - Supabase SSR utilities for Next.js

## 5. Configure Email Templates (Optional)

1. In your Supabase dashboard, go to **Authentication** > **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 6. Enable OAuth Providers (Optional)

To enable Google Sign-In:

1. Go to **Authentication** > **Providers**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     ```
     https://your-project-ref.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (for development)
     ```
4. Copy Client ID and Client Secret to Supabase

## 7. Test Authentication

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `/register` to create a new account
3. Check your email for confirmation (if email confirmation is enabled)
4. Navigate to `/login` to sign in

## Features Included

- ✅ Email/Password registration and login
- ✅ Google OAuth (configurable)
- ✅ Protected routes with middleware
- ✅ Auth state management with React Context
- ✅ Email confirmation flow
- ✅ Password reset (link included in login page)
- ✅ Automatic session refresh
- ✅ User profile metadata (full name)

## File Structure

```
apps/ui/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth pages layout
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Registration page
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts        # OAuth callback handler
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts       # Client-side Supabase client
│       │   ├── server.ts       # Server-side Supabase client
│       │   └── middleware.ts   # Auth middleware helpers
│       └── auth-context.tsx    # Auth context provider
├── middleware.ts               # Next.js middleware for auth
└── .env.local.example         # Environment variables template
```

## Authentication Flow

### Registration
1. User fills out registration form
2. Supabase creates user account
3. Confirmation email is sent (if enabled)
4. User clicks confirmation link
5. User is redirected to home page

### Login
1. User enters email and password
2. Supabase validates credentials
3. Session is created
4. User is redirected to home page

### Protected Routes
- Middleware checks for active session
- Unauthenticated users are redirected to `/login`
- Authenticated users trying to access `/login` or `/register` are redirected to home

## Customization

### Disable Email Confirmation

In Supabase dashboard:
1. Go to **Authentication** > **Settings**
2. Uncheck "Enable email confirmations"

### Custom Redirect URLs

Modify the redirect URLs in:
- `apps/ui/app/(auth)/login/page.tsx`
- `apps/ui/app/(auth)/register/page.tsx`

### Add More OAuth Providers

Supabase supports:
- Google
- GitHub
- GitLab
- Bitbucket
- Azure
- Facebook
- Twitter
- Discord
- And more...

Follow the same process as Google OAuth setup for other providers.

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file has the correct credentials
- Restart the development server after changing environment variables

### Email not sending
- Check your Supabase email settings
- For production, configure a custom SMTP server in Supabase settings

### OAuth redirect issues
- Ensure redirect URLs are correctly configured in both Supabase and the OAuth provider
- Check that URLs match exactly (including http/https and port numbers)

## Security Notes

- Never commit `.env.local` file to version control
- Use environment variables for all sensitive data
- The `NEXT_PUBLIC_` prefix makes variables available to the browser
- Service role key should never be exposed to the client

