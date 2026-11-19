# LearnJava

How to run the project step by step:

---

## 1. Start the Database Container

Start the SQL Server 2025 container in the background from the root directory:

```bash
docker compose up -d
```

*(Wait a few seconds for SQL Server to finish initializing before running migrations).*

---

## 2. Apply Database Migrations & Seed Data

Run the DbUp migration project to create the database schema, tables, and seed the 8-lesson Java curriculum, diagnostic questions, misconceptions, and default student account:

```bash
dotnet run --project LearnJava.Database/LearnJava.Database.csproj
```

---

## 3. Run the Backend API

Start the ASP.NET Core Web API:

```bash
dotnet run --project LearnJava.Web.API/LearnJava.Web.API.csproj
```

The API will be available at:
* `http://localhost:5180`
* OpenAPI specification: `http://localhost:5180/openapi/v1.json`

---

## 4. Run the Frontend Client

Navigate to the client directory, install dependencies, and start the development server:

```bash
cd LearnJava.Web.Client
npm install
npm run dev
```

The web application will be available at:
* `http://localhost:3000`

---

## Default Demo Account

You can log in immediately with the pre-seeded student account:
* **Email:** `user@gmail.com`
* **Password:** `user12345`
