# 🎸 SoundShop Backend

This is the Laravel backend for **SoundShop**, a full-stack e-commerce application for music gear.

It provides a REST API used by the React frontend to manage users, products, and categories.

---

## ⚙️ Installation

Clone the project and move into the backend folder:

cd backend

Install dependencies:

composer install

Copy environment file:

cp .env.example .env

Generate application key:

php artisan key:generate

---

## 🗄️ Database Setup

Configure your database in `.env`:

DB_DATABASE=soundshop
DB_USERNAME=root
DB_PASSWORD=

Run migrations and seeders:

php artisan migrate --seed

---

## ▶️ Run the Server

Start Laravel development server:

php artisan serve

The API will be available at:

http://127.0.0.1:8000

---

## 🧰 Tech Stack

* Laravel
* PHP
* MySQL
* Eloquent ORM

---

## 🔐 Features

* REST API architecture
* Authentication system
* Role-based authorization (Admin / User)
* Product approval system
* CRUD operations for:

  * Users
  * Categories
  * Products

---

## 📡 Main Endpoints

### Auth

POST /api/register
POST /api/login

### Products

GET /api/products
POST /api/products
PUT /api/products/{id}
DELETE /api/products/{id}

### Categories

GET /api/categories
POST /api/categories

### Users (Admin only)

GET /api/users
PATCH /api/users/{id}/role

---

## 🧠 Business Logic

* Users can create products
* Admins can approve or reject products
* Only approved products are visible in the public catalog
* Admin routes are protected

---

## 📂 Project Structure (simplified)

app/
routes/
database/
controllers/

---

## 🚀 Future Improvements

* JWT authentication
* File/image storage (Cloud / S3)
* API rate limiting
* Pagination & performance optimization

---

## 📝 Notes

* This backend is consumed by the React frontend
* Make sure the frontend API base URL matches the backend server

---

## 👨‍💻 Author

Flavio Trettenero
Full Stack Developer (React + Laravel)

