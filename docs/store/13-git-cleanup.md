# Git

`server/.gitignore` and `client/.gitignore` ignore `.env` and the local env variants (`.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`).

Keep these out of commits:

- `server/.env` and `client/.env`
- `CJ_API_KEY`, Paystack secret keys, `BETTER_AUTH_SECRET`, `SESSION_SECRET`, database URLs
- Cloudinary secrets, Google client secrets, SMTP passwords

`server/.env.example` and `client/.env.example` are the checklists. They hold blank or placeholder values only. `CJ_API_KEY` in the example file stays empty.

If a secret was committed, rotate it in the provider dashboard and remove it from history before the repo is shared. Do not force-push `main` unless that is an explicit decision.
