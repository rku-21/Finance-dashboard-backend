# Finance Dashboard Backend

## Overview

This project is a backend system for managing financial records and generating insights such as total income, expenses, and analytics. It implements role-based access control for admin, analyst, and viewer.

---

## System Design

### Entities

- User
- Role
- Record

### Relationships

- One User → Many Records
- One Record → One User
- One Role → Many Users

---

## Role-Based Access Control

### admin

- Full access to the system
- Create, read, update, and delete records
- Manage users (create, assign roles, delete)
- View dashboard (summary and analytics)

### analyst

- Read all records
- View dashboard (summary and analytics)
- No modification or user management

### viewer

- View dashboard summary only
- No access to records or analytics

---

## Database Schema

### User

- id
- name
- email 
- password 
- roleId
- status
- createdAt
- updatedAt

### Role

- id
- name (admin | analyst | viewer)
- createdAt
- updatedAt

### Record

- id
- amount
- type (income | expense)
- category
- date
- notes
- userId
- createdAt
- updatedAt

---

## API Documentation

The detailed API reference is in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

It includes the actual route behavior, request examples, role restrictions, query parameters, and error cases for:

- Auth endpoints
- Record endpoints
- Dashboard endpoints

---

## Folder Structure

```
/backend
  /config
    db.js
    seedRoles.js

  /models
    user.model.js
    role.model.js
    record.model.js

  /controllers
    auth.controller.js
    user.controller.js
    record.controller.js
    dashboard.controller.js

  /services
    auth.service.js
    user.service.js
    record.service.js
    dashboard.service.js

  /routes
    auth.routes.js
    user.routes.js
    record.routes.js
    dashboard.routes.js

  /middleware
    auth.middleware.js
    role.middleware.js

  /utils
    helpers.js

app.js
server.js
```

---

## How to Run

1. Install dependencies

```
npm install
```

2. Setup environment variables

```
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret
```

3. Start server

```
npm run dev
```

---

## Backend Flow

```
Route → Controller --> Service --> Model --> Database
```

---

## Key Features

- Role-based access control
- Financial record management
- Dashboard analytics
- Clean and scalable architecture







  
 


 


   
   
