# Dynamic Table Builder - Postman API Testing Guide

## 🚀 Setup

### Base URL

```
http://localhost:4000
```

### Prerequisites

1. Start your backend server: `cd backend && npm start`
2. Ensure MySQL is running with the `dynamic_table` database
3. Import this guide into Postman or create requests manually

---

## 📋 API Endpoints Overview

### **Provisioning Endpoints**

- `GET /provision/tables` - List all created tables
- `POST /provision/table` - Create a new table

### **Dynamic CRUD Endpoints** (for each table)

- `GET /api/{table}` - List records with pagination/search/sort
- `GET /api/{table}/{id}` - Get single record
- `POST /api/{table}` - Create new record
- `PUT /api/{table}/{id}` - Update record
- `DELETE /api/{table}/{id}` - Delete record

---

## 🧪 Test Scenarios

### **1. Create a New Table**

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "users",
  "columns": [
    {
      "name": "first_name",
      "type": "string",
      "nullable": false,
      "default": ""
    },
    {
      "name": "last_name",
      "type": "string",
      "nullable": false,
      "default": ""
    },
    {
      "name": "email",
      "type": "string",
      "nullable": false,
      "default": ""
    },
    {
      "name": "age",
      "type": "integer",
      "nullable": true
    },
    {
      "name": "is_active",
      "type": "boolean",
      "nullable": false,
      "default": true
    },
    {
      "name": "bio",
      "type": "text",
      "nullable": true
    },
    {
      "name": "salary",
      "type": "decimal",
      "nullable": true
    },
    {
      "name": "birth_date",
      "type": "date",
      "nullable": true
    },
    {
      "name": "last_login",
      "type": "datetime",
      "nullable": true
    }
  ]
}
```

**Expected Response (200):**

```json
{
  "tableName": "users",
  "columns": [
    {
      "name": "first_name",
      "type": "string",
      "nullable": false,
      "default": ""
    }
    // ... other columns
  ]
}
```

---

### **2. Create Another Table (Products)**

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "products",
  "columns": [
    {
      "name": "product_name",
      "type": "string",
      "nullable": false,
      "default": ""
    },
    {
      "name": "description",
      "type": "text",
      "nullable": true,
      "default": ""
    },
    {
      "name": "price",
      "type": "decimal",
      "nullable": false,
      "default": 0.00
    },
    {
      "name": "in_stock",
      "type": "boolean",
      "nullable": false,
      "default": true
    },
    {
      "name": "stock_count",
      "type": "integer",
      "nullable": false,
      "default": 0
    }
  ]
}
```

---

### **3. List All Tables**

**Request:**

```http
GET /provision/tables
```

**Expected Response (200):**

```json
[
  {
    "tableName": "users",
    "definition": {
      "columns": [
        {
          "name": "first_name",
          "type": "string",
          "nullable": false,
          "default": ""
        }
        // ... other columns
      ]
    },
    "created_at": "2025-01-22T10:30:00.000Z",
    "updated_at": "2025-01-22T10:30:00.000Z"
  },
  {
    "tableName": "products",
    "definition": {
      "columns": [
        // ... product columns
      ]
    },
    "created_at": "2025-01-22T10:35:00.000Z",
    "updated_at": "2025-01-22T10:35:00.000Z"
  }
]
```

---

## 🔄 CRUD Operations Testing

### **4. Create Records**

#### Create User Record

**Request:**

```http
POST /api/users
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "is_active": true,
  "bio": "Software developer with 5 years of experience",
  "salary": 75000.50,
  "birth_date": "1993-05-15",
  "last_login": "2025-01-22 10:30:00"
}
```

**Expected Response (201):**

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "age": 30,
  "is_active": 1,
  "bio": "Software developer with 5 years of experience",
  "salary": "75000.5000",
  "birth_date": "1993-05-15",
  "last_login": "2025-01-22T10:30:00.000Z",
  "created_at": "2025-01-22T10:45:00.000Z",
  "updated_at": "2025-01-22T10:45:00.000Z"
}
```

#### Create Another User

**Request:**

```http
POST /api/users
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "age": 28,
  "is_active": false,
  "bio": "Product manager and UX designer",
  "salary": 85000.00,
  "birth_date": "1995-08-22",
  "last_login": "2025-01-20 15:45:00"
}
```

#### Create Product Records

**Request:**

```http
POST /api/products
Content-Type: application/json

{
  "product_name": "Laptop Pro",
  "description": "High-performance laptop for professionals",
  "price": 1299.99,
  "in_stock": true,
  "stock_count": 25
}
```

**Request:**

```http
POST /api/products
Content-Type: application/json

{
  "product_name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with long battery life",
  "price": 29.99,
  "in_stock": true,
  "stock_count": 150
}
```

---

### **5. Read Operations**

#### List All Users (with pagination)

**Request:**

```http
GET /api/users?page=1&pageSize=10&sort=first_name&order=asc
```

**Expected Response (200):**

```json
{
  "data": [
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith"
      // ... other fields
    },
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe"
      // ... other fields
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 2,
  "totalPages": 1,
  "sort": {
    "column": "first_name",
    "order": "asc"
  }
}
```

#### Search Users

**Request:**

```http
GET /api/users?q=john&page=1&pageSize=10
```

#### Get Single User

**Request:**

```http
GET /api/users/1
```

**Expected Response (200):**

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
  // ... all user fields
}
```

#### List Products with Sorting

**Request:**

```http
GET /api/products?sort=price&order=desc
```

---

### **6. Update Operations**

#### Update User

**Request:**

```http
PUT /api/users/1
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@newcompany.com",
  "age": 31,
  "is_active": true,
  "bio": "Senior software developer with 6 years of experience",
  "salary": 85000.00,
  "birth_date": "1993-05-15",
  "last_login": "2025-01-22 11:00:00"
}
```

**Expected Response (200):**

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@newcompany.com",
  "age": 31,
  "salary": "85000.0000",
  "updated_at": "2025-01-22T11:00:15.000Z"
  // ... other fields
}
```

#### Update Product Stock

**Request:**

```http
PUT /api/products/1
Content-Type: application/json

{
  "product_name": "Laptop Pro",
  "description": "High-performance laptop for professionals - Updated model",
  "price": 1199.99,
  "in_stock": true,
  "stock_count": 15
}
```

---

### **7. Delete Operations**

#### Delete User

**Request:**

```http
DELETE /api/users/2
```

**Expected Response (204):**

```
No content (empty response body)
```

#### Delete Product

**Request:**

```http
DELETE /api/products/2
```

---

## ❌ Error Testing Scenarios

### **8. Validation Errors**

#### Invalid Table Name

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "Invalid-Table-Name!",
  "columns": [
    {
      "name": "test_field",
      "type": "string",
      "nullable": false
    }
  ]
}
```

**Expected Response (400):**

```json
{
  "errors": {
    "tableName": "must match ^[a-z][a-z0-9_]{0,29}$"
  }
}
```

#### Duplicate Table Name

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "users",
  "columns": [
    {
      "name": "test_field",
      "type": "string",
      "nullable": false
    }
  ]
}
```

**Expected Response (400):**

```json
{
  "errors": {
    "tableName": "already exists"
  }
}
```

#### Invalid Column Type

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "test_table",
  "columns": [
    {
      "name": "test_field",
      "type": "invalid_type",
      "nullable": false
    }
  ]
}
```

#### Reserved Column Name

**Request:**

```http
POST /provision/table
Content-Type: application/json

{
  "tableName": "test_table2",
  "columns": [
    {
      "name": "id",
      "type": "string",
      "nullable": false
    }
  ]
}
```

**Expected Response (400):**

```json
{
  "errors": {
    "id": "is reserved"
  }
}
```

#### Missing Required Fields

**Request:**

```http
POST /api/users
Content-Type: application/json

{
  "first_name": "Test",
  "age": 25
}
```

**Expected Response (400):**

```json
{
  "message": "missing required fields",
  "fields": ["last_name", "email", "is_active"]
}
```

### **9. Not Found Errors**

#### Table Not Found

**Request:**

```http
GET /api/nonexistent_table
```

**Expected Response (404):**

```json
{
  "message": "table not found"
}
```

#### Record Not Found

**Request:**

```http
GET /api/users/999
```

**Expected Response (404):**

```json
{
  "message": "row not found"
}
```

#### Update Non-existent Record

**Request:**

```http
PUT /api/users/999
Content-Type: application/json

{
  "first_name": "Test"
}
```

---

## 📊 Advanced Query Testing

### **10. Pagination & Sorting**

#### Large Page Size (should be capped at 100)

**Request:**

```http
GET /api/users?pageSize=500
```

#### Sort by Different Columns

**Request:**

```http
GET /api/users?sort=age&order=desc
```

**Request:**

```http
GET /api/users?sort=created_at&order=asc
```

#### Search with Pagination

**Request:**

```http
GET /api/users?q=doe&page=1&pageSize=5
```

---

## 🔧 Postman Collection Setup

### Environment Variables

Create a Postman environment with:

```
base_url: http://localhost:4000
table_name: users
record_id: 1
```

### Pre-request Scripts

For dynamic testing, add this pre-request script:

```javascript
// Generate random data
pm.globals.set(
  "random_email",
  "test" + Math.floor(Math.random() * 1000) + "@example.com"
);
pm.globals.set("random_name", "User" + Math.floor(Math.random() * 100));
```

### Test Scripts

Add these test scripts to validate responses:

#### For successful CREATE operations:

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Response has id field", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("id");
});

pm.test("Response has timestamps", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("created_at");
  pm.expect(jsonData).to.have.property("updated_at");
});
```

#### For LIST operations:

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has pagination info", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("data");
  pm.expect(jsonData).to.have.property("total");
  pm.expect(jsonData).to.have.property("page");
  pm.expect(jsonData).to.have.property("pageSize");
});
```

---

## 🎯 Complete Test Sequence

Run these requests in order for a complete test:

1. **Setup**: Create 2-3 tables with different column types
2. **CRUD**: Create, read, update, delete records in each table
3. **Validation**: Test all error scenarios
4. **Queries**: Test pagination, sorting, searching
5. **Cleanup**: Delete test records (optional)

This guide covers all API endpoints and edge cases for comprehensive testing of your Dynamic Table Builder! 🚀
