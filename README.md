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
## 📁 Architecture Guide for Developers

The project uses a two-part architecture: **Server (Node.js/CommonJS)** for security and data, and **Client (Browser/ES Modules)** for the UI.

### I. Server Components (Secure Data Access & Routing)

| File | Role | New Functionality Goes Here |
| :--- | :--- | :--- |
| `server.js` | **App Entry Point** | Configuration and mounting new top-level routes. |
| `server/database.js` | **DB Client** | **No changes** (initializes Supabase connection). |
| `server/dataOperations.js` | **Data Repository** | New **DB query functions** (`deleteAnimal`, `updateAnimal`, etc.). |
| `server/auth.js` | **Auth Router** | New **Endpoints** for login/logout/user management. |
| `server/routes.js` | **Page Router** | New **Routes** for serving general HTML pages. |
| `server/animalEdits.js` | **Admin API** | New **Admin API Endpoints** for creating, editing, or deleting animal records. |
| `server/animalData.js` | **Public API** | New **GET API Endpoints** for fetching public, read-only animal lists. |

---

### II. Public Components (Client-Side Interface & Logic)

These files use the **ES Module** system (`import`/`export`) and communicate with the server via the **Fetch API**.

| File | Role | New Functionality Goes Here |
| :--- | :--- | :--- |
| `admin/*.html` | **Admin-only access templates** | New structure/inputs for admin pages. |
| `public/*.html` | **Templates** | New structure/inputs for pages. |
| `public/styles.css` | **Styling** | All new CSS rules. |
| `public/js/utils.js` | **Utilities** | New reusable, pure helper functions. |
| `public/js/animalLoading.js` | **Adoption List Logic** | New logic for filtering, searching, or rendering the main animal list. |
| `public/js/animalDetail.js` | **Detail Page Logic** | New logic for rendering single animal details. |
| `public/js/animalEditing.js` | **Admin Form Logic** | New logic for validating or submitting admin forms (add/edit). |
