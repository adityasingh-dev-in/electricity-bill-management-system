# ⚡ Electricity Bill Management System (EBMS)

A simple, structured, and scalable **MERN stack web application** designed to manage electricity billing for college departments or buildings.

The system enables administrators to:

- Track monthly meter readings  
- Automatically calculate electricity bills  
- Manage payments  
- Maintain structured billing records  
- Ensure transparency and data consistency  

---

## 📌 Project Overview

Electricity tracking in many colleges is handled manually or via spreadsheets, which leads to:

- Data inconsistency  
- Manual calculation errors  
- Poor historical tracking  
- Limited reporting visibility  

**EBMS digitizes the complete billing workflow**, from meter reading entry to payment tracking.

---

## 🎯 Core Features

- Department / Building management  
- Monthly meter reading entry  
- Automatic bill generation  
- Payment tracking system  
- JWT-based authentication  
- Admin-protected routes  
- Clean and modular backend architecture  

---

## 🏗 Tech Stack

### Frontend
- React.js  
- TypeScript  
- Tailwind CSS  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

### Security
- JWT Authentication  
- bcrypt password hashing  

---

## 🧠 System Architecture

```
Client (React + TypeScript)
        ↓
REST API (Express.js)
        ↓
MongoDB Database
```

---

# ⚙️ Setup & Installation Guide

## 1️⃣ Prerequisites

Ensure the following are installed:

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (Local or Atlas)
- Git

Verify:

```bash
node -v
npm -v
```

---

## 2️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd ebms
```

---

## 3️⃣ Project Structure

```
ebms/
 ├── backend/
 └── frontend/
```

Both must be configured separately.

---

# 🔧 Backend Setup (Express + MongoDB)

## Step 1: Navigate

```bash
cd backend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create `.env` File

Inside `backend/`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ebms
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### Environment Variables

| Variable     | Description |
|-------------|------------|
| PORT        | Server port |
| MONGO_URI   | MongoDB connection string |
| JWT_SECRET  | JWT signing secret |
| NODE_ENV    | Environment mode |

For MongoDB Atlas:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ebms
```

## Step 4: Run Backend

```bash
npm run dev
```

Expected output:

```
Server running on http://localhost:5000
MongoDB Connected
```

---

# 🎨 Frontend Setup (React + TypeScript)

## Step 1: Navigate

```bash
cd frontend
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure API Base URL

Create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Step 4: Run Frontend

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

# 🗄 Database Setup

If using local MongoDB:

```bash
mongod
```

Database `ebms` will be created automatically on first insert.

---

# 🔐 First-Time Admin Setup

Use Postman or any API client:

### Register Admin

```
POST /api/auth/register
```

```json
{
  "name": "Admin",
  "email": "admin@college.com",
  "password": "123456"
}
```

### Login

```
POST /api/auth/login
```

Use returned token:

```
Authorization: Bearer <token>
```

---

# 📂 Backend Data Models

## 1. Department
- name  
- buildingCode  
- meterNumber  
- location  
- isActive  

## 2. Meter Reading
- departmentId (ref)  
- month  
- year  
- previousReading  
- currentReading  
- unitsConsumed  
- readingDate  

## 3. Bill
- departmentId (ref)  
- month  
- year  
- unitsConsumed  
- ratePerUnit  
- totalAmount  
- dueDate  
- status (Pending / Paid)  

## 4. Payment
- billId (ref)  
- amountPaid  
- paymentDate  
- paymentMethod  
- transactionId  

## 5. Admin User
- name  
- email  
- password (hashed)  
- role  

---

# 🔄 Application Flow

1. Admin adds Department  
2. Admin enters monthly meter reading  
3. System calculates:

```
unitsConsumed = currentReading - previousReading
```

4. System generates bill:

```
totalAmount = unitsConsumed × ratePerUnit
```

5. Admin records payment and updates status  

---

# 🛠 API Endpoints

## Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

## Departments
- POST `/api/departments`
- GET `/api/departments`
- GET `/api/departments/:id`
- PUT `/api/departments/:id`
- DELETE `/api/departments/:id`

## Readings
- POST `/api/readings`
- GET `/api/readings`
- GET `/api/readings/:departmentId`
- PUT `/api/readings/:id`
- DELETE `/api/readings/:id`

## Bills
- POST `/api/bills`
- GET `/api/bills`
- GET `/api/bills/:departmentId`
- PUT `/api/bills/:id/status`

## Payments
- POST `/api/payments`
- GET `/api/payments`
- GET `/api/payments/:billId`

---

# 🚀 Production Build

### Backend
```
NODE_ENV=production
```

### Frontend
```bash
npm run build
```

Deploy frontend to:
- Vercel  
- Netlify  
- Or serve via Express  

---

# 📁 Suggested Folder Structure

```
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
 └── server.ts

frontend/
 ├── components/
 ├── pages/
 ├── services/
 ├── hooks/
 ├── types/
 └── App.tsx
```

---

# 📊 Future Improvements

- Analytics dashboard  
- PDF bill export  
- Role-based access control  
- Email notifications  
- Automated recurring billing  
- Rate configuration panel  

---

# 👨‍💻 Author

**Aditya Singh**  
MERN Stack Developer  

---

# 📜 License

This project is intended for educational and institutional use.