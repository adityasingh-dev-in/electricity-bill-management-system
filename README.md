⚡ Electricity Bill Management System (EBMS) – College Level

A simple, structured, and scalable MERN-based web application designed to manage electricity billing for college departments or buildings.
The system helps administrators track meter readings, generate bills, manage payments, and maintain clean billing records with transparency.


---

You’re right — a proper README must include clear, production-grade setup instructions, not just install commands.

Below is a complete Setup & Configuration section you can directly use in your README.


---

⚙️ Complete Setup Guide

This guide assumes you are setting up the project locally for development.


---

1️⃣ Prerequisites

Make sure the following are installed:

Node.js (v18+ recommended)

npm or yarn

MongoDB (Local or MongoDB Atlas)

Git


Verify installation:

node -v
npm -v


---

2️⃣ Clone the Repository

git clone <your-repository-url>
cd ebms


---

3️⃣ Project Structure

ebms/
 ├── backend/
 └── frontend/

You must configure both separately.


---

4️⃣ Backend Setup (Express + MongoDB)

Step 1: Navigate to Backend

cd backend

Step 2: Install Dependencies

npm install

Step 3: Create Environment File

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ebms
JWT_SECRET=your_super_secret_key
NODE_ENV=development

🔎 Explanation of Variables

Variable	Purpose

PORT	Server running port
MONGO_URI	MongoDB connection string
JWT_SECRET	Used to sign authentication tokens
NODE_ENV	Environment mode


If using MongoDB Atlas:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ebms


---

Step 4: Run Backend Server

npm run dev

You should see:

Server running on http://localhost:5000
MongoDB Connected

If successful, backend is ready.


---

5️⃣ Frontend Setup (React + TypeScript)

Step 1: Navigate to Frontend

cd frontend

Step 2: Install Dependencies

npm install

Step 3: Configure API Base URL

Inside your frontend create:

frontend/.env

Add:

VITE_API_BASE_URL=http://localhost:5000/api

(If deployed, replace with production URL)


---

Step 4: Start Frontend

npm run dev

App will run on:

http://localhost:5173


---

6️⃣ Database Setup (Important)

If using local MongoDB:

Start MongoDB service:

mongod

Database ebms will be automatically created when first data is inserted.


---

7️⃣ First Time Admin Setup

Since this is an admin-based system:

1. Use Postman


2. Call:



POST /api/auth/register

Body:

{
  "name": "Admin",
  "email": "admin@college.com",
  "password": "123456"
}

Then login:

POST /api/auth/login

Copy returned JWT token.

Add token in headers:

Authorization: Bearer <token>

Now you can access protected routes.


---

8️⃣ Development Workflow

Backend Development

Add models in /models

Add controllers in /controllers

Add routes in /routes

Protect routes using middleware


Frontend Development

Use Axios instance

Attach JWT token in headers

Handle errors globally



---

9️⃣ Common Errors & Fixes

❌ MongoDB not connecting

Check if MongoDB service is running

Verify MONGO_URI


❌ JWT error

Ensure JWT_SECRET matches

Check Authorization header format


❌ CORS error

Make sure backend has:


app.use(cors())


---

🔟 Production Build

Backend

NODE_ENV=production

Frontend

npm run build

Deploy frontend build folder to:

Vercel

Netlify

Or serve via Express



---

✅ Final Checklist Before Running

Node installed

MongoDB running

.env created in backend

.env created in frontend

Backend running on port 5000

Frontend running on port 5173



---

📌 Project Overview

Electricity consumption tracking in colleges is often handled manually or through spreadsheets. This leads to:

Data inconsistency

Manual calculation errors

Poor record tracking

Lack of historical analytics


The Electricity Bill Management System (EBMS) digitizes the entire workflow:

1. Department / Building registration


2. Monthly meter reading entry


3. Automatic bill calculation


4. Payment tracking


5. Simple reporting




---

🎯 Project Objectives

Maintain centralized electricity consumption data

Automate monthly bill calculation

Track payment status (Paid / Pending / Partial)

Provide clean and structured backend architecture

Keep system minimal and easy to maintain



---

🏗 Tech Stack

Frontend

React.js

TypeScript

Tailwind CSS

Axios


Backend

Node.js

Express.js

MongoDB

Mongoose


Security & Utilities

JWT Authentication

bcrypt (Password Hashing)



---

🧠 System Architecture

Client (React + TS)
        ↓
REST API (Express.js)
        ↓
MongoDB Database


---

📂 Backend Models (Simplified Architecture)

1️⃣ Department / Building

Stores basic details of each department.

name

buildingCode

meterNumber

location

isActive



---

2️⃣ Meter Reading

Stores monthly meter readings.

departmentId (ref)

month

year

previousReading

currentReading

unitsConsumed

readingDate



---

3️⃣ Bill

Stores calculated bill details.

departmentId (ref)

month

year

unitsConsumed

ratePerUnit

totalAmount

dueDate

status (Pending / Paid)



---

4️⃣ Payment

Stores payment records.

billId (ref)

amountPaid

paymentDate

paymentMethod

transactionId



---

5️⃣ Admin User

Stores system administrator credentials.

name

email

password (hashed)

role



---

🔄 Application Flow

Step 1: Add Department

Admin registers department with meter details.

Step 2: Add Monthly Meter Reading

Admin enters current reading. System automatically calculates:

unitsConsumed = currentReading - previousReading

Step 3: Generate Bill

System calculates:

totalAmount = unitsConsumed × ratePerUnit

Step 4: Track Payment

Admin updates bill status when payment is received.


---

🛠 API Structure

Authentication

POST /api/auth/login

POST /api/auth/register



---

Department

POST /api/departments

GET /api/departments

GET /api/departments/:id

PUT /api/departments/:id

DELETE /api/departments/:id



---

Meter Readings

POST /api/readings

GET /api/readings

GET /api/readings/:departmentId

PUT /api/readings/:id

DELETE /api/readings/:id



---

Bills

POST /api/bills

GET /api/bills

GET /api/bills/:departmentId

PUT /api/bills/:id/status



---

Payments

POST /api/payments

GET /api/payments

GET /api/payments/:billId



---

🔐 Authentication & Authorization

JWT-based authentication

Passwords hashed using bcrypt

Admin-only protected routes

Middleware-based route protection



---

📊 Future Improvements

Dashboard with monthly consumption analytics

Export bills as PDF

Role-based access (Clerk, Accountant, Admin)

Email notifications for due bills

Automated recurring billing

Rate configuration panel



---

🚀 Installation Guide

1️⃣ Clone Repository

git clone <repository-url>
cd ebms


---

2️⃣ Install Dependencies

Backend

cd backend
npm install

Frontend

cd frontend
npm install


---

3️⃣ Environment Variables

Create .env in backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


---

4️⃣ Run Project

Backend

npm run dev

Frontend

npm run dev


---

📁 Suggested Folder Structure

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


---

📌 Why This Project Is Strong

Demonstrates full MERN architecture

Clean data relationships

Real-world administrative use case

Backend logic-focused system

Easily scalable for enterprise usage



---

👨‍💻 Author

Aditya Singh
Full Stack Developer (MERN)


---

📜 License

This project is built for educational and institutional use.

