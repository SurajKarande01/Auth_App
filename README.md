# 🔐 Auth_App — Full Stack Authentication System (React + Vite + Spring Boot)

A complete **authentication system** built using **React (Vite + JavaScript)** on the frontend and **Spring Boot** on the backend.  
Supports **JWT-based authentication** with **username/password login**, as well as **Google** and **GitHub OAuth2 login**.

---

## 🧱 Tech Stack

### 🖥️ Frontend

- React 19 (Vite)
- Tailwind CSS 4
- Axios
- React Router v7
- Zustand (State Management)
- Framer Motion (Animations)
- Radix UI Components

### ⚙️ Backend

- Spring Boot 3.5
- Spring Security 6.x
- Spring Data JPA (MySQL)
- OAuth2 Client (Google, GitHub)
- JWT Authentication (JJWT 0.13)
- Lombok + ModelMapper
- SpringDoc OpenAPI (Swagger UI)

---

## 📁 Project Structure

```
Auth_App/
│
├── auth-backend/              # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── application.yaml
│
├── auth-front/                # React + Vite Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Backend Setup (Spring Boot)

### 🧩 Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8.0+

### 🧰 Steps to Run Backend

1. Navigate to the backend folder:

   ```bash
   cd auth-backend
   ```

2. Create a new database:

   ```sql
   CREATE DATABASE auth_app_dev;
   ```

3. The `application-dev.yml` profile is pre-configured for local development:

   ```yaml
   server:
     port: 8083

   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/auth_app_dev
       username: root
       password: root
   ```

4. Set environment variables (optional — defaults are provided for dev):

   ```bash
   set JWT_SECRET=your-random-long-secret
   set GOOGLE_CLIENT_ID=your-google-client-id
   set GOOGLE_CLIENT_SECRET=your-google-client-secret
   set GITHUB_CLIENT_ID=your-github-client-id
   set GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

5. Run the Spring Boot app:
   ```bash
   mvnw spring-boot:run
   ```

📍 Backend runs on **http://localhost:8083**

---

## 💻 Frontend Setup (React + Vite)

### 🧩 Prerequisites

- Node.js 18+
- npm

### ⚙️ Steps to Run Frontend

1. Navigate to frontend directory:

   ```bash
   cd auth-front
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. The `.env` file is pre-configured:

   ```bash
   VITE_API_BASE_URL=http://localhost:8083/api/v1
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

📍 Frontend runs on **http://localhost:5173**

---

## 🔗 Authentication Flow

1. **User Login (Email/Password):**

   - User logs in via the frontend login form.
   - Spring Boot backend verifies credentials.
   - Returns JWT tokens (access + refresh).

2. **OAuth Login (Google / GitHub):**

   - Redirects to provider login page.
   - On success, backend issues JWTs.
   - React app stores tokens securely (cookie / memory).

3. **Token Refresh:**

   - When access token expires, refresh token is used silently to generate a new one.

4. **Logout:**
   - Cookies/tokens are cleared; session invalidated.

---

## 🔑 API Endpoints

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| `POST` | `/api/v1/auth/login`           | Login with email & password    |
| `POST` | `/api/v1/auth/register`        | Register a new user            |
| `GET`  | `/api/v1/auth/current-user`    | Get current logged-in user     |
| `POST` | `/api/v1/auth/refresh`         | Refresh access token           |
| `POST` | `/api/v1/auth/logout`          | Logout and clear tokens        |
| `GET`  | `/oauth2/authorization/google` | Redirect to Google login       |
| `GET`  | `/oauth2/authorization/github` | Redirect to GitHub login       |

---

## 🧠 Environment Variables Summary

| Variable               | Description              | Example                            |
| ---------------------- | ------------------------ | ---------------------------------- |
| `JWT_SECRET`           | Secret key for JWT       | `random-long-secret`               |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID   | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret      | `xxxxxx`                           |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID   | `ghp_xxxxx`                        |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret      | `ghs_xxxxx`                        |
| `VITE_API_BASE_URL`    | Backend URL for frontend | `http://localhost:8083/api/v1`     |

---

## 🧰 Common Commands

| Task            | Command                              |
| --------------- | ------------------------------------ |
| Run backend     | `mvnw spring-boot:run`               |
| Run frontend    | `npm run dev`                        |
| Build frontend  | `npm run build`                      |
| Package backend | `mvnw clean package`                 |
| Run backend JAR | `java -jar target/Auth_App-backend-0.0.1-SNAPSHOT.jar` |

---

## 🧩 Deployment Tips

- Build frontend for production:
  ```bash
  npm run build
  ```
- Copy `dist/` files to `auth-backend/src/main/resources/static` for single-server deployment.
- For separate deployment:
  - Host frontend on Netlify/Vercel.
  - Host backend on Render/AWS/DigitalOcean.
  - Update `VITE_API_BASE_URL` to production backend URL.
- Use HTTPS and set cookies with `secure` and `SameSite=Lax`.

---

## 🧑‍💻 Author

**Suraj Karande**

---

## 🪪 License

This project is licensed under the **MIT License**.
