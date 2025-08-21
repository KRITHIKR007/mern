# API Documentation - MERN Stack Agent Management System

## Overview

This document provides detailed information about all API endpoints available in the MERN Stack Agent Management System. The API follows RESTful principles and uses JSON for data exchange.

**Base URL**: `http://localhost:5000/api`
**Authentication**: JWT Bearer Token (for protected routes)

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/login

Authenticate admin user and receive JWT token.

**Endpoint**: `POST /api/auth/login`
**Authentication**: Not required
**Content-Type**: `application/json`

#### Request Body
```json
{
  "email": "string (required) - Admin email",
  "password": "string (required) - Admin password"
}
```

#### Response

**Success (200 OK)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

**Error Responses**
```json
// 400 Bad Request - Invalid credentials
{
  "error": "Invalid credentials"
}

// 400 Bad Request - Validation error
{
  "error": "Email and password are required"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'Admin@123'
  })
});
const data = await response.json();
```

---

## Agent Endpoints

### GET /agents

Retrieve all agents from the database.

**Endpoint**: `GET /api/agents`
**Authentication**: Required
**Content-Type**: `application/json`

#### Query Parameters
- None

#### Response

**Success (200 OK)**
```json
{
  "agents": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "__v": 0
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+0987654321",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "__v": 0
    }
  ]
}
```

**Error Responses**
```json
// 401 Unauthorized
{
  "error": "Access denied. No token provided."
}

// 403 Forbidden
{
  "error": "Invalid token"
}

// 500 Internal Server Error
{
  "error": "Server error message"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/agents', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

### POST /agents

Create a new agent.

**Endpoint**: `POST /api/agents`
**Authentication**: Required
**Content-Type**: `application/json`

#### Request Body
```json
{
  "name": "string (required) - Agent full name",
  "email": "string (required) - Unique email address",
  "phone": "string (required) - Phone number"
}
```

#### Validation Rules
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format, must be unique
- `phone`: Required, minimum 10 characters

#### Response

**Success (201 Created)**
```json
{
  "message": "Agent created successfully",
  "agent": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "New Agent",
    "email": "new.agent@example.com",
    "phone": "+1122334455",
    "createdAt": "2023-01-03T00:00:00.000Z",
    "__v": 0
  }
}
```

**Error Responses**
```json
// 400 Bad Request - Validation error
{
  "error": "Agent with this email already exists"
}

// 400 Bad Request - Missing fields
{
  "error": "Name, email, and phone are required"
}
```

#### Example Usage
```javascript
const response = await fetch('/api/agents', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Agent',
    email: 'new.agent@example.com',
    phone: '+1122334455'
  })
});
const data = await response.json();
```

---

## List Management Endpoints

### POST /lists/upload

Upload and process a CSV or Excel file, distributing items among available agents.

**Endpoint**: `POST /api/lists/upload`
**Authentication**: Required
**Content-Type**: `multipart/form-data`

#### Request Body
- `file`: File upload (CSV, XLS, or XLSX)
  - Maximum file size: 10MB
  - Supported formats: `.csv`, `.xls`, `.xlsx`

#### Processing Logic
1. Validates file format and size
2. Parses file content based on format
3. Retrieves all available agents
4. Distributes list items among agents using round-robin algorithm
5. Saves all items to database with agent assignments

#### Response

**Success (200 OK)**
```json
{
  "message": "File uploaded and processed successfully",
  "fileName": "data.csv",
  "processedItems": 150,
  "distributedAmongAgents": 5,
  "agentDistribution": {
    "John Doe": 30,
    "Jane Smith": 30,
    "Bob Johnson": 30,
    "Alice Wilson": 30,
    "Charlie Brown": 30
  }
}
```

**Error Responses**
```json
// 400 Bad Request - No file uploaded
{
  "error": "No file uploaded"
}

// 400 Bad Request - Invalid file type
{
  "error": "Only CSV and Excel files are allowed"
}

// 400 Bad Request - File too large
{
  "error": "File too large. Maximum size is 10MB"
}

// 400 Bad Request - No agents available
{
  "error": "No agents available for distribution"
}

// 400 Bad Request - File processing error
{
  "error": "Error processing file: Invalid file format"
}
```

#### Example Usage (JavaScript with FormData)
```javascript
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/lists/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
const data = await response.json();
```

### GET /lists

Retrieve all list items with pagination and search functionality.

**Endpoint**: `GET /api/lists`
**Authentication**: Required
**Content-Type**: `application/json`

#### Query Parameters
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10, max: 100)
- `search` (optional): Search term to filter items
- `agent` (optional): Filter by specific agent ID

#### Response

**Success (200 OK)**
```json
{
  "lists": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "data": {
        "name": "Customer Name",
        "email": "customer@example.com",
        "phone": "+1234567890",
        "address": "123 Main St"
      },
      "assignedAgent": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "fileName": "customers.csv",
      "uploadDate": "2023-01-01T00:00:00.000Z",
      "__v": 0
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 15,
    "totalItems": 150,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Responses**
```json
// 401 Unauthorized
{
  "error": "Access denied. No token provided."
}

// 400 Bad Request - Invalid pagination
{
  "error": "Page must be a positive number"
}
```

#### Example Usage
```javascript
// Basic request
const response = await fetch('/api/lists?page=1&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// With search
const searchResponse = await fetch('/api/lists?search=john&page=1', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### GET /lists/agent/:agentId

Get all list items assigned to a specific agent.

**Endpoint**: `GET /api/lists/agent/:agentId`
**Authentication**: Required
**Content-Type**: `application/json`

#### URL Parameters
- `agentId`: MongoDB ObjectId of the agent

#### Query Parameters
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)

#### Response

**Success (200 OK)**
```json
{
  "lists": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "data": {
        "name": "Customer Name",
        "email": "customer@example.com"
      },
      "assignedAgent": "507f1f77bcf86cd799439011",
      "fileName": "customers.csv",
      "uploadDate": "2023-01-01T00:00:00.000Z"
    }
  ],
  "agent": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "totalItems": 30
}
```

**Error Responses**
```json
// 404 Not Found
{
  "error": "Agent not found"
}
```

---

## Error Handling

### Standard Error Response Format
All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error details"
  }
}
```

### HTTP Status Codes Used

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Invalid or expired token |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error |

### Common Error Scenarios

#### Authentication Errors
```json
// Missing token
{
  "error": "Access denied. No token provided.",
  "code": "NO_TOKEN"
}

// Invalid token
{
  "error": "Invalid token",
  "code": "INVALID_TOKEN"
}

// Expired token
{
  "error": "Token expired",
  "code": "TOKEN_EXPIRED"
}
```

#### Validation Errors
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Email is required",
    "phone": "Phone number must be at least 10 characters"
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **File upload endpoints**: 10 requests per hour per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "isAdmin": "boolean",
  "createdAt": "Date",
  "__v": "number"
}
```

### Agent Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "createdAt": "Date",
  "__v": "number"
}
```

### ListItem Model
```json
{
  "_id": "ObjectId",
  "data": "Mixed (parsed file data)",
  "assignedAgent": "ObjectId (ref: Agent)",
  "fileName": "string",
  "uploadDate": "Date",
  "__v": "number"
}
```

---

## Testing the API

### Using curl

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

#### Get Agents
```bash
curl -X GET http://localhost:5000/api/agents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Agent
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","email":"test@example.com","phone":"+1234567890"}'
```

### Using Postman

1. Create a new collection for the API
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: `{{token}}`
3. Create a login request and use a test script to save the token:
   ```javascript
   pm.test("Save token", function () {
       var jsonData = pm.response.json();
       pm.environment.set("token", jsonData.token);
   });
   ```

---

## API Versioning

The current API version is v1. Future versions will be accessible via:
- `/api/v2/endpoint` for v2
- Default `/api/endpoint` will always point to the latest stable version

---

## Security Considerations

1. **JWT Tokens**: Expire in 24 hours, stored securely
2. **Input Validation**: All inputs are validated and sanitized
3. **File Upload**: File types and sizes are strictly validated
4. **Rate Limiting**: Prevents brute force and spam attacks
5. **CORS**: Configured for specific origins only
6. **Password Hashing**: Uses bcrypt with salt rounds

---

## Support and Feedback

For API support or to report issues:
- GitHub Issues: [Report a bug](https://github.com/KRITHIKR007/mern/issues)
- Email: api-support@example.com

---

*API Documentation last updated: January 2024*
