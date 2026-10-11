# 📚 Library Management System

A full-stack **Library Management System** built with the **MERN stack** (MongoDB, Express, React, Node.js). It provides role-based access for Admins and Users to manage books, borrowing, and user accounts with a modern, responsive UI.

---

## ✨ Features

### Authentication & Security
- User registration with **email verification** (OTP-based)
- Secure login with **JWT** token-based authentication
- **Forgot / Reset password** flow via email
- Automatic cleanup of unverified accounts
- Password hashing with **bcrypt**

### Admin Dashboard
- Overview statistics and **charts** (Chart.js)
- Full **CRUD** operations on the book catalog
- Manage all users and their roles
- Track all borrow records and returns

### User Dashboard
- Browse the book catalog
- Borrow and return books
- View personal borrowing history with due dates
- Profile with avatar upload (stored on **Cloudinary**)

### Automated Services
- **Email notifications** for upcoming due dates (via Nodemailer + node-cron)
- **Auto-removal** of unverified accounts on a schedule

---

## 🛠️ Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v7, Redux Toolkit |
| **Backend**  | Node.js, Express 5, Mongoose (MongoDB ODM)                   |
| **Database** | MongoDB                                                       |
| **Auth**     | JSON Web Tokens (JWT), bcrypt                                 |
| **Storage**  | Cloudinary (avatar uploads)                                   |
| **Email**    | Nodemailer                                                    |
| **Scheduler**| node-cron                                                     |
| **Charts**   | Chart.js + react-chartjs-2                                    |
| **State**    | Redux Toolkit + React-Redux                                   |
| **HTTP**     | Axios                                                         |

---

## 📁 Project Structure

```
library-managment-system/
├── client/                     # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/         # Reusable UI components
│       │   ├── AdminDashboard.jsx
│       │   ├── BookManagement.jsx
│       │   ├── Catalog.jsx
│       │   ├── MyBorrowedBooks.jsx
│       │   ├── UserDashboard.jsx
│       │   └── Users.jsx
│       ├── layout/             # Layout wrappers
│       ├── pages/              # Route-level pages
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── ResetPassword.jsx
│       │   └── OTP.jsx
│       ├── popups/             # Modal / popup components
│       ├── store/              # Redux store & slices
│       │   ├── store.js
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── bookSlice.js
│       │       ├── borrowSlice.js
│       │       ├── popUpSlice.js
│       │       └── userSlice.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── server/                     # Express backend
│   ├── config/                 # Environment config (config.env)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── borrowController.js
│   │   └── userController.js
│   ├── database/               # MongoDB connection
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── catchAsyncErrors.js
│   │   └── errorMiddlewares.js
│   ├── models/
│   │   ├── bookModel.js
│   │   ├── borrowModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── bookRouter.js
│   │   ├── borrowRouter.js
│   │   └── userRouter.js
│   ├── services/
│   │   ├── notifyUsers.js
│   │   └── removeUnverifiedAccount.js
│   ├── utils/
│   ├── app.js
│   └── index.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for image uploads)
- An email provider (e.g. Gmail) for Nodemailer

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/library-managment-system.git
cd library-managment-system
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `config/config.env` file with the following environment variables:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/library-management

FRONTEND_URL=http://localhost:5173

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

Start the development server:

```bash
npm run dev
```

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## 📡 API Endpoints

### Auth (`/api/v1/auth`)

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/register`         | Register a new user        |
| POST   | `/verify-otp`       | Verify email with OTP      |
| POST   | `/login`            | Login and receive JWT      |
| GET    | `/logout`           | Logout and clear cookie    |
| POST   | `/forgot-password`  | Send password reset email  |
| PUT    | `/reset-password/:token` | Reset password        |
| GET    | `/me`               | Get current user profile   |

### Books (`/api/v1/book`)

| Method | Endpoint   | Description             |
| ------ | ---------- | ----------------------- |
| GET    | `/all`     | Get all books           |
| POST   | `/admin/add` | Add a new book (Admin) |
| DELETE | `/admin/delete/:id` | Delete a book (Admin) |

### Borrow (`/api/v1/borrow`)

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| POST   | `/record-borrow/:id`    | Borrow a book                    |
| PUT    | `/return/:id`            | Return a borrowed book           |
| GET    | `/my-borrowed-books`     | Get current user's borrowed books|
| GET    | `/borrowed-books-by-users` | Get all borrow records (Admin) |

### Users (`/api/v1/user`)

| Method | Endpoint   | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/all`     | Get all users (Admin)    |

---

## 🧪 Scripts

### Server

| Script       | Command         | Description              |
| ------------ | --------------- | ------------------------ |
| Development  | `npm run dev`   | Start with Nodemon       |

### Client

| Script       | Command           | Description                |
| ------------ | ----------------- | -------------------------- |
| Development  | `npm run dev`     | Start Vite dev server      |
| Build        | `npm run build`   | Production build           |
| Preview      | `npm run preview` | Preview production build   |
| Lint         | `npm run lint`    | Run ESLint                 |

---


