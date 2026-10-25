BEGIN;
ALTER TABLE cms_tools ADD COLUMN IF NOT EXISTS content_html text NOT NULL DEFAULT '';
ALTER TABLE cms_tools ADD COLUMN IF NOT EXISTS hero_image_id uuid;
ALTER TABLE cms_tools ADD COLUMN IF NOT EXISTS hero_image_alt text NOT NULL DEFAULT '';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='cms_tools_hero_image_fk') THEN
    ALTER TABLE cms_tools ADD CONSTRAINT cms_tools_hero_image_fk FOREIGN KEY(hero_image_id) REFERENCES cms_media(id) ON DELETE SET NULL;
  END IF;
END $$;
COMMIT;
