# QuantumCart Product Service

Product and category management microservice for the QuantumCart e-commerce platform.

The service provides REST APIs for managing products and categories, with MySQL persistence, cursor-based product pagination, Swagger API documentation, database migrations, validation, integration tests, and Docker support.

---

## Features

- Product CRUD operations
- Category CRUD operations
- Product filtering by:
  - Category
  - Search
- Price range validation
- Cursor-based product pagination
- Product-category relationship management
- Request validation
- Centralized error handling
- MySQL database integration
- Versioned database migrations
- Migration checksum validation
- Migration execution locking
- Dockerized application and MySQL
- Health check endpoint
- Graceful application shutdown
- Swagger/OpenAPI documentation
- Unit and integration tests
- Jest code coverage

---

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MySQL 8.4
- mysql2
- Jest
- Supertest
- Swagger / OpenAPI
- Docker
- Docker Compose

---

## Project Structure

```text
product-service/
├── migrations/
│   ├── 001_create_categories.sql
│   ├── 002_create_products.sql
│   ├── 003_create_product_categories.sql
│   ├── 004_add_categories_status_name_index.sql
│   └── 005_add_product_price_check.sql
│
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── swagger.ts
│   │
│   ├── controllers/
│   ├── dtos/
│   ├── middlewares/
│   ├── queries/
│   ├── repositories/
│   ├── routes/
│   ├── scripts/
│   │   ├── migrate.ts
│   │   └── seed.ts
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── .env.test
├── docker-compose.yml
├── Dockerfile
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Development seed data

The service ships with a small, realistic electronics catalogue for local
development. It is **opt-in**, **idempotent** and **non-destructive** — it
upserts categories and products by their unique slug/SKU and never deletes or
resets existing rows.

```bash
npm run seed
```

Run it after the database is migrated (`npm run migrate`) and reachable with the
credentials in your `.env`. It adds the Mobiles, Laptops, Audio, Accessories,
Wearables, Cameras, Gaming and Smart Home departments along with a handful of
products each. It is not invoked automatically and is not part of the container
startup.