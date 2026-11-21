# SalonBook – Client

SalonBook is a salon appointment booking platform. Customers browse salon services, request
appointments and pay for confirmed ones with Stripe. The salon administrator manages services,
appointments, customers and payments from a role-based dashboard.

- **Live website:** _add link_
- **Client repository:** _add link_
- **Server repository:** _add link_

## Important Features

- Public home page with featured services, categories, how-it-works and testimonials (all dynamic data comes from the API)
- Browse Services: search by name, category filter, price sorting and pagination
- Protected service details page with an appointment form and live time-slot availability
- Better Auth: email/password and Google sign in, blocked-user protection, return-to-page after login
- **One shared dashboard** (`/dashboard`) with role-based sidebar and content
  - Customer: overview, My Appointments (cancel pending, Pay Now for confirmed), profile
  - Admin: overview, Manage Services (image upload), Manage Appointments, Manage Users (block/unblock), Transactions, profile
- Stripe Checkout; payment status changes only after a verified Stripe webhook on the server
- Toast notifications (Sonner), confirmation dialogs, loading / empty / error states, responsive layout

## Technology Stack

Next.js (App Router, Cache Components), React, TypeScript, Tailwind CSS, Better Auth, Sonner, Lucide React.
The API lives in the separate Express/MongoDB server repository.

## Installation

```bash
git clone <client-repository-link>
cd salonbook-client
npm install
cp .env.example .env     # then fill in the values
```

## How to Run the Project Locally

1. Start the Express server (see the server README) on `http://localhost:8000`.
2. Start the client:

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # run the production build
```

## Required Environment Variables (names only)

| Name | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | Public URL of this client |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Same URL, used by the browser auth client |
| `MONGODB_URI` | MongoDB connection string (same database as the server) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `NEXT_PUBLIC_SERVER_URL` | Base URL of the Express API |
| `IMGBB_API_KEY` | ImgBB key, **private**, used only by the `/api/upload` server route |

Never commit `.env`.

## Project Structure

```
src/
├── app/
│   ├── (site)/        public pages with Navbar/Footer (home, services, login, register, payment)
│   ├── dashboard/     shared role-based dashboard
│   └── api/           Better Auth handler and sign-up image upload
├── components/        site, home, services, dashboard and ui components
├── hooks/             useAsyncData, useDebouncedValue
├── lib/               api.ts (requests), actions.ts (API calls), auth and JWT helpers
└── types/             shared TypeScript types
```

## Authentication and Roles

Better Auth issues a JWT (`clientsidejwt`) that is sent to the Express API. The role and blocked
status are always read from the server (`GET /api/v1/users/me`), and every protected API route
re-checks them. Hiding links in the UI is only a convenience.

## Deployment

Deploy to Vercel. Add all environment variables, set `BETTER_AUTH_URL` / `NEXT_PUBLIC_BETTER_AUTH_URL`
to the live client URL and `NEXT_PUBLIC_SERVER_URL` to the live API URL, and add the live URL to the
Google OAuth redirect URIs.
