# Security Notes

- Passwords are hashed with bcrypt before persistence.
- JWT signing uses the `JWT_SECRET` environment variable.
- Password hashes are excluded from API responses.
- Data endpoints require a bearer token.
- User listing is restricted to administrators.
- CORS is restricted to `FRONTEND_ORIGIN`.
- `.env` is ignored for new git tracking and must remain outside source control.

Before production, add rate limiting, security headers, refresh-token rotation, password reset, audit logging, and centralized monitoring.