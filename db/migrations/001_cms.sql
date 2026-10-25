BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TYPE cms_role AS ENUM ('SUPER_ADMIN','EDITOR','AUTHOR');
CREATE TYPE content_status AS ENUM ('DRAFT','SCHEDULED','PUBLISHED','TRASH');
CREATE TYPE content_kind AS ENUM ('POST','PAGE');

CREATE TABLE cms_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text NOT NULL UNIQUE, name text NOT NULL,
  password_hash text NOT NULL, role cms_role NOT NULL DEFAULT 'AUTHOR', can_publish boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true, password_changed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cms_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE, csrf_secret text NOT NULL, expires_at timestamptz NOT NULL,
  ip_hash text, user_agent text, created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cms_sessions_user_expires_idx ON cms_sessions(user_id, expires_at);
CREATE TABLE cms_login_attempts (key_hash text PRIMARY KEY, attempts int NOT NULL DEFAULT 0, blocked_until timestamptz, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_password_resets (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE, token_hash text NOT NULL UNIQUE, expires_at timestamptz NOT NULL, used_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE cms_categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, description text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_tags (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind content_kind NOT NULL, title text NOT NULL, slug text NOT NULL,
  excerpt text NOT NULL DEFAULT '', content_json jsonb NOT NULL DEFAULT '{"type":"doc","content":[]}', content_html text NOT NULL DEFAULT '',
  status content_status NOT NULL DEFAULT 'DRAFT', author_id uuid NOT NULL REFERENCES cms_users(id), featured_image_id uuid,
  published_at timestamptz, scheduled_at timestamptz, trashed_at timestamptz,
  seo_title text NOT NULL DEFAULT '', meta_description text NOT NULL DEFAULT '', canonical_url text NOT NULL DEFAULT '',
  robots_noindex boolean NOT NULL DEFAULT false, og_title text NOT NULL DEFAULT '', og_description text NOT NULL DEFAULT '', og_image_id uuid,
  include_in_sitemap boolean NOT NULL DEFAULT true, show_breadcrumbs boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(kind, slug)
);
CREATE INDEX cms_content_public_idx ON cms_content(kind,status,published_at DESC);
CREATE INDEX cms_content_author_idx ON cms_content(author_id,updated_at DESC);
CREATE TABLE cms_content_categories (content_id uuid REFERENCES cms_content(id) ON DELETE CASCADE, category_id uuid REFERENCES cms_categories(id) ON DELETE CASCADE, PRIMARY KEY(content_id,category_id));
CREATE TABLE cms_content_tags (content_id uuid REFERENCES cms_content(id) ON DELETE CASCADE, tag_id uuid REFERENCES cms_tags(id) ON DELETE CASCADE, PRIMARY KEY(content_id,tag_id));
CREATE TABLE cms_revisions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), content_id uuid NOT NULL REFERENCES cms_content(id) ON DELETE CASCADE, revision_no int NOT NULL, snapshot jsonb NOT NULL, created_by uuid REFERENCES cms_users(id), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(content_id,revision_no));

CREATE TABLE cms_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), storage_key text NOT NULL UNIQUE, public_url text NOT NULL UNIQUE,
  filename text NOT NULL, mime_type text NOT NULL, byte_size bigint NOT NULL, width int, height int,
  title text NOT NULL DEFAULT '', alt_text text NOT NULL DEFAULT '', uploaded_by uuid REFERENCES cms_users(id),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE cms_content ADD CONSTRAINT cms_content_featured_image_fk FOREIGN KEY(featured_image_id) REFERENCES cms_media(id) ON DELETE SET NULL;
ALTER TABLE cms_content ADD CONSTRAINT cms_content_og_image_fk FOREIGN KEY(og_image_id) REFERENCES cms_media(id) ON DELETE SET NULL;

CREATE TABLE cms_menus (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), location text NOT NULL UNIQUE, label text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_menu_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), menu_id uuid NOT NULL REFERENCES cms_menus(id) ON DELETE CASCADE, parent_id uuid REFERENCES cms_menu_items(id) ON DELETE CASCADE, label text NOT NULL, url text NOT NULL, position int NOT NULL DEFAULT 0, enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX cms_menu_items_order_idx ON cms_menu_items(menu_id,parent_id,position);
CREATE TABLE cms_configs (namespace text NOT NULL, key text NOT NULL, value jsonb NOT NULL, draft_value jsonb, updated_by uuid REFERENCES cms_users(id), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(namespace,key));
CREATE TABLE cms_tools (slug text PRIMARY KEY, display_name text NOT NULL, intro text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', instructions jsonb NOT NULL DEFAULT '[]', features jsonb NOT NULL DEFAULT '[]', faqs jsonb NOT NULL DEFAULT '[]', related_tools jsonb NOT NULL DEFAULT '[]', card_description text NOT NULL DEFAULT '', seo_title text NOT NULL DEFAULT '', meta_description text NOT NULL DEFAULT '', featured boolean NOT NULL DEFAULT false, published boolean NOT NULL DEFAULT true, noindex boolean NOT NULL DEFAULT false, updated_by uuid REFERENCES cms_users(id), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_redirects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source_path text NOT NULL UNIQUE, destination_path text NOT NULL, status_code int NOT NULL DEFAULT 301 CHECK(status_code IN (301,302,307,308)), enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE cms_audit_logs (id bigserial PRIMARY KEY, actor_id uuid REFERENCES cms_users(id) ON DELETE SET NULL, action text NOT NULL, entity_type text NOT NULL, entity_id text, metadata jsonb NOT NULL DEFAULT '{}', ip_hash text, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX cms_audit_recent_idx ON cms_audit_logs(created_at DESC);
CREATE TABLE cms_imports (source_key text PRIMARY KEY, checksum text NOT NULL, entity_id uuid REFERENCES cms_content(id), imported_at timestamptz NOT NULL DEFAULT now());

INSERT INTO cms_menus(location,label) VALUES ('header','Primary navigation'),('footer','Footer navigation') ON CONFLICT DO NOTHING;
COMMIT;
