# LearnJava

How to run the project step by step:

---

## 1. Start the Database Container

Start the SQL Server 2025 container in the background:

```bash
docker compose up -d
```

*(Wait a few seconds for SQL Server to finish initializing before running migrations).*

---

## 2. Apply Database Migrations & Seed Data

Run the DbUp migration project to create the schema, tables, and seed the curriculum, questions, and default student:

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
* Swagger / OpenAPI documentation: `http://localhost:5180/swagger` (if enabled)

---

## 4. Run the Frontend Client

Navigate to the client directory, install dependencies, and start the development server:

```bash
cd LearnJava.Web.Client
npm install
npm run dev
```

The web application will be available at:
* `http://localhost:5173`

---

## Default Demo Account

You can log in immediately with the pre-seeded account:
* **Email:** `user@gmail.com`
* **Password:** `user12345`
