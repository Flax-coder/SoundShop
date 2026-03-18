# 🎸 SoundShop Frontend

This is the React frontend for **SoundShop**, a full-stack e-commerce web application focused on music gear.

It provides the user interface for browsing products, managing authentication, and accessing admin features connected to the Laravel backend.

---

## ⚙️ Installation

Move into the frontend folder:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

---

## ▶️ Run the App

The application will be available at:

http://localhost:5173

---

## 🧰 Tech Stack

* React
* React Router
* Axios
* JavaScript
* CSS

---

## ✨ Features

* User registration and login
* Protected routes
* Product listing with filters
* Category navigation
* Search by product name
* Product detail view
* Admin dashboard interface
* Category management
* User management
* Product moderation
* Create product with:

  * Drag & drop image upload
  * Live preview

---

## 🔗 Backend Connection

This frontend communicates with the Laravel backend through a REST API.

Make sure the backend server is running at:

http://127.0.0.1:8000

---

## 📂 Project Structure

src/
│
├── components/
├── pages/
├── services/
├── context/
├── assets/

---

## 🧠 Main Functional Areas

### Authentication

* Login and registration forms
* Auth state management
* Role-based rendering

### Products

* Product grid
* Category filtering
* Search bar
* Product cards
* Product details

### Admin Area

* Users management
* Categories CRUD
* Products CRUD
* Approve / Reject workflow

### Create Product

* Form handling
* Image upload
* Real-time preview

---

## 📡 API Example

Example request:

axios.get("/api/products");

---

## 🚀 Future Improvements

* Better responsive design
* Global state management
* Improved form validation
* UI animations
* Pagination
* Checkout flow

---

## 📝 Notes

* This frontend is designed to work with the Laravel backend in `/backend`
* Make sure CORS is configured in Laravel
* Make sure API endpoints match your service files

---

## 👨‍💻 Author

Flavio Trettenero
Full Stack Developer (React + Laravel)
