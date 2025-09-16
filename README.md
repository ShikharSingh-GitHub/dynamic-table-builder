# 🚀 Dynamic Table Builder

A full-stack web application that allows users to dynamically create database tables through an intuitive interface and perform CRUD operations on the generated tables in real-time.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Dynamic Table Builder Demo](https://via.placeholder.com/800x400/1f2937/ffffff?text=Dynamic+Table+Builder+Demo)

## ✨ Features

### 🔧 Dynamic Table Creation

- **Visual Schema Builder**: Create tables using an intuitive web interface
- **Type-Safe Columns**: Support for string, integer, decimal, boolean, text, date, datetime, and JSON types
- **Column Constraints**: Configure nullable fields, default values, and validation rules
- **Real-time Validation**: Instant feedback on schema validation and naming constraints

### 📊 Data Management

- **Full CRUD Operations**: Create, read, update, and delete records
- **Advanced Search**: Text search across multiple columns
- **Pagination**: Efficient data browsing with configurable page sizes
- **Sorting**: Sort by any column in ascending or descending order
- **Responsive Tables**: Mobile-friendly data display

### 🎯 Admin Features

- **Table Registry**: View all created tables with metadata
- **Table Deletion**: Remove tables and associated data safely
- **Column Overview**: Preview table structure and column types
- **Creation Timestamps**: Track when tables were created and modified

### 🔒 Security & Validation

- **SQL Injection Protection**: Parameterized queries and input sanitization
- **Schema Validation**: Strict naming patterns and type checking
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Reserved Name Protection**: Prevents conflicts with system columns

## 🏗️ Architecture

### Backend (Node.js + Express)

- **RESTful API**: Clean endpoint design following REST principles
- **Metadata Registry**: JSON-based table definitions stored in MySQL
- **Dynamic DDL Generation**: Automatic SQL table creation from metadata
- **Query Builder**: Type-safe database operations using Knex.js

### Frontend (React + Vite)

- **Modern React**: Hooks-based architecture with functional components
- **State Management**: React Query for server state and caching
- **Responsive Design**: Mobile-first CSS with modern styling
- **Client-side Routing**: Single-page application with React Router

### Database (MySQL)

- **Connection Pooling**: Optimized database connections
- **JSON Column Support**: Native JSON storage for table metadata
- **Auto-generated Tables**: Dynamic table creation with consistent schema

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShikharSingh-GitHub/dynamic-table-builder.git
   cd dynamic-table-builder
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment**

   ```bash
   # Copy environment template
   cd ../backend
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:

   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=your_username
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=dynamic_table
   PORT=4000
   ```

4. **Setup database**

   ```sql
   CREATE DATABASE dynamic_table;
   ```

5. **Start the application**

   ```bash
   # Terminal 1: Start backend
   cd backend
   npm start

   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 API Documentation

### Provision Endpoints

| Method   | Endpoint                 | Description             |
| -------- | ------------------------ | ----------------------- |
| `GET`    | `/provision/tables`      | List all created tables |
| `POST`   | `/provision/table`       | Create a new table      |
| `DELETE` | `/provision/table/:name` | Delete a table          |

### Dynamic CRUD Endpoints

| Method   | Endpoint          | Description                         |
| -------- | ----------------- | ----------------------------------- |
| `GET`    | `/api/:table`     | List records with pagination/search |
| `GET`    | `/api/:table/:id` | Get a specific record               |
| `POST`   | `/api/:table`     | Create a new record                 |
| `PUT`    | `/api/:table/:id` | Update a record                     |
| `DELETE` | `/api/:table/:id` | Delete a record                     |

### Example: Create Table

```bash
curl -X POST http://localhost:4000/provision/table \
  -H "Content-Type: application/json" \
  -d '{
    "tableName": "users",
    "columns": [
      {
        "name": "first_name",
        "type": "string",
        "nullable": false,
        "default": ""
      },
      {
        "name": "email",
        "type": "string",
        "nullable": false
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
      }
    ]
  }'
```

## 🛠️ Development

### Project Structure

```
dynamic-table-builder/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   └── middleware/     # Express middleware
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/         # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── api/           # API client
│   └── package.json
├── ARCHITECTURE_DOCUMENTATION.md
└── README.md
```

### Available Scripts

#### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

#### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Testing

Run the comprehensive Postman collection for API testing:

1. Import `POSTMAN_API_TESTING_GUIDE.md` into Postman
2. Set up environment variables
3. Execute the test collection

## 📱 Screenshots

### Table Creation Interface

![Table Builder](https://via.placeholder.com/600x400/3b82f6/ffffff?text=Table+Builder+Interface)

### Data Management Dashboard

![Table Admin](https://via.placeholder.com/600x400/059669/ffffff?text=Data+Management+Dashboard)

### Tables Overview

![Tables List](https://via.placeholder.com/600x400/dc2626/ffffff?text=Tables+Overview)

## 🔧 Configuration

### Environment Variables

| Variable         | Description         | Default         |
| ---------------- | ------------------- | --------------- |
| `MYSQL_HOST`     | MySQL server host   | `localhost`     |
| `MYSQL_PORT`     | MySQL server port   | `3306`          |
| `MYSQL_USER`     | Database username   | -               |
| `MYSQL_PASSWORD` | Database password   | -               |
| `MYSQL_DATABASE` | Database name       | `dynamic_table` |
| `PORT`           | Backend server port | `4000`          |

### Database Schema

The application automatically creates a `table_registry` table to store metadata:

```sql
CREATE TABLE table_registry (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  table_name VARCHAR(30) UNIQUE NOT NULL,
  definition JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- Frontend powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Database operations with [Knex.js](https://knexjs.org/)
- Styling with modern CSS and custom utilities
- State management with [TanStack Query](https://tanstack.com/query)

## 📬 Contact

**Shikhar Singh** - [@ShikharSingh-GitHub](https://github.com/ShikharSingh-GitHub)

Project Link: [https://github.com/ShikharSingh-GitHub/dynamic-table-builder](https://github.com/ShikharSingh-GitHub/dynamic-table-builder)

---

⭐ **Star this repository if you find it helpful!**
