# 📁 Project Management Tool – Backend (Express.js + MongoDB)

This is the backend API for the Project Management Tool, built using **Express.js**, **MongoDB**, and **JWT Authentication**. It supports user auth, project and task management, and includes a seed script.

---

## 🚀 Features

- User registration & login (JWT)
- Create, read, update, delete (CRUD) for:
  - Projects
  - Tasks (with filters)
- Bcrypt password hashing
- JWT protected routes
- MongoDB + Mongoose ODM
- Seeder script for test data

---

## 🧱 Tech Stack

- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv

---

## ⚙️ Setup Instructions

### 1. Clone Repo & Install
```bash
git clone https://github.com/Ashish32507/project-management.git
cd project-management-backend
npm install
```

### 2. Create `.env` File
```env
PORT=5000
MONGO_URI=mongodb+srv://ashishkumaryadavcse507:Ashish12@ashish.yfcpxeh.mongodb.net/project_management?retryWrites=true&w=majority
JWT_SECRET=project-management

```

### 3. Run Server
```bash
npm run dev
```

> Dev server runs on: `http://localhost:5000`

---

## 🌱 Seed the Database

Create:
- 1 test user: `test@example.com` / `Test@123`
- 2 projects
- 3 tasks per project

```bash
npm run seed
```

---

## 🔐 Auth Endpoints

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login & get token   |

---

## 📁 Projects API (JWT Required)

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/projects`       | Get all projects    |
| POST   | `/api/projects`       | Create a project    |
| PUT    | `/api/projects/:id`   | Update a project    |
| DELETE | `/api/projects/:id`   | Delete a project    |

---

## ✅ Tasks API (JWT Required)

| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| GET    | `/api/tasks/:projectId`        | Get tasks by project |
| GET    | `/api/tasks/:projectId?status=done` | Filter by status |
| POST   | `/api/tasks`                  | Create task          |
| PUT    | `/api/tasks/:id`              | Update task          |
| DELETE | `/api/tasks/:id`              | Delete task          |

---

## 📦 Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed/seed.js"
}
```

---

## 📌 Default Test User

```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

---



# 🌐 Project Management Tool – Frontend (React + Tailwind)

This is the frontend for the Project Management Tool using **React**, **Tailwind CSS**, and **Axios**. It connects to a Node.js backend and allows users to manage projects and tasks.

---

## 🚀 Features

- User registration & login with JWT
- Form validation with `react-hook-form` + `Yup`
- Dashboard with project listing
- Create, view, delete, and update tasks
- Task status filtering
- Protected routes via localStorage token
- Responsive UI with Tailwind CSS

---

## 🧱 Tech Stack

- React (JavaScript)
- Axios for HTTP requests
- Tailwind CSS for styling
- React Router for routing
- React Hook Form + Yup for forms

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/Ashish32507/project-management.git
cd project-management-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏁 Run the App

```bash
npm run dev
```

> App runs at: `http://localhost:5173`

---

## 📁 Routes Overview

| Path                | Page Description         |
|---------------------|--------------------------|
| `/`                 | Login Page               |
| `/register`         | Register Page            |
| `/dashboard`        | View & create projects   |
| `/projects/:id`     | View & manage tasks      |

---

## 📌 Default Test User

```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

---


