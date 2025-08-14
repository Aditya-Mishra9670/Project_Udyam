## Project Deployed Live Link

[https://project-udyam.vercel.app/](https://project-udyam.vercel.app/)

## Scraper Utility

The project includes a scraper script (`scrapeTarget.js`) used to extract the latest form field schema from the official Udyam registration website. This ensures your frontend and backend always use up-to-date field names and options.

### Purpose
- Scrapes the Udyam registration page for all input/select fields and their attributes.
- Outputs a JSON schema (`udyam_form_fields.json`) used by the backend and frontend for dynamic form rendering.

### How to Use
1. Make sure you have Node.js installed.
2. In the project root, run:
	```bash
	node scrapeTarget.js
	```
3. The script will fetch the target page, parse the form, and overwrite `udyam_form_fields.json` with the latest schema.
4. Restart your backend server to use the updated schema.

### Notes
- The scraper is intended for development/maintenance. You do not need to run it unless the Udyam form changes.
- Review the generated JSON before deploying to production.

# Project Udyam

## Overview

Project Udyam is a full-stack web application for Udyam registration, featuring a dynamic, schema-driven multi-step form (Aadhaar, OTP, PAN & Details) with backend validation and database persistence. The project is split into two main folders:

- `udyam_frontend/` — React + Vite frontend
- `udyam_backend/` — Node.js + Express + Prisma backend

---

## Features

- Dynamic multi-step registration form (Aadhaar, OTP, PAN, Details)
- Schema-driven fields (fetched from backend)
- User-friendly field labels
- Real-time validation (Aadhaar, PAN, required fields)
- PIN autofill for city/state
- PAN Declaration checkbox (highlighted)
- Success popup and form reset on submit
- Data saved to database after backend validation
- Modular, production-ready codebase

---

## Folder Structure

```
Project_Udyam/
  udyam_backend/    # Backend API and DB
  udyam_frontend/   # Frontend React app
  udyam_form_fields.json # Form schema (used by backend)
```

---

## Backend (`udyam_backend/`)

### Tech Stack
- Node.js, Express
- Prisma ORM (PostgreSQL)
- Validation logic in `src/validation.js`

### Key Endpoints

#### 1. `GET /api/formfields`
- Returns the form schema as JSON (from `udyam_form_fields.json`).
- Used by frontend to render dynamic fields.

#### 2. `POST /api/submit`
- Accepts form data (JSON) from frontend.
- Validates Aadhaar, PAN, required fields.
- On success: saves to database and returns `{ status: 'success', data: ... }`.
- On error: returns `{ status: 'error', message: ... }`.

### How to Run Backend
```bash
cd udyam_backend
npm install
# Set up your .env (see .env.example)
npx prisma generate
npx prisma migrate dev # or migrate deploy for production
npm start
# Server runs on http://localhost:5000
```

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — (optional) server port

### Testing Backend
```bash
cd udyam_backend
npm test
# Runs tests in src/tests/submit.test.js
```

---

## Frontend (`udyam_frontend/`)

### Tech Stack
- React (Vite)
- Tailwind CSS

### How It Works
- On load, fetches form schema from backend (`/api/formfields`).
- Renders multi-step form (Aadhaar, OTP, PAN, Details) using schema.
- Validates input in real-time.
- On submit, sends data to backend (`/api/submit`).
- Shows success popup and resets form on success.

### How to Run Frontend
```bash
cd udyam_frontend
npm install
npm run dev
# App runs on http://localhost:5173 (default Vite port)
```

### Environment Variables
- `VITE_API_URL` — (optional) backend API base URL (default: http://localhost:5000)

### Build for Production
```bash
cd udyam_frontend
npm run build
# Output in dist/
```

---
## Using Docker

Project Udyam can be run entirely using Docker Compose. All dependencies and setups are included in the Dockerfiles.

### Commands

```bash
# Build the Docker images for backend and frontend
docker-compose build

# Start both backend and frontend containers
docker-compose up

# Stop and remove the containers
docker-compose down
```

## Full Flow Tutorial

1. **Start Backend:**
	- Configure `.env` in `udyam_backend/` with your database URL.
	- Run migrations and start the server.
2. **Start Frontend:**
	- Optionally set `VITE_API_URL` in `udyam_frontend/.env` if backend is not on localhost:5000.
	- Start the dev server.
3. **Open the app:**
	- Go to the frontend URL in your browser.
	- Fill out the form step by step (Aadhaar, OTP, PAN, Details).
	- On submit, data is validated and saved to the database.
	- Success popup appears and form resets.

---

## Testing

### Backend
- Run `npm test` in `udyam_backend/` to execute backend tests (see `src/tests/submit.test.js`).

### Frontend
- You can add tests using your preferred React testing library (not included by default).

---

## Deployment Notes

- Set all environment variables in your deployment platform (do not commit secrets).
- Use production database for backend.
- Set CORS in backend to allow only your frontend domain in production.
- Set `VITE_API_URL` in frontend deployment to point to your backend API.

---

## Authors & Credits

- Developed by Aditya Mishra 
- Assignment for Openbiz

---

## License

This project is for educational/demo purposes. See LICENSE if present.
