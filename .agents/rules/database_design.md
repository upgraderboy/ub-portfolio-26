# Rule: Relational-Friendly Database Design & SQL Migration Syncing

To maintain database flexibility and ease of future migration, adhere to these strict rules when modifying or expanding database collections and schemas:

## 1. Schema Design
* **Avoid Deep Nesting**: Design Firestore documents so they remain flat and map directly to relational tables.
* **Explicit Relationships**: Use explicit identifier strings as foreign keys (e.g. `service_id` inside points, `memory_id` inside images, `blog_id` inside likes/comments) rather than nested maps.
* **Data Singletons**: Store top-level configuration schemas (like `home`, `about`, `seo`) as flat singleton documents.

## 2. Syncing & Schema Tracking
* **DDL Synchronization**: Whenever a database schema property is added, modified, or deleted:
  * Update the PostgreSQL schema definition file [`schema.sql`](file:///Users/upgraderboy/Documents/Portfolio/src/components/db/schema.sql) accordingly.
  * Update the ESM migration script [`migrate-to-sql.mjs`](file:///Users/upgraderboy/Documents/Portfolio/src/components/db/migrate-to-sql.mjs) to parse and map the new properties.
* **Direct Database Inserting**: Ensure the migration runner remains capable of writing inserts directly into a live PostgreSQL connection when credentials (`PGHOST`, `PGUSER`, `PGPASSWORD`, etc.) are provided.
