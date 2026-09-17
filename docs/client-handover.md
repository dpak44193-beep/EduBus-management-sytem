# Client Handover

## Current status

The application has a React/Vite frontend, Express API, MongoDB persistence foundation, JWT login, role-protected read APIs, and a Google Maps demo overlay.

## Required handover items

- Repository access managed by the client
- Production environment variables stored in a secret manager
- MongoDB owner and backup policy
- Hosting owner and DNS/TLS responsibility
- Monitoring and incident contact
- Seed account rotation after first login

## Known limitations

- Dashboard screens still contain demo data and several write workflows are not connected to persistent APIs.
- Automated unit, integration, and end-to-end tests are not yet present.
- GPS positions are simulated; the map embed is not a live fleet telemetry integration.
- Backup, monitoring, and rollback procedures remain deployment-specific.