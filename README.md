# 🐾 Animal Adoptions Platform

## 🌟 Project Overview

This project is a full-stack web application designed to manage and display adoptable animal records, providing a public-facing adoption listing and a secure administrative portal.


### Key Features
* **Public Animal Catalog:** Displays a filterable and searchable list of animals available for adoption.
* **Detail Pages:** Renders individual animal profiles by fetching data from an API endpoint.
* **Admin Authentication:** Secure user login and authorization using database validation.
* **CRUD Operations:** Enables administrative users to **C**reate, **R**ead, **U**pdate, and **D**elete animal records via dedicated API routes.
* **Modular Architecture:** Uses Express.js routers and ES Modules for clean separation of concerns.

---

## 💻 Technical Stack

| Category | Technology |
| :--- | :--- |
| **Backend (Server)** | **Node.js, Express.js** |
| **Database** | **Supabase** |
| **Client-Side** | **HTML, CSS, ES Modules (JavaScript)** |

---

## 📁 Architecture & File Guide for Developers

The project uses a standard separation between the **Server (Node.js)** and the **Client (Public)** directories. New functionality should be placed according to the following guide.

### I. Server Components (Secure, Node.js Environment)

These files handle all database access, security, and routing. They use the **CommonJS** module system (`require`/`module.exports`).

| File | Role & Purpose | Where to Add New Logic |
| :--- | :--- | :--- |
| `server.js` | **Application Entry Point.** Initializes Express, loads middleware (`express.json`), and mounts all routers (`app.use`). | **Only** new middleware or mounting a new top-level router. |
| `server/database.js` | **Database Client.** Initializes the Supabase client using environment variables (`dotenv`). | **No changes** (unless switching database technology). |
| `server/data.js` | **Data Layer/Repository.** Contains reusable, plain asynchronous functions that perform direct database operations (e.g., `insertAnimal`). | **New functions** to interact with the database (e.g., `deleteAnimal(id)`, `updateAnimal(id, data)`). |
| `server/auth.js` | **Authentication Router.** Contains routes and logic specifically for user authentication. | New endpoints/logic for user registration, password reset, or session management (e.g., `router.post('/logout')`). |
| `server/routes.js` | **General Routes.** Serving all HTML pages (`.get('/adopt')`), | New routes for general page views . |
| `server/animalEdits.js` | **Admin API Router.** Contains Administrative API endpoints (e.g., `.post('/admin/addanimal')`. | New admin actions (e.g., adding or editing data) |
| `server/animalData.js` | **Public API Router.** Contains API endpoints for reading public data without authentication. | New `GET` API endpoints for fetching lists of animals, filtering, or sorting for the public view (e.g., `router.get('/animals')`). |

---

### II. Public Components (Client-Side, Browser Environment)

These files contain the front-end code (HTML, CSS, JavaScript) that runs in the user's browser. JavaScript files use the **ES Module** system (`import`/`export`) and communicate with the server via the **Fetch API**.

| File | Role & Purpose | Where to Add New Logic |
| :--- | :--- | :--- |
| `public/*.html` | **Page Templates.** Defines the structure and content of each view. | New sections, IDs, or inputs required for new client-side features. |
| `public/styles.css` | **Styling.** Contains all cascading style sheets. | New styles or updates to existing styles. |
| `public/js/utils.js` | **Utility Functions.** Contains small, reusable, pure functions (e.g., `nonEmpty`, `getImageSrc`). | **New utility functions** that are needed in multiple client-side files (e.g., input validation helpers). |
| `public/js/animalLoading.js` | **Public Listing Logic.** Responsible for fetching the list of animals, handling filtering, and rendering the tiles on `adopt.html`. | New logic for advanced filtering, searching, or pagination of the main list. |
| `public/js/animalDetail.js` | **Detail Page Logic.** Responsible for fetching data for a single animal (by ID) and rendering the full details on `animaldetail.html`. | New rendering logic for displaying additional fields or formatting complex data. |
| `public/js/animalEditing.js` | **Admin Form Logic.** Handles the submission of data from admin forms (add/edit) to the server's API endpoints. | New logic for validating form inputs before sending them to the server, or binding new form elements to the submission handler. |