# AI-Based Smart Complaint Management System

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to register complaints, which are then analyzed by an AI (OpenRouter) to categorize the priority, recommend a department, and summarize the issue.

## Features
- **Secure Authentication**: JWT-based login and signup.
- **Complaint Registration**: Users can submit complaints with descriptions and locations.
- **AI Analysis**: Uses the OpenRouter API to analyze complaint text to assign priority (High/Medium/Low), recommend departments, and summarize the text.
- **Dashboard**: View, filter by category, search by location, and update complaint status.
- **Aesthetic UI**: Modern UI using Glassmorphism with rich visual interactions.

## Prerequisites
- Node.js installed
- MongoDB URI (provided in `.env`)
- OpenRouter API Key (provided in `.env`)

## Running Locally

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm run start
   # or with nodemon: node server.js
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment on Render

### Backend Deployment
1. Go to [Render](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add the required Environment Variables from the `.env` file.

### Frontend Deployment
1. Create a new **Static Site** on Render.
2. Connect your GitHub repository.
3. Set the Root Directory to `frontend`.
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Ensure that any API calls point to your Render Backend URL instead of `localhost`. (You can set an environment variable `VITE_API_URL` and update Axios calls in the frontend accordingly).

## GitHub Repository Structure
- `/backend`: Node.js, Express, MongoDB models, Controllers.
- `/frontend`: React, Vite, Lucide React icons, Glassmorphism CSS styling.
- `README.md`: Setup and Deployment guide.
