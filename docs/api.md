# API Contract

## Authentication

`POST /api/auth/login`

Request:

```json
{"email":"admin","password":"configured-seed-password"}
```

The response contains a short-lived JWT. Send it on protected requests:

```text
Authorization: Bearer <token>
```

## Health

`GET /api/health`

This endpoint is public and returns service status without database details.

## Protected resources

- `GET /api/me`
- `GET /api/users` (admin only)
- `GET /api/students`
- `GET /api/drivers`
- `GET /api/buses`
- `GET /api/routes`
- `GET /api/attendance`
- `GET /api/notifications`

Unauthorized requests return `401`. Authenticated users without the required role receive `403`.