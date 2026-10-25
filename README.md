# HireHub

HireHub is a full-stack job portal where recruiters post jobs and students apply to them. Students upload a PDF resume to their profile and must have one before they can apply. Recruiters review applicants, open their resumes, and accept or reject applications.

**Live demo:** [HireHub.app](https://hire-hub-jdoj.vercel.app)

## Features

**Students**
- Register and log in
- Browse and view jobs
- Upload, replace, view and delete a PDF resume (max 5 MB)
- Apply to jobs (a resume is required)
- Track application status (pending, accepted, rejected) on a dashboard

**Recruiters**
- Post, edit and delete jobs
- View a dashboard of their jobs
- See the applicants for each job, including a link to each resume
- Accept or reject applications

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt |
| Validation | Zod |
| File uploads | Multer (memory storage) and Cloudinary |

## Project structure

```
HireHub/
├── client/                  # React frontend
│   ├── components/
│   ├── context/             # Auth context
│   ├── pages/
│   ├── routes/              # App routes and protected routes
│   ├── services/            # Axios API calls
│   └── types/
└── server/                  # Express backend
    └── src/
        ├── config/          # env, database, cloudinary
        ├── controllers/
        ├── middlewares/     # auth, role check, upload, error handler
        ├── models/          # User, Job, Application
        ├── routes/
        ├── services/        # business logic
        ├── validations/     # Zod schemas
        ├── app.ts
        └── server.ts
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A free Cloudinary account (for resume storage)

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional. Defaults to http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
```

Optionally create a `.env` file in `client/`. If you skip it, the app uses `http://localhost:5000/api`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## API overview

All routes are prefixed with `/api`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create an account |
| POST | `/auth/login` | Public | Log in and receive a token |

### Users and resume

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users/profile` | Logged in | Get the profile, including the resume |
| PUT | `/users/profile` | Logged in | Update name and email |
| POST | `/users/resume` | Logged in | Upload a PDF resume (form field name: `resume`) |
| DELETE | `/users/resume` | Logged in | Delete the resume |

### Jobs

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/jobs` | Public | List all jobs |
| GET | `/jobs/:id` | Public | Get one job |
| POST | `/jobs` | Recruiter | Create a job |
| PUT | `/jobs/:id` | Recruiter | Update a job |
| DELETE | `/jobs/:id` | Recruiter | Delete a job |
| GET | `/jobs/my` | Recruiter | Jobs posted by the logged-in recruiter |
| GET | `/jobs/dashboard` | Recruiter | Recruiter dashboard data |
| GET | `/jobs/:id/applicants` | Recruiter | Applicants for a job, with resumes |

### Applications

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/applications` | Student | Apply to a job (requires an uploaded resume) |
| GET | `/applications/my` | Student | The student's applications |
| PATCH | `/applications/:id/status` | Recruiter | Set status to `pending`, `accepted` or `rejected` |

## Frontend routes

| Path | Access |
|---|---|
| `/` | Public |
| `/login`, `/register` | Public |
| `/jobs`, `/jobs/:id` | Public |
| `/student/dashboard`, `/student/profile` | Students only |
| `/recruiter/dashboard` | Recruiters only |
| `/recruiter/jobs/:jobId/applicants` | Recruiters only |

## Resume rules

- PDF only, maximum 5 MB
- Stored on Cloudinary. The file URL is saved on the user record
- Replacing a resume removes the old file from Cloudinary
- A student cannot apply until a resume is uploaded. This is enforced in both the UI and the API

## Deployment notes

- Set every variable from the `.env` examples on your hosting platforms. The `.env` file itself is not deployed.
- Set `FRONTEND_URL` on the backend to your deployed frontend address, with no trailing slash.
- Set `VITE_API_URL` on the frontend to your deployed backend address ending in `/api`, then rebuild.
- In MongoDB Atlas, allow your backend host under Network Access.
- In Cloudinary, enable "Allow delivery of PDF and ZIP files" so recruiters can open resumes.
- On Netlify or Vercel, add a rewrite so all paths serve `index.html`, otherwise refreshing on `/jobs/123` returns a 404.

## License

This project is for learning purposes.
