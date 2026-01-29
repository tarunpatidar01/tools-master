# CI / Deployment (Vercel via GitHub Actions)

This file documents how to deploy the project automatically from GitHub to Vercel using GitHub Actions.

## What this workflow does
- Runs on `push` to `main`
- Installs dependencies and builds the Next.js app
- Uses `amondnet/vercel-action` to deploy to Vercel (`--prod`)

## Required GitHub Secrets
Add the following secrets to your repository settings → Secrets → Actions:
- `VERCEL_TOKEN` — personal token created in Vercel (Account Settings → Tokens)
- `VERCEL_ORG_ID` — your Vercel organization ID (found in project settings)
- `VERCEL_PROJECT_ID` — your Vercel project ID (found in project settings)

## Environment Variables (Vercel Project)
Configure these in the Vercel Project Settings → Environment Variables:
- `EMAIL_USER` — Gmail or sender email
- `EMAIL_PASSWORD` — Gmail App Password OR
- `SENDGRID_API_KEY` — API key for SendGrid if you prefer SMTP via SendGrid
- `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` — optional

## How to deploy
1. Push your code to `main`.
2. Ensure the GitHub Secrets are configured.
3. The workflow will run and deploy to Vercel automatically.

## Notes
- If you prefer connecting directly to Vercel via GitHub integration (recommended), you can instead connect the repo in the Vercel dashboard and skip the GitHub Actions approach.
- Keep your email credentials secret. For production, SendGrid is recommended.
