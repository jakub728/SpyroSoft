# 🚀 Carbon Intensity Tracker – Full-Stack ( React/Vite/TypeScriupt + Express.js/TypeScript)

---

A Full-Stack web application designed to fetch, process, and visualize real-time electricity generation data in the UK. The app communicates with the official Carbon Intensity API to track the energy mix, calculate environmental impact, and render interactive charts for users to analyze data trends.

---

## 📂 Project Structure

````text
spyro-soft/
├── backend/                  # REST API (Express + TypeScript)
│   ├── src/
│   │   ├── routes/          # API route definitions
│   │   ├── types/           # Custom TS types for backend
│   │   └── server.ts           # Application entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # User Interface (React + Vite + TS)
│   ├── src/
│   │   ├── components/      # Global, reusable UI components
│   │   ├── pages/           # Page components / Views
│   │   ├── types/           # TS type declarations for frontend
│   │   ├── utils/           # Helper functions and utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                # Global Git ignore file
├── package.json              # Root package.json for managing the entire repo
└── README.md                 # This documentation

---

## 🛠️ Tech Stack & Main Packages

### Backend
* **Express** – HTTP server[cite: 1].
* **TypeScript** – Static typing[cite: 1].
* **tsx** – Tool for running `.ts` files on the fly in watch mode (`node` for TypeScript)[cite: 1].
* **Cors** & **Dotenv** – Security and environment variable configuration[cite: 1].

### Frontend
* **React + Vite** – Fast, modern development environment[cite: 1].
* **React Router Dom** – Frontend routing management[cite: 1].
* **Axios** / **React Query** – Robust API communication[cite: 1].

---

## ⚡ Quick Start (Running the App)

Everything is configured and run from the **root directory**.

### 1. Project Setup (One-Step Installation)
To install all dependencies (root, backend, frontend) and automatically generate your backend `.env` file, run the following command in the root folder:

```bash
npm run dev:install

### 2. Development Mode (Both servers simultaneously)

```bash
npm run dev
```[cite: 1]
Thanks to `concurrently`, this command will launch in parallel:
* Backend on `http://localhost:5000` (or your chosen port)[cite: 1]
* Frontend on `http://localhost:5173`[cite: 1]

---

## 📝 Useful Scripts (Root `package.json`)

* `npm run dev` – Installs dependencies in both /frontend and/backend[cite: 1].
* `npm run dev` – Runs both backend and frontend simultaneously in watch mode[cite: 1].
* `npm run dev:backend` – Runs only the Express server[cite: 1].
* `npm run dev:frontend` – Runs only the React application (Vite)[cite: 1].
* `npm run dev:backend:test` – Runs backend endpoints test[cite: 1].

---
````
