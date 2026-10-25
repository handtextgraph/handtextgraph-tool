# HandTextGraph production launch checklist

## Domain and brand

- Confirm legal/operational approval for the HandTextGraph name.
- Domain ownership for `handtextgraph.com` was confirmed by the owner on October 25, 2026; verify registrar access, DNS records, and HTTPS before launch.
- Configure `NEXT_PUBLIC_SITE_URL` as the exact HTTPS origin with no path or trailing slash.
- Never configure `handwritingtool.com`; the application rejects that former domain.
- Confirm the same origin appears in page canonicals, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml` on the release candidate.

## Deployment configuration

- Use Node.js 20 or newer and run `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Scope production and preview environment variables separately. `NEXT_PUBLIC_SITE_URL` is public configuration, not a secret.
- Provide existing CMS/database variables only if the deployment includes the protected admin/CMS features. Do not reuse production credentials in preview.
- Ensure persistent upload and backup directories are available if CMS media and backup functions are enabled.
- Verify HTTPS, automatic certificate renewal, compression, and HTTP/2 or HTTP/3 at the deployment edge.

## Search and measurement

- Submit the final HTTPS sitemap URL to Google Search Console only after the canonical host is confirmed.
- Inspect the homepage, representative tools, templates, and articles with URL Inspection before requesting broad indexing.
- Confirm PDF download endpoints and arbitrary query-string configurations are absent from the editorial sitemap.
- Verify Google Analytics consent mode, Cookie Settings, and AdSense behavior in production without changing their identifiers.
- Add runtime error monitoring and an uptime check for `/`, `/tools`, `/templates`, `/blog`, and `/sitemap.xml`.

## Release and rollback

- Keep the last known-good deployment available for instant rollback.
- Record the release commit, environment-variable snapshot, database backup status, and smoke-test results.
- Test a preview deployment first, then promote the exact verified artifact.
- Do not create redirects from the former domain unless ownership and redirect authority are independently confirmed.
