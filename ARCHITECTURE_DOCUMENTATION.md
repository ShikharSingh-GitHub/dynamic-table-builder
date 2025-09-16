# Dynamic Table Builder - Comprehensive Architecture Documentation

## 🏗️ Application Overview

The **Dynamic Table Builder** is a full-stack application that allows users to dynamically create database tables through a web interface, then perform CRUD operations on the generated tables. It consists of a Node.js/Express backend with MySQL database and a React frontend.

### Core Concept

- **Metadata-Driven Architecture**: Table definitions are stored as JSON metadata in a registry
- **Dynamic DDL Generation**: SQL CREATE TABLE statements are generated from metadata
- **Runtime CRUD APIs**: Generic endpoints that operate on any provisioned table
- **Type-Safe Operations**: Column types and constraints are enforced at runtime

---

## 🔄 Overall Application Flow

```
1. User creates table schema via React UI
   ↓
2. Frontend sends table definition to backend
   ↓
3. Backend validates schema and generates DDL
   ↓
4. Physical table created in MySQL + metadata stored in registry
   ↓
5. User can now perform CRUD operations on the new table
   ↓
6. Dynamic routes use registry metadata to validate and execute operations
```

---

## 📁 Backend Architecture

### 🚀 Entry Point: `src/index.js`

**Purpose**: Application bootstrap and server initialization

**Integration Flow**:

```javascript
1. Load environment configuration
2. Initialize database connection
3. Ensure registry table exists
4. Mount route handlers
5. Start HTTP server
```

**Key Responsibilities**:

- CORS configuration for frontend communication
- JSON parsing middleware with 1MB limit
- Registry table creation on startup
- Error handling middleware registration
- Server lifecycle management

**Code Flow**:

```javascript
import dependencies → configure express app → ensure registry → mount routes → start server
```

---

### ⚙️ Configuration: `src/config.js`

**Purpose**: Centralized configuration management

**Integration**:

- Imported by `db.js` for database connection
- Used by `index.js` for server port configuration
- Environment variable validation and defaults

**Configuration Schema**:

```javascript
{
  port: 4000,                    // HTTP server port
  db: {                          // MySQL connection config
    host, port, user, password, database
  },
  adminToken                     // Future authentication token
}
```

---

### 🗄️ Database Connection: `src/db.js`

**Purpose**: Database client initialization and connection pooling

**Integration**:

- Used by all services and routes for database operations
- Connection pool management (min: 1, max: 10)
- SQL identifier sanitization

**Key Features**:

- Knex.js query builder integration
- MySQL2 client with connection pooling
- Automatic identifier sanitization to prevent injection

**Code Flow**:

```javascript
Load config → Initialize Knex with MySQL2 → Configure pool → Export client
```

---

### 🛣️ Routes Layer

#### Provision Routes: `src/routes/provision.js`

**Purpose**: Table creation and metadata management

**API Endpoints**:

```javascript
POST   /provision/table        // Create new table
GET    /provision/tables       // List all tables
DELETE /provision/table/:name  // Delete table and metadata
```

**Integration Flow**:

- Calls `createTableAndRegister` from registry service
- Uses `safeParse` for JSON definition handling
- Returns formatted table metadata with creation timestamps

**Code Flow (Create Table)**:

```javascript
Receive schema → Validate via registry service → Generate DDL → Execute DDL → Store metadata → Return result
```

#### Dynamic Routes: `src/routes/dynamic.js`

**Purpose**: Runtime CRUD operations on provisioned tables

**API Endpoints**:

```javascript
GET    /api/:table           // List records (paginated, searchable, sortable)
GET    /api/:table/:id       // Get single record
POST   /api/:table           // Create record
PUT    /api/:table/:id       // Update record
DELETE /api/:table/:id       // Delete record
```

**Integration Flow**:

- Loads metadata from registry service for validation
- Uses `buildListQuery` utility for search/pagination
- Validates columns against registry schema
- Executes parameterized queries via Knex

**Code Flow (List Records)**:

```javascript
Get table metadata → Build filtered query → Execute count + data queries → Format response
```

---

### 🔧 Services Layer

#### Registry Service: `src/services/registry.js`

**Purpose**: Core business logic for table management and metadata operations

**Key Functions**:

- `ensureRegistry(knex)`: Creates registry table on startup
- `getTableMeta(knex, tableName)`: Retrieves and parses table metadata
- `validateColumns(columns)`: Validates column definitions
- `createTableAndRegister(knex, payload)`: End-to-end table creation

**Integration**:

- Used by provision routes for table creation
- Used by dynamic routes for metadata lookup
- Handles both string and object JSON parsing

**Validation Rules**:

```javascript
- Table names: ^[a-z][a-z0-9_]{0,29}$
- Column names: same pattern
- Reserved names: id, created_at, updated_at
- Maximum 10 columns per table
- Supported types: string, integer, decimal, boolean, text, date, datetime, json
```

#### DDL Service: `src/services/ddl.js`

**Purpose**: SQL DDL generation from metadata

**Key Function**: `buildCreateTableSQL(tableName, columns)`

**Integration**:

- Called by registry service during table creation
- Translates abstract column types to MySQL types
- Handles default values and nullability

**Type Mapping**:

```javascript
string   → VARCHAR(255)
integer  → INT
decimal  → DECIMAL(10,2)
boolean  → TINYINT(1)
text     → TEXT
date     → DATE
datetime → DATETIME
json     → JSON
```

---

### 🛠️ Utilities Layer

#### Queries Utility: `src/utils/queries.js`

**Purpose**: Query building for list/search operations

**Key Function**: `buildListQuery({knex, tableName, meta, q, page, pageSize, sort, order})`

**Features**:

- Text search across string/text columns
- Column validation against metadata
- Pagination with limits (max 100 per page)
- Sorting with direction validation

#### Names Utility: `src/utils/names.js`

**Purpose**: Name validation and sanitization

**Validation Pattern**: `^[a-z][a-z0-9_]{0,29}$`
**Reserved Names**: `['id', 'created_at', 'updated_at']`

#### SQL Types Utility: `src/utils/sqlTypes.js`

**Purpose**: Type system definitions and validation

---

### 🚨 Middleware

#### Error Handler: `src/middleware/errors.js`

**Purpose**: Centralized error handling and response formatting

**Integration**: Mounted last in Express middleware chain

**Response Format**:

```javascript
{
  message: "error_type",
  error: "detailed_message"  // (only in development)
}
```

---

## 🎨 Frontend Architecture

### 🚀 Entry Point: `src/main.jsx`

**Purpose**: React application bootstrap

**Code Flow**:

```javascript
Import React → Render App component → Mount to DOM
```

### 📱 Root Component: `src/App.jsx`

**Purpose**: Application shell and routing configuration

**Integration**:

- Wraps entire app in React Query provider
- Configures React Router with navigation
- Provides common navigation header

**Route Structure**:

```javascript
/                    → Redirect to /admin/tables
/admin/tables        → TablesList (landing page)
/admin/new           → TableBuilder (create table)
/admin/:table        → TableAdmin (manage table data)
```

**Code Flow**:

```javascript
Setup QueryClient → Configure Router → Render Navigation → Route Components
```

---

### 📄 Pages Layer

#### Tables List: `src/pages/TablesList.jsx`

**Purpose**: Landing page displaying all provisioned tables

**Integration**:

- Uses `useTables` hook for data fetching
- Uses `useDeleteTable` hook for table deletion
- Links to TableBuilder for creation
- Links to TableAdmin for management

**Features**:

- Card-based table display
- Column count and preview
- Manage and Delete buttons
- Confirmation dialogs for deletion
- Loading states and error handling

**Code Flow**:

```javascript
Load tables → Render cards → Handle user actions (manage/delete) → Navigate or update
```

#### Table Builder: `src/pages/TableBuilder.jsx`

**Purpose**: Table schema creation interface

**Integration**:

- Form-based column definition
- Real-time validation
- Submission to provision API
- Navigation back to tables list

**Features**:

- Dynamic column addition/removal
- Type selection and validation
- Default value configuration
- Nullable/required settings
- Form validation and submission

**Code Flow**:

```javascript
Initialize form state → Render column inputs → Validate on change → Submit to API → Navigate
```

#### Table Admin: `src/pages/TableAdmin.jsx`

**Purpose**: Data management interface for specific tables

**Integration**:

- Uses dynamic API endpoints
- Table metadata-driven form generation
- Pagination and search controls
- Modal-based create/edit forms

**Features**:

- Paginated data display
- Search across text columns
- Sortable columns
- CRUD operations via modals
- Loading states and error handling

**Code Flow**:

```javascript
Load table metadata → Load data → Render table → Handle CRUD operations → Update display
```

---

### 🎣 Hooks Layer

#### Tables Hook: `src/hooks/useTables.js`

**Purpose**: React Query integration for tables data

**Exports**:

- `useTables()`: Fetches tables list
- `useDeleteTable()`: Mutation for table deletion

**Integration**:

- Used by TablesList for data and deletion
- Automatic cache invalidation after mutations
- Error handling and loading states

**Code Flow**:

```javascript
Setup React Query → Define query functions → Handle cache management → Export hooks
```

---

### 🌐 API Layer

#### API Client: `src/api/client.js`

**Purpose**: HTTP client configuration

**Integration**:

- Used by all hooks for API communication
- Axios instance with base URL configuration
- Request/response interceptors

**Configuration**:

```javascript
baseURL: 'http://localhost:4000'
Authorization: Bearer token (when auth enabled)
```

---

### 🎨 Styling

#### Global Styles: `src/index.css`

**Purpose**: Application-wide styling and utility classes

**Key Sections**:

- CSS variables for theming
- Layout utilities (flexbox, grid, spacing)
- Component-specific styles (buttons, forms, tables)
- Responsive design utilities

#### App Styles: `src/App.css`

**Purpose**: Application shell and navigation styling

---

## 🔄 Data Flow Patterns

### Table Creation Flow

```
1. User fills TableBuilder form
   ↓
2. Form validation (frontend)
   ↓
3. POST /provision/table with schema
   ↓
4. Backend validates schema (registry service)
   ↓
5. Generate DDL (ddl service)
   ↓
6. Execute CREATE TABLE (knex)
   ↓
7. Store metadata in registry
   ↓
8. Return success response
   ↓
9. Frontend navigates to tables list
   ↓
10. Tables list refreshes automatically
```

### CRUD Operations Flow

```
1. User navigates to TableAdmin
   ↓
2. Load table metadata (GET /provision/tables)
   ↓
3. Load table data (GET /api/:table)
   ↓
4. User performs operation (create/read/update/delete)
   ↓
5. Validate against metadata
   ↓
6. Execute database operation
   ↓
7. Return response
   ↓
8. Frontend updates UI and cache
```

### Search and Pagination Flow

```
1. User enters search term or changes page
   ↓
2. Frontend builds query parameters
   ↓
3. GET /api/:table?q=term&page=1&pageSize=10
   ↓
4. Backend builds filtered query using metadata
   ↓
5. Execute count and data queries
   ↓
6. Return paginated results
   ↓
7. Frontend renders results with pagination controls
```

---

## 🔒 Security Considerations

### Input Validation

- **SQL Injection Prevention**: Parameterized queries via Knex
- **Schema Validation**: Strict patterns for names and types
- **Request Size Limits**: 1MB JSON payload limit

### Data Sanitization

- **Identifier Sanitization**: Automatic cleanup of table/column names
- **Type Coercion**: Safe type conversion based on metadata
- **Reserved Name Protection**: Prevents overriding system columns

### Error Handling

- **Information Disclosure**: Generic error messages in production
- **Stack Trace Protection**: Detailed errors only in development
- **Graceful Degradation**: Fallback behavior for missing metadata

---

## 🚀 Deployment Architecture

### Development Setup

```
Frontend (Vite dev server) :5173
    ↓ (proxy /api requests)
Backend (Node.js/Express) :4000
    ↓
MySQL Database :3306
```

### Production Considerations

- **Frontend**: Static build served via CDN or web server
- **Backend**: Node.js process with PM2 or container orchestration
- **Database**: Managed MySQL instance with connection pooling
- **Environment Variables**: Secure configuration management

---

## 📊 Database Schema

### Registry Table: `table_registry`

```sql
CREATE TABLE table_registry (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(30) UNIQUE NOT NULL,
  definition JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Dynamic Tables (Example)

```sql
CREATE TABLE user_defined_table (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  custom_column_1 VARCHAR(255),
  custom_column_2 INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 Configuration Files

### Backend Package Configuration

- **package.json**: Dependencies and scripts
- **.env**: Environment variables (database, ports)
- **src/config.js**: Configuration object creation

### Frontend Build Configuration

- **package.json**: Dependencies and build scripts
- **vite.config.js**: Build tool configuration
- **eslint.config.js**: Code quality rules
- **index.html**: Application shell template

---

## 🧪 Testing Strategy

### API Testing

- **Postman Collection**: Comprehensive endpoint testing
- **Unit Tests**: Service layer validation
- **Integration Tests**: End-to-end table creation and CRUD

### Frontend Testing

- **Component Tests**: Individual page and hook testing
- **E2E Tests**: User workflow validation
- **Visual Tests**: UI consistency verification

---

## 📈 Performance Considerations

### Database Optimization

- **Connection Pooling**: Managed via Knex configuration
- **Query Optimization**: Indexed columns and efficient pagination
- **Schema Validation Caching**: Metadata loaded once per request

### Frontend Optimization

- **React Query Caching**: Automatic data caching and invalidation
- **Code Splitting**: Route-based lazy loading potential
- **Bundle Optimization**: Vite build optimizations

---

## 🔮 Future Enhancements

### Feature Roadmap

1. **Authentication & Authorization**: User-based access control
2. **Table Relationships**: Foreign key support
3. **Data Import/Export**: CSV and JSON data handling
4. **Advanced Queries**: Complex filtering and joins
5. **Audit Trails**: Change tracking and history
6. **API Documentation**: OpenAPI/Swagger integration

### Technical Improvements

1. **TypeScript Migration**: Enhanced type safety
2. **Real-time Updates**: WebSocket integration
3. **Caching Layer**: Redis integration for performance
4. **Monitoring**: Application performance monitoring
5. **Container Deployment**: Docker containerization

---

This documentation provides a comprehensive overview of the Dynamic Table Builder application architecture, covering both backend and frontend components, their integrations, and the overall data flow patterns that make the application function as a cohesive system.
