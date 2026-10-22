# HireHub Backend

A production-inspired Job Portal Backend built with **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, **JWT Authentication**, and **Cloudinary**.

It supports authentication, role-based authorization, job management, applications, recruiter dashboard, and resume uploads.

---

# Features

## Authentication

- Register Student
- Register Recruiter
- Login
- JWT Authentication
- Protected Routes
- Role Based Authorization

---

## Jobs

- Create Job
- Get All Jobs
- Search Jobs
- Filter Jobs
- Get Job By ID
- Update Job
- Delete Job

---

## Applications

- Apply for Job
- View My Applications
- Recruiter View Applications
- Update Application Status

---

## Resume

- Upload Resume
- Store Resume on Cloudinary
- Replace Existing Resume

---

## Dashboard

Recruiter Dashboard Statistics

- Total Jobs
- Total Applications
- Pending Applications
- Accepted Applications
- Rejected Applications

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- Zod

---

# Folder Structure

```
src
│
├── config
│   ├── db.ts
│   ├── env.ts
│   └── cloudinary.ts
│
├── controllers
│
├── middlewares
│
├── models
│
├── routes
│
├── services
│
├── types
│
├── utils
│
└── validations
```

---

# Installation

Clone Repository

```bash
git clone <Shivam9581-Hirehub>
```

Move into project

```bash
cd server
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# Run Project

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

---

# Base URL

```
http://localhost:5000/api
```

---

# Authentication APIs

## Register

**POST**

```
/auth/register
```

Body

```json
{
  "name": "Shivam Kumar",
  "email": "shivam@gmail.com",
  "password": "123456",
  "role": "student"
}
```

---

## Login

**POST**

```
/auth/login
```

Body

```json
{
  "email": "shivam@gmail.com",
  "password": "123456"
}
```

Returns

```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

## Get Profile

**GET**

```
/auth/profile
```

Authorization

```
Bearer Token
```

---

## Upload Resume

**PATCH**

```
/auth/resume
```

Authorization

```
Bearer Token
```

Body

```
form-data

resume -> File
```

---

# Job APIs

## Create Job

**POST**

```
/jobs
```

Authorization

```
Bearer Recruiter Token
```

Example

```json
{
  "title": "Backend Developer",
  "company": "Google",
  "location": "Bangalore",
  "salary": 2500000,
  "jobType": "fullTime",
  "description": "Node.js Developer"
}
```

---

## Get All Jobs

**GET**

```
/jobs
```

Supports

```
?page=1

?limit=10

?keyword=node

?location=Delhi

?jobType=fullTime
```

---

## Get Job By ID

**GET**

```
/jobs/:id
```

---

## Update Job

**PUT**

```
/jobs/:id
```

Authorization

```
Bearer Recruiter Token
```

---

## Delete Job

**DELETE**

```
/jobs/:id
```

Authorization

```
Bearer Recruiter Token
```

---

# Application APIs

## Apply Job

**POST**

```
/applications
```

Authorization

```
Bearer Student Token
```

Example

```json
{
  "jobId": "job_id"
}
```

---

## My Applications

**GET**

```
/applications/my
```

Authorization

```
Bearer Student Token
```

---

## Recruiter Applications

**GET**

```
/applications/job/:jobId
```

Authorization

```
Bearer Recruiter Token
```

---

## Update Application Status

**PATCH**

```
/applications/:id/status
```

Authorization

```
Bearer Recruiter Token
```

Example

```json
{
  "status": "accepted"
}
```

Possible values

```
pending

accepted

rejected
```

---

# Dashboard API

## Recruiter Dashboard

**GET**

```
/jobs/dashboard
```

Authorization

```
Bearer Recruiter Token
```

Returns

```json
{
  "totalJobs": 5,
  "totalApplications": 34,
  "pending": 12,
  "accepted": 15,
  "rejected": 7
}
```

---

# Authentication Flow

```
Register

↓

Login

↓

Receive JWT

↓

Store Token

↓

Send Token

Authorization:
Bearer <token>
```

---

# Resume Upload Flow

```
Student

↓

Upload PDF

↓

Multer

↓

Cloudinary

↓

MongoDB stores

URL + Public ID
```

---

# Roles

## Student

- Apply Jobs
- Upload Resume
- View Applications
- View Jobs

---

## Recruiter

- Create Jobs
- Update Jobs
- Delete Jobs
- View Applicants
- Update Application Status
- Dashboard

---

# Status Values

Applications

```
pending

accepted

rejected
```

Jobs

```
fullTime

partTime

internship

remote
```

---

# Future Improvements

- Email Verification
- Forgot Password
- Refresh Tokens
- Saved Jobs
- Notifications
- Company Profiles
- Admin Panel
- Docker Support
- Unit Testing
- CI/CD Pipeline

---

# Author

**Shivam Kumar**

Built as a Full Stack Job Portal Backend using Node.js, Express, MongoDB and TypeScript.