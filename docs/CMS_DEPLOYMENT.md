# HandwritingTool self-hosted CMS deployment

The CMS runs inside the existing Next.js process and stores posts and CMS pages in PostgreSQL. The owner-facing dashboard intentionally exposes only Blog Posts, Pages, and Account Security. Uploaded images live in a persistent VPS directory, never in `.next`.

## Provision and configure

1. Create a dedicated PostgreSQL database and least-privilege application user. Keep PostgreSQL private to the VPS or private network.
2. Copy the CMS variables from `.env.example` into the process manager's protected production environment. Use an absolute, persistent `CMS_UPLOAD_DIR`; grant only the application service account read/write access.
3. Run `npm run cms:migrate` once before starting the updated application. The migration is transactional. Back up the database before every future migration.
4. Start the application, visit `/admin/setup`, and create the first Super Admin over HTTPS. Setup closes automatically once any user exists. Do not expose this URL before the database is ready.
5. The initial Super Admin can manage posts and pages immediately. Additional users can be created through the retained server-side user foundation if a future operational requirement calls for it; user administration is intentionally hidden from the simplified dashboard.
6. Run `npm run cms:import-mdx` with `CMS_IMPORT_AUTHOR_EMAIL` set to an existing admin. It copies every source MDX file to a timestamped backup and records a checksum, so unchanged files are not imported twice. Keep the original `content/blogs` directory until every public article has been reviewed.

## Reverse proxy and persistence

Continue proxying HTTPS traffic to the existing Next.js port. Forward the real client IP and host headers. Mount `CMS_UPLOAD_DIR` and PostgreSQL data outside the release directory. For multiple app instances, use shared object storage or a shared read/write media mount and use PostgreSQL as the shared source of truth.

## Backups and rollback

Install PostgreSQL client tools and schedule `npm run cms:backup` daily. Copy database dumps and the uploads directory to an encrypted off-host destination; define retention and test restores quarterly. To roll back application code, deploy the prior release without dropping CMS tables. To restore data, stop writes, restore the selected `pg_dump` custom archive into a new database, point `DATABASE_URL` at it, verify, then restart. Never run destructive restore commands against the only production database.

## Publish flow

Admin save/publish writes a revision and the current record in one transaction, records an audit event, and invalidates the affected page, blog index, and sitemap. Drafts and deleted records remain inaccessible on public routes. Authenticated previews use `/admin/preview/[id]`. No Git operation, rebuild, or deployment is required for routine publishing.
