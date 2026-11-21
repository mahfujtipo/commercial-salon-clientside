# SalonBook Client

SalonBook is a salon appointment booking platform. Customers browse services, request appointments, and pay for confirmed appointments through Stripe Checkout. Administrators manage services, appointments, customers, and transactions.

## Features

- Home page and service catalog with search, category filtering, price sorting, and pagination.
- Better Auth email/password and Google authentication, role-aware redirects, and blocked-account handling.
- Customer and admin dashboards for bookings, services, users, profiles, and payment history.
- Stripe Checkout; payment status changes only after a verified server webhook.
- ImgBB image uploads through server-side routes, plus loading, error, empty, toast, and responsive UI states.

## Technology

Next.js App Router, React, TypeScript, Tailwind CSS, Better Auth, MongoDB, Sonner, and Lucide React. The REST API lives in the separate Express server repository.

## Local setup

~~~powershell
npm install
Copy-Item .env.example .env
npm run dev
~~~

Run the Express server separately using its README. The client defaults to http://localhost:3000 and the local server to http://localhost:8000.

## Environment variables

| Variable | Purpose |
|---|---|
| BETTER_AUTH_SECRET | Better Auth signing secret |
| BETTER_AUTH_URL | Better Auth server URL |
| NEXT_PUBLIC_BETTER_AUTH_URL | Browser auth URL |
| MONGODB_URI | MongoDB connection string |
| DB_NAME | Shared database name; set to SalonBook |
| GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Google OAuth credentials |
| NEXT_PUBLIC_SERVER_URL | Express API base URL |
| IMGBB_API_KEY | Private key used only by the server-side upload route |

Copy .env.example to .env and fill in local credentials. Never commit .env.

## Authentication and payments

Better Auth stores users, sessions, and provider accounts in the SalonBook database. The client sends Better Auth JWTs to the Express API; the API verifies tokens against Better Auth JWKS and loads roles and blocked status from MongoDB. Stripe sessions are created by the server. Only a verified Stripe webhook can mark an appointment paid.

## Links

- Live website: Not configured in this repository.
- Client repository: No client Git remote is configured.
- Server repository: https://github.com/mahfujtipo/commercial-salon-server

## Project structure

- src/app/(site): public pages, including home, service browsing, authentication, callback, and payment routes.
- src/app/dashboard: shared role-aware customer/admin dashboard.
- src/app/api: Better Auth handler and image upload route.
- src/components: Navbar, home, service, dashboard, and shared UI components.
- src/lib: API client, actions, auth configuration, and JWT helpers.

## Production commands

~~~powershell
npm run build
npm start
~~~
