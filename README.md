# 🚀 Frontend Application

<div align="center">
  <img src="./.github/readme-assets/demo.png" alt="Application Screenshot" width="100%" style="border-radius: 8px;">
  <img src="./.github/readme-assets/demo2.png" alt="Application Screenshot" width="100%" style="border-radius: 8px;">
  <p><em>Current preview of the application interface.</em></p>
</div>

---

## 📑 Overview

This repository contains the frontend application generated using **Angular CLI version 21.2.10**. It provides a responsive, modern user interface for the application.

> ⚠️ **Important Note:** This frontend requires the **backend service** to be running locally or hosted remotely to function properly. It will not work fully out of the box without an active API connection.

---

## 🛠️ Getting Started

### Prerequisites

* **Node.js**: v20 or higher recommended
* **Angular CLI**: Version 21.2.10 (`npm install -g @angular/cli@21.2.10`)
* **Backend API**: The associated backend server up and running

### Local Setup & Environment Config

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Endpoints:**
   Ensure your API URL is correctly configured in `src/environments/environment.ts` to point to your local or remote backend:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api' // Adjust port/path to match your backend
   };
   ```

4. **Start the Backend:**
   Follow the setup instructions in the backend repository to start the API server first.

5. **Run the development server:**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
