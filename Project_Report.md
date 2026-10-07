# SMART INVENTORY MANAGEMENT SYSTEM

## 1. Introduction

The Smart Inventory Management System is a web-based application used to manage products and company assets.

The system allows users to login and register. After login, users can manage inventory, manage assets and view reports.

---

## 2. Objectives

The main objectives of the project are:

- To manage inventory products.
- To track product quantities.
- To identify low-stock products.
- To identify out-of-stock products.
- To manage company assets.
- To track asset locations and status.
- To provide inventory and asset reports.
- To store data in a MySQL database.
- To provide a simple and user-friendly interface.

---

## 3. Technologies Used

### Frontend
- React
- TypeScript
- HTML
- CSS
- Vite

### Backend
- Python
- FastAPI
- SQLAlchemy

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench

---

## 4. Main Modules

### 4.1 Login Module

The login module allows registered users to login using their email and password.

### 4.2 Registration Module

New users can create an account by providing:

- Name
- Email
- Password

Passwords are stored securely using hashing.

### 4.3 Dashboard Module

The dashboard displays:

- Total Products
- Total Quantity
- Low Stock
- Out of Stock
- Total Assets
- Maintenance Assets

It also provides quick actions and notifications.

### 4.4 Inventory Management Module

Users can:

- Add products
- View products
- Search products
- Edit products
- Delete products

Inventory status is automatically calculated according to quantity.

### 4.5 Asset Management Module

Users can:

- Add assets
- View assets
- Edit assets
- Delete assets
- Track asset location
- Track asset status

Asset statuses include:

- Available
- Assigned
- Maintenance

### 4.6 Reports Module

The reports module displays:

- Total products
- Total quantity
- Available products
- Low-stock products
- Out-of-stock products
- Total assets
- Available assets
- Assigned assets
- Maintenance assets

---

## 5. Database Design

The project uses a MySQL database named:

smart_inventory

The database contains three main tables.

### Users Table

| Column | Description |
|---|---|
| id | User ID |
| name | User name |
| email | User email |
| password | Hashed password |

### Inventory Table

| Column | Description |
|---|---|
| id | Product ID |
| product_name | Product name |
| quantity | Product quantity |
| status | Stock status |

### Assets Table

| Column | Description |
|---|---|
| id | Asset record ID |
| asset_id | Asset ID |
| asset_name | Asset name |
| location | Asset location |
| status | Asset status |

---

## 6. Inventory Status Logic

The system automatically calculates inventory status.

- Quantity = 0 → Out of Stock
- Quantity 1 to 5 → Low Stock
- Quantity greater than 5 → Available

---

## 7. System Flow

User opens the application.

↓

Login / Register

↓

Dashboard

↓

Inventory Management / Asset Management / Reports

↓

Data is stored in MySQL

↓

Updated information is displayed on the dashboard.

---

## 8. CRUD Operations

The system supports CRUD operations.

### Create
Add new inventory products and assets.

### Read
View inventory and asset information.

### Update
Edit existing inventory and asset information.

### Delete
Delete inventory products and assets.

---

## 9. Backend API

Important API endpoints include:

### Login
POST /login

### Registration
POST /register

### Inventory
GET /inventory

POST /inventory

PUT /inventory/{id}

DELETE /inventory/{id}

### Assets
GET /assets

POST /assets

PUT /assets/{asset_id}

DELETE /assets/{asset_id}

---

## 10. Conclusion

The Smart Inventory Management System provides a simple way to manage inventory and company assets.

The application connects a React frontend with a FastAPI backend and MySQL database.

It helps users track stock levels, manage assets and view useful reports from a single application.