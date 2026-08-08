# Database Seed

The backend uses TypeORM `synchronize: true`, so start the backend once before importing seed data.

Default seeded account password: `Password@123`

Accounts:

- `admin@bookify.test`
- `staff@bookify.test`

Seeded data includes roles, permissions, role permissions, admin/staff users, publishers, languages, 100 real authors, and 100 meaningful genres.

Docker import example:

```bash
docker exec -i bookify_mysql mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < database/seed.sql
```

With the current root `.env`, that is:

```bash
docker exec -i bookify_mysql mysql -uuser -psecret bookify_db < database/seed.sql
```

In GUI clients like DBeaver or DataGrip, run the whole file as a script, not as a single statement.

If your client only supports running one statement at a time, run the files in `database/seed-parts` in filename order.

```bash
for file in database/seed-parts/*.sql; do
  docker exec -i bookify_mysql mysql -uuser -psecret bookify_db < "$file"
done
```

## Bulk data for load / performance testing

`generate-books-seed.js` produces `seed-books-large.sql` (gitignored) with a large number of
realistic books (titles, ISBNs, prices, stock), each linked to authors, genres, and a cover.
It reuses the publishers, languages, authors, and genres already seeded by `seed.sql`.

Generate 10,000 books (default) and import:

```bash
node database/generate-books-seed.js 10000
docker exec -i bookify_mysql mysql -uuser -psecret bookify_db < database/seed-books-large.sql
```

Pass a different count as the first argument to scale up or down. The script is idempotent on
rerun only for a fresh database — ISBNs are derived from the book index, so running it twice
against the same database will collide on the unique `isbn` column. For a re-run, truncate
`book_covers`, `books_genres`, `books_authors`, and `books` first.

This data is for testing query performance and pagination — it is NOT load testing.
True load/concurrency testing needs a tool like k6 or autocannon plus multi-user scenarios
(concurrent checkout, order placement, stock contention).
