# Purchase Module API Documentation

## Overview
The Purchase Module handles car purchase operations for Pak Motors. It includes comprehensive CRUD operations with validation, authentication, and business logic specific to car dealerships.

## Base URL
```
/api/purchases
```

## Authentication
All purchase endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Purchase
**POST** `/api/purchases`

Creates a new car purchase record.

**Request Body:**
```json
{
  "serialNo": "string (required, unique)",
  "company": "string (required)",
  "model": "string (required)",
  "engineNumber": "string (required, unique)",
  "chasisNumber": "string (required, unique)",
  "registration": "string (required, unique)",
  "isNew": "boolean (default: true)",
  "horsePower": "string (required)",
  "color": "string (required)",
  "invoiceName": "string (required if isNew: true)",
  "invoiceDate": "string (required if isNew: true, ISO date)",
  "receiveDate": "string (required if isNew: true, ISO date)",
  "invoiceReceived": "boolean (default: false)",
  "invoiceDelivered": "boolean (default: false)",
  "warrantyBook": "boolean (default: false)",
  "warrantyBookDelivered": "boolean (default: false)",
  "sphereKey": "boolean (default: false)",
  "document": "boolean (default: false)",
  "purchaseAmount": "number (required, min: 0)",
  "attachedDocuments": "string[] (optional, file paths/URLs)",
  "purchaseFrom": "string (required)",
  "witness": "string (required)",
  "note": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase created successfully",
  "data": {
    "_id": "ObjectId",
    "serialNo": "1",
    "company": "Toyota",
    "model": "Corolla",
    // ... other fields
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Purchases
**GET** `/api/purchases`

Retrieves all purchases with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term (searches serialNo, company, model, engineNumber, chasisNumber, registration)
- `company` (optional): Filter by company
- `model` (optional): Filter by model
- `isNew` (optional): Filter by new/used cars (true/false)

**Example:**
```
GET /api/purchases?page=1&limit=10&search=Toyota&isNew=true
```

**Response:**
```json
{
  "success": true,
  "message": "Purchases retrieved successfully",
  "data": {
    "purchases": [
      {
        "_id": "ObjectId",
        "serialNo": "1",
        "company": "Toyota",
        // ... other fields
        "userId": {
          "_id": "ObjectId",
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 3. Get Purchase by ID
**GET** `/api/purchases/:id`

Retrieves a specific purchase by its ID.

**Response:**
```json
{
  "success": true,
  "message": "Purchase retrieved successfully",
  "data": {
    "_id": "ObjectId",
    "serialNo": "1",
    "company": "Toyota",
    // ... other fields
    "userId": {
      "_id": "ObjectId",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 4. Update Purchase
**PUT** `/api/purchases/:id`

Updates an existing purchase record.

**Request Body:** (Same as create, but all fields are optional)

**Response:**
```json
{
  "success": true,
  "message": "Purchase updated successfully",
  "data": {
    "_id": "ObjectId",
    "serialNo": "1",
    "company": "Toyota",
    // ... updated fields
  }
}
```

### 5. Delete Purchase
**DELETE** `/api/purchases/:id`

Deletes a purchase record.

**Response:**
```json
{
  "success": true,
  "message": "Purchase deleted successfully",
  "data": null
}
```

### 6. Get Purchase Statistics
**GET** `/api/purchases/stats`

Retrieves purchase statistics.

**Response:**
```json
{
  "success": true,
  "message": "Purchase statistics retrieved successfully",
  "data": {
    "totalPurchases": 100,
    "newCars": 60,
    "usedCars": 40,
    "totalAmount": 50000000,
    "averageAmount": 500000
  }
}
```

### 7. Get Dropdown Options
**GET** `/api/purchases/dropdown-options`

Retrieves dropdown options for frontend forms.

**Response:**
```json
{
  "success": true,
  "message": "Dropdown options retrieved successfully",
  "data": {
    "horsePower": ["800cc", "1000cc", "1200cc", ...],
    "colors": ["White", "Black", "Silver", ...],
    "companies": ["Toyota", "Honda", "Suzuki", ...]
  }
}
```

### 8. Get Next Serial Number
**GET** `/api/purchases/next-serial`

Retrieves the next available serial number for new purchases.

**Response:**
```json
{
  "success": true,
  "message": "Next serial number retrieved successfully",
  "data": {
    "nextSerialNumber": "101"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Serial number already exists",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Purchase not found",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null
}
```

## Business Rules

1. **Serial Number**: Must be unique and auto-incremented
2. **Engine Number**: Must be unique across all purchases
3. **Chasis Number**: Must be unique across all purchases
4. **Registration Number**: Must be unique across all purchases
5. **New Car Fields**: `invoiceName`, `invoiceDate`, and `receiveDate` are required only for new cars (`isNew: true`)
6. **Purchase Amount**: Must be a positive number
7. **Authentication**: All endpoints require valid JWT token

## Database Indexes

The following indexes are created for optimal query performance:
- `userId`
- `company`
- `model`
- `isNew`
- `serialNo`
- `engineNumber`
- `chasisNumber`
- `registration`

## Frontend Integration Notes

1. **Serial Number**: Use the `/next-serial` endpoint to get the next available serial number
2. **Dropdown Options**: Use the `/dropdown-options` endpoint to populate dropdowns
3. **Search**: Implement search functionality using the `search` query parameter
4. **Filtering**: Use `company`, `model`, and `isNew` parameters for filtering
5. **Pagination**: Implement pagination using `page` and `limit` parameters
6. **File Upload**: Handle `attachedDocuments` as an array of file paths/URLs
