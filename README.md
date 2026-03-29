# Project Management System

A modern **React + TypeScript** application bootstrapped with **Vite**.
This project includes: 
* file uploads
* project management
* global error handling
* uses **ESLint + Prettier + Husky** for code quality

---

## Tech Stack

* **React 18**
* **TypeScript**
* **Vite**
* **React Router v7.13.1**
* **Context API / useReducer** for state management
* **CSS Modules** for scoped styling
* **ESLint + Prettier + Husky** for code formatting and linting

---

## Project Features

* Create, update, and delete projects
* Upload project files with **size validation**
* Drag-and-drop file upload support
* Preview uploaded files and files to be uploaded
* Global error boundary for catching render errors
* Protected routes with user authentication
* Scoped CSS using CSS Modules
* Dev tooling:

  * ESLint + Prettier for code style
  * Husky + lint-staged for pre-commit checks

---

## Folder Structure

```
src/
|
|- components/          # Reusable components (Modal, Error, NavBar, InputText)
|- context/             # React Contexts (authentication, error handling)
|- pages/               # Route pages (Projects, ProjectFiles, Login, Error)
|- reducers/            # Reducers and state management (projectReducer)
|- routes/              # Route definitions
|- styles/              # Global or module CSS files
|- App.tsx              # Main application entry
|- main.tsx             # Vite entry point
```

---

## Setup & Run

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

---

## ESLint + Prettier + Husky

This project uses **ESLint + Prettier** to enforce code style and **Husky + lint-staged** to check code before commits.

### 1. ESLint

* Lints TypeScript + React files
* Run manually:

```bash
npm run lint
```

### 2. Prettier

* Automatically formats your code
* Run manually:

```bash
npm run format
```

### 3. Husky + lint-staged

* Pre-commit hook automatically runs **lint & format**
* Setup was done via:

```bash
npx husky install
```

* Example `package.json` lint-staged config:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

* Add new pre-commit hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## Notes

* All styles are **scoped using CSS Modules**
* Files larger than the **10 Kb** are ignored but previewed with a warning
* Global errors are handled with a **React Error Boundary** component
* Protected routes ensure authenticated access
* State is managed using **useReducer + Context API**

---

