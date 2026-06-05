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
