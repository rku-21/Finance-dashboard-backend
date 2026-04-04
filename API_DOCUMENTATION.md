# API Documentation

This documentation reflects the current backend behavior.

## 1. Base Configuration

- Base URL: `http://localhost:5000`
- Content type for request bodies: `application/json`
- Protected endpoints require:

```http
Authorization: Bearer <token>
```

Server route mounting:

- `/auth` -> auth routes
- `/records` -> record routes
- `/dashboard` -> dashboard routes
- `/users` -> user management routes

## 2. Setup And Seeding

Run from `backend` directory:

```bash
npm install
npm run seedRoles
npm run seedAdmin
npm run dev
```

- `seedRoles` inserts roles: `admin`, `analyst`, `viewer`
- `seedAdmin` inserts default admin users with role `admin` and status `active`

## 2.1 How The System Works (Brief Flow)

1. System setup creates base roles and admin accounts.
2. Admin logs in and uses `/users` APIs to create users with `name`, `email`, and assigned `role`.
3. Newly created user account exists without password.
4. User completes onboarding by calling `/auth/register` with email and password.
5. If email is found and account is active, password is set and JWT token is returned.
6. User then uses `/auth/login` for normal sign-in.
7. Every protected API call sends Bearer token.
8. Middleware validates token, loads user, checks account is active, then checks role permissions.
9. Based on role:
  - `admin` manages users and records.
  - `analyst` reads records and dashboard.
  - `viewer` reads dashboard only.
10. If admin marks a user `inactive`, that user is blocked from protected APIs.

## 3. Authentication And Access Control

### Authentication middleware behavior

For protected routes:

1. Reads Bearer token from `Authorization` header
2. Verifies JWT with `JWT_SECRET`
3. Loads user by token `userId`
4. Rejects if user status is not `active`

Authentication error behavior:

- `401` token missing -> `Unauthorized token missing`
- `401` user not found -> `User not found`
- `401` invalid/expired token -> `invalid or expired token`
- `403` inactive account -> `account is inactive`

### Role middleware behavior

Role middleware reads `req.user.roleId.name` and compares with allowed roles.

- If role not allowed -> `403` with `access denied for <role>`

## 4. Auth APIs

## `POST /auth/register`

Purpose:

- Registration for users already created by admin.
- User provides `email` and sets password if password is not set yet.

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Validation:

- `email` required
- `password` required
- password length must be at least 6

Behavior:

1. Finds user by email
2. If user does not exist -> registration denied
3. If user exists and status is inactive -> denied
4. If user exists and password is not set -> password is hashed and saved
5. If user already has password -> returns error to use login

Success response (`200`):

```json
{
  "success": true,
  "message": "register successfully",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "roleId": {
      "_id": "...",
      "name": "analyst"
    },
    "status": "active"
  }
}
```

Error cases:

- `400` missing email/password
- `400` password length < 6
- `400` `use login for existing account`
- `403` `account is inactive`
- `404` `account not found, contact admin`

## `POST /auth/login`

Purpose:

- Login for users who already have password set.

Request body:

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Behavior:

1. Finds user by email
2. Rejects if inactive
3. Rejects if password not set
4. Compares password with bcrypt hash
5. Returns token and user

Success response (`200`):

```json
{
  "success": true,
  "message": "login successfully",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "roleId": {
      "_id": "...",
      "name": "admin"
    },
    "status": "active"
  }
}
```

Error cases:

- `400` missing email/password
- `400` `password not set register first`
- `401` `invalid credentials`
- `403` `account is inactive`

## 5. User Management APIs (Admin Only)

All `/users` endpoints require:

- valid token
- role `admin`

## `POST /users`

Purpose:

- Admin creates user account with name, email, role.
- Password is not set here. User sets password via `/auth/register`.

Request body:

```json
{
  "name": "Aman",
  "email": "aman@example.com",
  "role": "analyst"
}
```

Validation:

- `name` required
- `email` required
- `role` required
- role must exist in Role collection

Success response (`201`):

```json
{
  "success": true,
  "message": "user created successfully",
  "user": {
    "_id": "...",
    "name": "Aman",
    "email": "aman@example.com",
    "roleId": {
      "_id": "...",
      "name": "analyst"
    },
    "status": "active"
  }
}
```

Error cases:

- `400` missing required fields
- `400` `invalid role provided`
- `409` `email already exists`

## `GET /users`

Purpose:

- Admin gets all users.

Success response (`200`):

```json
{
  "success": true,
  "users": [
    {
      "_id": "...",
      "name": "...",
      "email": "...",
      "status": "active",
      "roleId": {
        "name": "viewer"
      }
    }
  ]
}
```

## `GET /users/:id`

Purpose:

- Admin gets one user by id.

Error cases:

- `400` invalid user id
- `404` user not found

## `PUT /users/:id`

Purpose:

- Admin updates user fields.
- Supports role change using `role` field in request.

Request body examples:

```json
{
  "name": "Updated Name"
}
```

```json
{
  "role": "viewer"
}
```

```json
{
  "status": "inactive"
}
```

Behavior notes:

- If `role` is provided, service resolves role and updates `roleId`
- Admin cannot set own account to non-active through this endpoint

Error cases:

- `400` invalid user id
- `400` invalid role for updating
- `400` admin cannot mark itself inactive
- `404` user not found

## `PATCH /users/:id/status`

Purpose:

- Admin updates only status.

Request body:

```json
{
  "status": "inactive"
}
```

Allowed values:

- `active`
- `inactive`

Behavior notes:

- Admin cannot set own account status to inactive

Error cases:

- `400` invalid user id
- `400` status must be active or inactive
- `400` admin cannot mark self inactive
- `404` user not found

## `DELETE /users/:id`

Purpose:

- Admin deletes a user.

Behavior notes:

- Admin cannot delete own account.

Error cases:

- `400` invalid user id
- `400` admin cannot delete itself
- `404` user not found

## 6. Record APIs

All `/records` endpoints require valid token.

Role access:

- `POST /records` -> admin
- `GET /records` -> admin, analyst
- `GET /records/:id` -> admin, analyst
- `PUT /records/:id` -> admin
- `DELETE /records/:id` -> admin

## `POST /records`

Request body:

```json
{
  "amount": 1500,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

Required fields:

- `amount`
- `type`
- `category`
- `date`

Behavior:

- `userId` is attached from authenticated user (`req.user._id`)

## `GET /records`

Query filters supported:

- `type`
- `category`
- `startDate`
- `endDate`

Example:

```http
GET /records?type=expense&category=Food&startDate=2026-04-01&endDate=2026-04-30
```

Behavior:

- sorted by `createdAt` descending

## `GET /records/:id`

Behavior:

- validates Mongo ObjectId
- returns one record by id

## `PUT /records/:id`

Behavior:

- validates Mongo ObjectId
- updates with validators enabled
- returns updated record

## `DELETE /records/:id`

Behavior:

- validates Mongo ObjectId
- deletes and returns deleted record

Common record errors:

- `400` invalid record id or missing required create fields
- `404` record not found
- `403` role not allowed

## 7. Dashboard APIs

All dashboard endpoints require valid token and roles:

- `viewer`
- `analyst`
- `admin`

Endpoints:

- `GET /dashboard/summary`
- `GET /dashboard/category-wise-totals`
- `GET /dashboard/recent-activity?limit=5`
- `GET /dashboard/trends?range=monthly|weekly`

## `GET /dashboard/summary`

Returns:

- `totalIncome`
- `totalExpenses`
- `netBalance`

If no records exist, all values are `0`.

## `GET /dashboard/category-wise-totals`

Returns grouped totals by:

- `category`
- `type`

Each item includes:

- `totalAmount`
- `count`

## `GET /dashboard/recent-activity`

Query:

- `limit` optional, default `5`

Behavior:

- sorts by date desc, then createdAt desc

## `GET /dashboard/trends`

Query:

- `range` = `monthly` or `weekly`

Behavior:

- monthly groups by year+month
- weekly groups by ISO week year + ISO week
- returns income, expenses, netBalance by period

Error:

- `400` if range is not monthly/weekly

## 8. Data Models (Current)

## User

- `name`: String, required
- `email`: String, required, unique, lowercase, trim
- `password`: String, optional
- `roleId`: ObjectId (Role), required
- `status`: String enum -> `active` | `inactive`
- timestamps enabled

## Role

- `name`: enum `admin` | `analyst` | `viewer`

## Record

- `amount`: Number, required
- `type`: `income` | `expense`, required
- `category`: String, required
- `date`: Date, required
- `notes`: String, optional
- `userId`: ObjectId (User), required
- timestamps enabled
