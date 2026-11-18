# ADR-003: Direct SQL Data Access with Dapper & DbUp Migration Engine

## Status
**Accepted**

## Context
Educational and telemetry workloads require rapid inserts, multi-table joins for quiz validation, and atomic updates to student streaks and accuracy metrics. Heavy Object-Relational Mappers (such as EF Core) frequently introduce query overhead, N+1 query pitfalls, complex migration snapshots, and abstract away SQL execution plans.

## Decision
We adopted **Dapper** as the micro-ORM combined with **DbUp** as the database migration engine:

1. **Explicit, Parameterized SQL**: Every query in `SqlStudentRepository`, `SqlLessonRepository`, `SqlMisconceptionRepository`, and `SqlAnalyticsRepository` uses explicit raw SQL with parameterization (`@Email`, `@LessonId`) to prevent SQL injection and maximize plan cache reusability.
2. **DbUp Idempotent Scripts**: Database migrations are version-controlled `.sql` files embedded in `LearnJava.Database.dll` and journaled into `dbo.SchemaVersions`.
3. **Advanced Dapper Multi-Querying & Multi-Mapping**:
   - `QueryMultipleAsync`: Retrieves lesson base details and content variants in a single round-trip database operation.
   - Dynamic 1-to-Many Aggregation: Maps nested questions and options using `splitOn: "Id"` and dictionary lookups.
4. **UUIDv7 Primary Keys**:
   Entities inherit from `BaseEntity` which assigns `Guid.CreateVersion7()`. Unlike traditional random UUIDv4 (which causes severe B-Tree index page splitting and fragmentation), UUIDv7 embeds a 48-bit Unix millisecond timestamp at the head of the GUID, ensuring monotonic sequential ordering in SQL Server clustered primary key indexes.

## Consequences

### Benefits
- **Sub-Millisecond Query Execution**: Near zero-allocation mapping with direct ADO.NET execution speeds.
- **Index Locality & Performance**: UUIDv7 maintains sequential disk insertion without requiring SQL Server identity sequences.
- **Transparent Schema Evolution**: Team members and reviewers can inspect plain SQL scripts directly without interpreting ORM migration metadata.

### Trade-offs
- Manual mapping of SQL result sets to domain entities and records.
- Schema changes require authoring raw SQL DDL migration files.
