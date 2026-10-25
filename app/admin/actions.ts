"use server";
import { redirect, unstable_rethrow } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  authenticate,
  audit,
  createSession,
  destroySession,
  requireUser,
  verifyCsrf,
} from "@/lib/cms/auth";
import { query, transaction } from "@/lib/cms/db";
import { contentSchema, loginSchema } from "@/lib/cms/validation";
import { sanitizeContent } from "@/lib/cms/sanitize";
import { hashPassword, RESERVED_SLUGS, slugify } from "@/lib/cms/security";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

export type ActionState = { ok?: boolean; error?: string };
async function persistImage(file: File, userId: string) {
  if (!file.size) return null;
  if (file.size > 8 * 1024 * 1024)
    throw new Error("Images must be 8 MB or smaller.");
  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  };
  if (!signatures[file.type])
    throw new Error("Only JPG, PNG, and WEBP are allowed.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (
    !signatures[file.type].some((sig) =>
      sig.every((byte, index) => bytes[index] === byte),
    )
  )
    throw new Error("File content does not match its image type.");
  if (
    file.type === "image/webp" &&
    String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  )
    throw new Error("Invalid WEBP file.");
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1],
    name = `${new Date().toISOString().slice(0, 10)}-${randomUUID()}.${ext}`;
  const root = path.resolve(
    /*turbopackIgnore: true*/ process.env.CMS_UPLOAD_DIR ||
      path.join(process.cwd(), "uploads"),
  );
  await mkdir(root, { recursive: true });
  const target = path.resolve(root, name);
  if (!target.startsWith(root + path.sep))
    throw new Error("Invalid upload path.");
  await writeFile(target, bytes, { flag: "wx" });
  const publicBase = (process.env.CMS_UPLOAD_PUBLIC_URL || "/media").replace(
      /\/$/,
      "",
    ),
    url = `${publicBase}/${name}`;
  const row = (
    await query<{ id: string }>(
      `INSERT INTO cms_media(storage_key,public_url,filename,mime_type,byte_size,title,alt_text,uploaded_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [
        name,
        url,
        file.name.slice(0, 250),
        file.type,
        file.size,
        file.name.slice(0, 180),
        file.name.replace(/\.[^.]+$/, "").slice(0, 300),
        userId,
      ],
    )
  )[0];
  return { id: row.id, url };
}
export async function loginAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success)
    return {
      error: "Enter a valid email and a password of at least 12 characters.",
    };
  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Login failed or temporarily rate limited." };
  await createSession(user.id);
  await audit("LOGIN", "USER", user.id);
  redirect("/admin");
}
export async function logoutAction() {
  await audit("LOGOUT", "SESSION", undefined);
  await destroySession();
  redirect("/admin/login");
}
export async function setupAdminAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const count = (
    await query<{ count: string }>(`SELECT count(*)::text count FROM cms_users`)
  )[0]?.count;
  if (count !== "0")
    return { error: "Initial setup has already been completed." };
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const name = String(formData.get("name") || "")
    .trim()
    .slice(0, 120);
  if (!parsed.success || !name)
    return {
      error:
        "Use a valid email, name, and a password of at least 12 characters.",
    };
  const hash = await hashPassword(parsed.data.password);
  const user = (
    await query<{ id: string }>(
      `INSERT INTO cms_users(email,name,password_hash,role,can_publish) VALUES($1,$2,$3,'SUPER_ADMIN',true) RETURNING id`,
      [parsed.data.email, name, hash],
    )
  )[0];
  await createSession(user.id);
  await audit("INITIAL_ADMIN_CREATED", "USER", user.id);
  redirect("/admin");
}
export async function saveContentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired. Refresh and try again." };
  const intent = String(formData.get("intent") || "draft"),
    requestedStatus = intent === "publish" ? "PUBLISHED" : "DRAFT";
  if (
    requestedStatus === "PUBLISHED" &&
    user.role === "AUTHOR" &&
    !user.can_publish
  )
    return { error: "Your role cannot publish directly." };
  const parsed = contentSchema.safeParse({
    id: formData.get("id") || undefined,
    kind: formData.get("kind"),
    title: formData.get("title"),
    slug: slugify(String(formData.get("slug") || formData.get("title") || "")),
    excerpt: formData.get("excerpt"),
    contentHtml: formData.get("contentHtml"),
    status: requestedStatus,
    publicationDate: String(formData.get("publicationDate") || "") || undefined,
    category: String(formData.get("category") || "") || undefined,
    featuredImageId: String(formData.get("featuredImageId") || "") || undefined,
    seoTitle: formData.get("seoTitle"),
    metaDescription: formData.get("metaDescription"),
    canonicalUrl: formData.get("canonicalUrl"),
    noindex: formData.get("noindex") === "on",
    includeInSitemap: true,
  });
  if (!parsed.success)
    return { error: parsed.error.issues[0]?.message || "Invalid content." };
  if (parsed.data.kind === "PAGE" && RESERVED_SLUGS.has(parsed.data.slug))
    return {
      error:
        "That page slug is protected by the application and cannot be replaced.",
    };
  try {
    const upload = formData.get("featuredImage"),
      uploaded =
        upload instanceof File && upload.size
          ? await persistImage(upload, user.id)
          : null,
      featuredImageId = uploaded?.id || parsed.data.featuredImageId || null,
      contentUpload = formData.get("contentImage"),
      contentImage =
        contentUpload instanceof File && contentUpload.size
          ? await persistImage(contentUpload, user.id)
          : null,
      clean = sanitizeContent(
        `${parsed.data.contentHtml}${contentImage ? `<p><img src="${contentImage.url}" alt="${String(contentUpload instanceof File ? contentUpload.name : "").replace(/[<>"']/g, "")}" /></p>` : ""}`,
      );
    const id = await transaction(async (client) => {
      let id = parsed.data.id;
      if (id) {
        const owner = await client.query<{ author_id: string }>(
          `SELECT author_id FROM cms_content WHERE id=$1 FOR UPDATE`,
          [id],
        );
        if (!owner.rowCount) throw new Error("Content not found.");
        if (user.role === "AUTHOR" && owner.rows[0].author_id !== user.id)
          throw new Error("You can edit only your own posts.");
        const snap = await client.query(
          `SELECT to_jsonb(c.*) snapshot FROM cms_content c WHERE id=$1`,
          [id],
        );
        await client.query(
          `INSERT INTO cms_revisions(content_id,revision_no,snapshot,created_by) SELECT $1,COALESCE(max(revision_no),0)+1,$2,$3 FROM cms_revisions WHERE content_id=$1`,
          [id, snap.rows[0].snapshot, user.id],
        );
        await client.query(
          `UPDATE cms_content SET title=$2,slug=$3,excerpt=$4,content_html=$5,content_json=$6,status=$7::content_status,seo_title=$8,meta_description=$9,canonical_url=$10,robots_noindex=$11,include_in_sitemap=$12,featured_image_id=$13,published_at=CASE WHEN $7::content_status='PUBLISHED'::content_status THEN COALESCE($14::timestamptz,published_at,now()) ELSE published_at END,updated_at=now() WHERE id=$1`,
          [
            id,
            parsed.data.title,
            parsed.data.slug,
            parsed.data.excerpt,
            clean,
            JSON.stringify({ type: "html", html: clean }),
            parsed.data.status,
            parsed.data.seoTitle,
            parsed.data.metaDescription,
            parsed.data.canonicalUrl,
            parsed.data.noindex,
            parsed.data.includeInSitemap,
            featuredImageId,
            parsed.data.publicationDate || null,
          ],
        );
      } else {
        id = (
          await client.query<{ id: string }>(
            `INSERT INTO cms_content(kind,title,slug,excerpt,content_html,content_json,status,author_id,seo_title,meta_description,canonical_url,robots_noindex,include_in_sitemap,featured_image_id,published_at) VALUES($1::content_kind,$2,$3,$4,$5,$6,$7::content_status,$8,$9,$10,$11,$12,$13,$14,CASE WHEN $7::content_status='PUBLISHED'::content_status THEN COALESCE($15::timestamptz,now()) END) RETURNING id`,
            [
              parsed.data.kind,
              parsed.data.title,
              parsed.data.slug,
              parsed.data.excerpt,
              clean,
              JSON.stringify({ type: "html", html: clean }),
              parsed.data.status,
              user.id,
              parsed.data.seoTitle,
              parsed.data.metaDescription,
              parsed.data.canonicalUrl,
              parsed.data.noindex,
              parsed.data.includeInSitemap,
              featuredImageId,
              parsed.data.publicationDate || null,
            ],
          )
        ).rows[0].id;
      }
      if (parsed.data.kind === "POST") {
        await client.query(
          `DELETE FROM cms_content_categories WHERE content_id=$1`,
          [id],
        );
        if (parsed.data.category) {
          const category = (
            await client.query<{ id: string }>(
              `INSERT INTO cms_categories(name,slug) VALUES($1,$2) ON CONFLICT(slug) DO UPDATE SET name=EXCLUDED.name RETURNING id`,
              [parsed.data.category, slugify(parsed.data.category)],
            )
          ).rows[0];
          await client.query(
            `INSERT INTO cms_content_categories(content_id,category_id) VALUES($1,$2)`,
            [id, category.id],
          );
        }
      }
      return id;
    });
    await audit(
      intent === "unpublish" ? "CONTENT_UNPUBLISHED" : "CONTENT_SAVED",
      parsed.data.kind,
      id,
      { status: parsed.data.status },
    );
    revalidatePath(
      parsed.data.kind === "POST"
        ? `/blog/${parsed.data.slug}`
        : `/${parsed.data.slug}`,
    );
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    redirect(
      `/admin/${parsed.data.kind === "POST" ? "posts" : "pages"}/${id}?saved=1`,
    );
  } catch (error) {
    unstable_rethrow(error);
    console.error("CMS content save failed", error);
    const message = error instanceof Error ? error.message : "";
    if (/duplicate key|unique constraint/i.test(message))
      return {
        error: "That URL slug is already in use. Choose a different slug.",
      };
    if (
      [
        "Content not found.",
        "You can edit only your own posts.",
        "Images must be 8 MB or smaller.",
        "Only JPG, PNG, and WEBP are allowed.",
        "File content does not match its image type.",
        "Invalid WEBP file.",
        "Invalid upload path.",
      ].includes(message)
    )
      return { error: message };
    return {
      error: "Unable to save this content. Check the fields and try again.",
    };
  }
}
export async function changePasswordAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired." };
  const password = String(formData.get("password") || "");
  if (password.length < 12) return { error: "Use at least 12 characters." };
  await query(
    `UPDATE cms_users SET password_hash=$2,password_changed_at=now(),updated_at=now() WHERE id=$1`,
    [user.id, await hashPassword(password)],
  );
  await query(`DELETE FROM cms_sessions WHERE user_id=$1`, [user.id]);
  await audit("PASSWORD_CHANGED", "USER", user.id);
  await destroySession();
  redirect("/admin/login?changed=1");
}
export async function deleteContentAction(formData: FormData) {
  const user = await requireUser();
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    throw new Error("Security token expired.");
  const id = String(formData.get("id") || "");
  const row = (
    await query<{ kind: "POST" | "PAGE"; slug: string; author_id: string }>(
      `SELECT kind,slug,author_id FROM cms_content WHERE id=$1`,
      [id],
    )
  )[0];
  if (!row) redirect("/admin");
  if (user.role === "AUTHOR" && row.author_id !== user.id)
    throw new Error("You can delete only your own posts.");
  await query(
    `UPDATE cms_content SET status='TRASH',trashed_at=now(),updated_at=now() WHERE id=$1`,
    [id],
  );
  await audit("CONTENT_DELETED", row.kind, id);
  revalidatePath(row.kind === "POST" ? `/blog/${row.slug}` : `/${row.slug}`);
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  redirect(`/admin/${row.kind === "POST" ? "posts" : "pages"}?deleted=1`);
}
export async function saveConfigAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("EDITOR");
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired." };
  const namespace = String(formData.get("namespace") || "");
  const key = String(formData.get("key") || "");
  let value: unknown;
  try {
    value = JSON.parse(String(formData.get("value") || "{}"));
  } catch {
    return { error: "Configuration must be valid JSON." };
  }
  if (
    !["homepage", "navigation", "footer", "seo", "settings"].includes(
      namespace,
    ) ||
    !/^[a-z0-9._-]+$/.test(key)
  )
    return { error: "Invalid configuration key." };
  await query(
    `INSERT INTO cms_configs(namespace,key,value,updated_by) VALUES($1,$2,$3,$4) ON CONFLICT(namespace,key) DO UPDATE SET value=$3,updated_by=$4,updated_at=now()`,
    [namespace, key, JSON.stringify(value), user.id],
  );
  await audit("CONFIG_UPDATED", "CONFIG", `${namespace}.${key}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  return { ok: true };
}
export async function uploadMediaAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("AUTHOR");
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired." };
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size)
    return { error: "Choose an image." };
  if (file.size > 8 * 1024 * 1024)
    return { error: "Images must be 8 MB or smaller." };
  const signatures: Record<string, number[][]> = {
    "image/jpeg": [[0xff, 0xd8, 0xff]],
    "image/png": [[0x89, 0x50, 0x4e, 0x47]],
    "image/webp": [[0x52, 0x49, 0x46, 0x46]],
  };
  if (!signatures[file.type])
    return { error: "Only JPG, PNG, and WEBP are allowed." };
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!signatures[file.type].some((sig) => sig.every((b, i) => bytes[i] === b)))
    return { error: "File content does not match its image type." };
  if (
    file.type === "image/webp" &&
    String.fromCharCode(...bytes.slice(8, 12)) !== "WEBP"
  )
    return { error: "Invalid WEBP file." };
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1],
    name = `${new Date().toISOString().slice(0, 10)}-${randomUUID()}.${ext}`;
  const root = path.resolve(
    /*turbopackIgnore: true*/ process.env.CMS_UPLOAD_DIR ||
      path.join(process.cwd(), "uploads"),
  );
  await mkdir(root, { recursive: true });
  const target = path.resolve(root, name);
  if (!target.startsWith(root + path.sep))
    return { error: "Invalid upload path." };
  await writeFile(target, bytes, { flag: "wx" });
  const publicBase = (process.env.CMS_UPLOAD_PUBLIC_URL || "/media").replace(
    /\/$/,
    "",
  );
  const url = `${publicBase}/${name}`;
  await query(
    `INSERT INTO cms_media(storage_key,public_url,filename,mime_type,byte_size,title,alt_text,uploaded_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      name,
      url,
      file.name.slice(0, 250),
      file.type,
      file.size,
      String(formData.get("title") || "").slice(0, 180),
      String(formData.get("alt") || "").slice(0, 300),
      user.id,
    ],
  );
  await audit("MEDIA_UPLOADED", "MEDIA", name);
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function saveToolAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser("EDITOR");
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired." };
  const rawSlug = String(formData.get("slug") || "");
  const slug = rawSlug.split("/").map(slugify).filter(Boolean).join("/");
  const displayName = String(formData.get("displayName") || "")
    .trim()
    .slice(0, 180);
  if (!slug || !displayName)
    return { error: "Tool slug and title are required." };
  try {
    const imageFile = formData.get("toolImage"),
      imageAlt = String(formData.get("imageAlt") || "")
        .trim()
        .slice(0, 300);
    const uploaded =
      imageFile instanceof File && imageFile.size
        ? await persistImage(imageFile, user.id)
        : null;
    const heroImageId =
      uploaded?.id || String(formData.get("heroImageId") || "") || null;
    if (heroImageId)
      await query(
        `UPDATE cms_media SET alt_text=$2,updated_at=now() WHERE id=$1`,
        [heroImageId, imageAlt],
      );
    const clean = sanitizeContent(
      String(formData.get("contentHtml") || "").slice(0, 500_000),
    );
    await query(
      `INSERT INTO cms_tools(slug,display_name,intro,description,content_html,instructions,features,faqs,related_tools,card_description,seo_title,meta_description,featured,published,noindex,hero_image_id,hero_image_alt,updated_by) VALUES($1,$2,$3,$4,$5,'[]','[]','[]','[]',$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT(slug) DO UPDATE SET display_name=$2,intro=$3,description=$4,content_html=$5,card_description=$6,seo_title=$7,meta_description=$8,featured=$9,published=$10,noindex=$11,hero_image_id=$12,hero_image_alt=$13,updated_by=$14,updated_at=now()`,
      [
        slug,
        displayName,
        String(formData.get("intro") || "").slice(0, 1000),
        String(formData.get("intro") || "").slice(0, 5000),
        clean,
        String(formData.get("cardDescription") || "").slice(0, 300),
        String(formData.get("seoTitle") || "").slice(0, 180),
        String(formData.get("metaDescription") || "").slice(0, 320),
        formData.get("featured") === "on",
        formData.get("published") === "on",
        formData.get("noindex") === "on",
        heroImageId,
        imageAlt,
        user.id,
      ],
    );
    await audit("TOOL_CONTENT_UPDATED", "TOOL", slug);
    revalidatePath(`/${slug}`);
    revalidatePath("/tools");
    revalidatePath("/sitemap.xml");
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      [
        "Images must be 8 MB or smaller.",
        "Only JPG, PNG, and WEBP are allowed.",
        "File content does not match its image type.",
        "Invalid WEBP file.",
      ].includes(message)
    )
      return { error: message };
    return {
      error: "Unable to save this tool page. Check the fields and try again.",
    };
  }
}

export async function createUserAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser("SUPER_ADMIN");
  if (!(await verifyCsrf(String(formData.get("csrf") || ""))))
    return { error: "Security token expired." };
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") || "")
    .trim()
    .slice(0, 120);
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "AUTHOR");
  if (
    !/^\S+@\S+\.\S+$/.test(email) ||
    !name ||
    password.length < 12 ||
    !["SUPER_ADMIN", "EDITOR", "AUTHOR"].includes(role)
  )
    return {
      error:
        "Provide a valid name, email, role, and 12+ character temporary password.",
    };
  try {
    const row = (
      await query<{ id: string }>(
        `INSERT INTO cms_users(email,name,password_hash,role,can_publish) VALUES($1,$2,$3,$4,$5) RETURNING id`,
        [
          email,
          name,
          await hashPassword(password),
          role,
          formData.get("canPublish") === "on",
        ],
      )
    )[0];
    await audit("USER_CREATED", "USER", row.id, { role });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch {
    return { error: "That email is already in use or could not be saved." };
  }
}
