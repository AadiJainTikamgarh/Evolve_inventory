# 🔌 REST API Specification

This document maps all public and protected HTTP REST API endpoints exposed by the **Evolve Lab backend server**.

---

## 🔑 Request Headers

All protected routes require an active authentication JSON Web Token passed inside the HTTP header:

```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 👥 Authentication & Users API (`/api/v1/user`)

### 1. Register User
- **Method & Path**: `POST /api/v1/user/register`
- **Auth**: Public (Requires email to be whitelisted in `wishlists`)
- **Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "607f191e810c19729de860ea",
        "name": "Alex Mercer",
        "email": "alex@example.com",
        "role": "user",
        "isDemo": false
      }
    }
  }
  ```

### 2. Login User
- **Method & Path**: `POST /api/v1/user/login`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "user": {
        "_id": "607f191e810c19729de860ea",
        "name": "Alex Mercer",
        "email": "alex@example.com",
        "role": "user",
        "isDemo": false
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 3. Change Password
- **Method & Path**: `POST /api/v1/user/change-password`
- **Auth**: User/Manager (JWT) (Restricted in Demo Mode)
- **Body**:
  ```json
  {
    "oldPassword": "strongpassword123",
    "newPassword": "newsuperpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

---

## 📦 Components & Inventory API (`/api/v1/component`)

### 1. Create Component
- **Method & Path**: `POST /api/v1/component/create`
- **Auth**: Manager (JWT) (Sandboxed in Demo Mode)
- **Body**:
  ```json
  {
    "name": "Arduino Uno R3",
    "image": "https://example.com/arduino.jpg",
    "description": "Standard microcontroller board",
    "component_working": 10,
    "component_not_working": 2,
    "component_in_use": 1,
    "remark": "Lab cupboard A",
    "category": "microcontroller"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "607f191e810c19729de860eb",
      "name": "Arduino Uno R3",
      "category": "microcontroller",
      "component_working": 10,
      "component_not_working": 2,
      "component_in_use": 1,
      "total_quantity": 13,
      "createdBy": "system",
      "isDemo": false
    }
  }
  ```

### 2. Update Component Quantities
- **Method & Path**: `PUT /api/v1/component/update`
- **Auth**: Manager (JWT) (Sandboxed in Demo Mode - allowed on demo components only)
- **Body**:
  ```json
  {
    "id": "607f191e810c19729de860eb",
    "component_working": 12,
    "component_not_working": 1,
    "component_in_use": 1,
    "remark": "Moved to shelf B"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "607f191e810c19729de860eb",
      "component_working": 12,
      "component_not_working": 1,
      "component_in_use": 1,
      "total_quantity": 14
    }
  }
  ```

### 3. Delete Component
- **Method & Path**: `DELETE /api/v1/component/:id`
- **Auth**: Manager (JWT) (Sandboxed in Demo Mode - allowed on demo components only)
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Component deleted successfully"
  }
  ```

### 4. Fetch Paginated Components (Search)
- **Method & Path**: `GET /api/v1/component/search`
- **Auth**: User/Manager (JWT)
- **Query Params**: `query=arduino`, `page=1`, `limit=10`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "_id": "607f191e810c19729de860eb",
          "name": "Arduino Uno R3",
          "category": "microcontroller"
        }
      ],
      "total": 1,
      "totalPages": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

---

## 🔄 Borrow & Request API (`/api/v1/request`)

### 1. Create Borrow Request
- **Method & Path**: `POST /api/v1/request/create`
- **Auth**: User/Manager (JWT) (Sandboxed in Demo Mode - target component must be demo-tagged)
- **Body**:
  ```json
  {
    "componentId": "607f191e810c19729de860eb",
    "quantity": 2
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Request created successfully",
    "data": {
      "_id": "607f191e810c19729de860ec",
      "userId": "607f191e810c19729de860ea",
      "componentId": "607f191e810c19729de860eb",
      "quantity": 2,
      "status": "pending",
      "isDemo": false
    }
  }
  ```

### 2. Approve/Reject Borrow Request
- **Method & Path**: `PATCH /api/v1/request/component-request/:reqId`
- **Auth**: Manager (JWT) (Sandboxed in Demo Mode - allowed on demo requests only)
- **Body**:
  ```json
  {
    "status": "approved" // or "rejected"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Request status updated successfully"
  }
  ```

### 3. Approve Return Submission
- **Method & Path**: `PATCH /api/v1/request/component-submit/:reqId`
- **Auth**: Manager (JWT) (Sandboxed in Demo Mode - allowed on demo requests only)
- **Body**:
  ```json
  {
    "status": "returned" // or "approved"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Return request approved successfully"
  }
  ```

---

## 🪵 Audit Logs API (`/api/v1/logs`)

### 1. Retrieve Audit Logs
- **Method & Path**: `GET /api/v1/logs`
- **Auth**: Manager (JWT)
- **Query Params**: `page=1`, `limit=20`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "607f191e810c19729de860ed",
        "userName": "Alex Mercer",
        "action": "CREATE",
        "details": "Created component: Arduino Uno R3",
        "createdAt": "2026-05-23T10:00:00.000Z"
      }
    ]
  }
  ```

---

## 🟢 Health Check API

### 1. Server Health
- **Method & Path**: `GET /api/v1/health`
- **Auth**: Public
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Server is up and running healthy"
  }
  ```
