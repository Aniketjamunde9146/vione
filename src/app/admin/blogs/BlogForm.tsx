"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
const BUCKET_NAME = "blog-images";

export type BlogFormValues = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  read_time: string;
  image: string;
  tags: string[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function IconUpload({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4M12 4l-4 4M12 4l4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAlert({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function bytesToLabel(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function BlogForm({
  mode,
  initialValues,
}: {
  mode: "create" | "edit";
  initialValues?: BlogFormValues;
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState(initialValues?.excerpt ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [date, setDate] = useState(
    initialValues?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [readTime, setReadTime] = useState(initialValues?.read_time ?? "");
  const [tagsInput, setTagsInput] = useState(
    initialValues?.tags?.join(", ") ?? ""
  );

  const [imageUrl, setImageUrl] = useState(initialValues?.image ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValues?.image ?? null
  );
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function validateAndSetFile(file: File | undefined | null) {
    setImageError(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("That file isn't an image. Please choose a JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(
        `That image is ${bytesToLabel(file.size)} — please choose one under 2MB.`
      );
      return;
    }

    setImageFile(file);
    setImageFileName(file.name);
    setImageFileSize(file.size);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
    // reset the input so selecting the same file again still fires onChange
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImageFileName(null);
    setImageFileSize(null);
    setImagePreview(null);
    setImageUrl("");
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImageIfNeeded(): Promise<string> {
    if (!imageFile) {
      return imageUrl;
    }

    setUploadingImage(true);
    try {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${slugify(title || "blog")}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `Image upload failed: ${uploadError.message}. Check that the "${BUCKET_NAME}" bucket exists and allows uploads.`
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

      return publicUrlData.publicUrl;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !slug.trim() || !excerpt.trim() || !category.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!imageFile && !imageUrl) {
      setFormError("Please add a cover image.");
      return;
    }

    setSubmitting(true);

    try {
      const finalImageUrl = await uploadImageIfNeeded();

      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        slug: slug.trim(),
        title: title.trim(),
        excerpt: excerpt.trim(),
        category: category.trim(),
        date,
        read_time: readTime.trim(),
        image: finalImageUrl,
        tags,
      };

      if (mode === "create") {
        const { error } = await supabase.from("blogs").insert(payload);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", initialValues?.id);
        if (error) throw new Error(error.message);
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="vione-bf-form" onSubmit={handleSubmit}>
      <div className="vione-bf-field">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="The Art of Quiet Luxury"
          required
        />
      </div>

      <div className="vione-bf-field">
        <label>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          placeholder="the-art-of-quiet-luxury"
          required
        />
        <span className="vione-bf-hint">Used in the URL: /blogs/{slug || "your-slug"}</span>
      </div>

      <div className="vione-bf-field">
        <label>Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="A short teaser shown on the blog listing…"
          rows={3}
          required
        />
      </div>

      <div className="vione-bf-row">
        <div className="vione-bf-field">
          <label>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Design Philosophy"
            required
          />
        </div>

        <div className="vione-bf-field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="vione-bf-field">
          <label>Read Time</label>
          <input
            type="text"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            placeholder="4 min read"
            required
          />
        </div>
      </div>

      <div className="vione-bf-field">
        <label>Tags</label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="quiet luxury, interior design, minimalism"
        />
        <span className="vione-bf-hint">Comma-separated</span>
      </div>

      <div className="vione-bf-field">
        <label>Cover Image</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="vione-bf-file-input"
        />

        {!imagePreview && (
          <div
            className={`vione-bf-dropzone${isDragging ? " dragging" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
          >
            <IconUpload />
            <span className="vione-bf-dropzone-title">
              Click to choose an image, or drag one here
            </span>
            <span className="vione-bf-dropzone-hint">JPG, PNG, or WEBP · max 2MB</span>
          </div>
        )}

        {imagePreview && (
          <div className="vione-bf-preview-wrap">
            <div className="vione-bf-preview">
              <Image
                src={imagePreview}
                alt="Cover preview"
                fill
                sizes="240px"
                style={{ objectFit: "cover" }}
              />
              {uploadingImage && (
                <div className="vione-bf-preview-overlay">
                  <span className="vione-bf-spinner" />
                </div>
              )}
            </div>

            <div className="vione-bf-preview-info">
              {imageFileName && (
                <span className="vione-bf-preview-filename">
                  {imageFileName}
                  {imageFileSize !== null && (
                    <span className="vione-bf-preview-size">
                      {" "}
                      · {bytesToLabel(imageFileSize)}
                    </span>
                  )}
                </span>
              )}
              {!imageFileName && (
                <span className="vione-bf-preview-filename">Current cover image</span>
              )}
              <div className="vione-bf-preview-actions">
                <button
                  type="button"
                  className="vione-bf-change-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </button>
                <button
                  type="button"
                  className="vione-bf-remove-btn"
                  onClick={handleRemoveImage}
                >
                  <IconX size={12} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {imageError && (
          <p className="vione-bf-error">
            <IconAlert />
            {imageError}
          </p>
        )}
      </div>

      {formError && (
        <p className="vione-bf-error">
          <IconAlert />
          {formError}
        </p>
      )}

      <div className="vione-bf-actions">
        <button
          type="button"
          className="vione-bf-cancel"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </button>
        <button type="submit" className="vione-bf-submit" disabled={submitting}>
          {submitting
            ? mode === "create"
              ? "Publishing…"
              : "Saving…"
            : mode === "create"
            ? "Publish Blog"
            : "Save Changes"}
        </button>
      </div>

      <style>{FORM_CSS}</style>
    </form>
  );
}

const FORM_CSS = `
.vione-bf-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  width: 100%;
}

.vione-bf-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}
.vione-bf-field label {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(201,168,118,0.75);
}
.vione-bf-field input[type="text"],
.vione-bf-field input[type="date"],
.vione-bf-field textarea {
  width: 100%;
  border-radius: 0.6rem;
  border: 1px solid rgba(201,168,118,0.2);
  background: rgba(237,231,217,0.03);
  color: #EDE7D9;
  padding: 0.7rem 0.9rem;
  font-size: 14px;
  font-family: var(--font-body, 'Manrope'), sans-serif;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.vione-bf-field input::placeholder,
.vione-bf-field textarea::placeholder { color: rgba(169,162,150,0.5); }
.vione-bf-field input:focus,
.vione-bf-field textarea:focus {
  border-color: rgba(201,168,118,0.6);
  background: rgba(237,231,217,0.05);
}
.vione-bf-field input[type="date"] {
  color-scheme: dark;
}

.vione-bf-hint {
  font-size: 11.5px;
  color: rgba(169,162,150,0.7);
}

.vione-bf-error {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  color: #E4A0A0;
  background: rgba(228,160,160,0.08);
  border: 1px solid rgba(228,160,160,0.25);
  border-radius: 0.5rem;
  padding: 0.65rem 0.9rem;
}
.vione-bf-error svg { flex-shrink: 0; }

.vione-bf-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.1rem;
}
@media (min-width: 640px) {
  .vione-bf-row { grid-template-columns: 1fr 1fr 1fr; }
}

/* File input is visually hidden — the dropzone + buttons trigger it */
.vione-bf-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.vione-bf-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem 1.25rem;
  border-radius: 0.75rem;
  border: 1.5px dashed rgba(201,168,118,0.3);
  background: rgba(237,231,217,0.02);
  color: rgba(201,168,118,0.8);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}
.vione-bf-dropzone:hover,
.vione-bf-dropzone:focus-visible {
  border-color: rgba(201,168,118,0.6);
  background: rgba(237,231,217,0.04);
  outline: none;
}
.vione-bf-dropzone.dragging {
  border-color: #E4CFA0;
  background: rgba(228,207,160,0.08);
  color: #E4CFA0;
}

.vione-bf-dropzone-title {
  font-size: 13.5px;
  color: #EDE7D9;
}

.vione-bf-dropzone-hint {
  font-size: 11.5px;
  color: rgba(169,162,150,0.7);
}

.vione-bf-preview-wrap {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.vione-bf-preview {
  position: relative;
  width: 100%;
  max-width: 200px;
  aspect-ratio: 4 / 3;
  border-radius: 0.6rem;
  overflow: hidden;
  border: 1px solid rgba(201,168,118,0.2);
  flex-shrink: 0;
}

.vione-bf-preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7,19,14,0.55);
}

.vione-bf-spinner {
  height: 20px;
  width: 20px;
  border-radius: 999px;
  border: 2px solid rgba(201,168,118,0.25);
  border-top-color: rgba(201,168,118,0.9);
  animation: vione-bf-spin 0.8s linear infinite;
}
@keyframes vione-bf-spin { to { transform: rotate(360deg); } }

.vione-bf-preview-info {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
  flex: 1;
}

.vione-bf-preview-filename {
  font-size: 12.5px;
  color: #A9A296;
  word-break: break-all;
}
.vione-bf-preview-size { color: rgba(169,162,150,0.7); }

.vione-bf-preview-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.vione-bf-change-btn {
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #EDE7D9;
  background: transparent;
  border: 1px solid rgba(201,168,118,0.25);
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-bf-change-btn:hover {
  border-color: rgba(201,168,118,0.5);
  color: #E4CFA0;
}

.vione-bf-remove-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 10.5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #E4A0A0;
  background: transparent;
  border: 1px solid rgba(228,160,160,0.25);
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-bf-remove-btn:hover {
  border-color: rgba(228,160,160,0.6);
  background: rgba(228,160,160,0.08);
}

.vione-bf-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.vione-bf-cancel {
  border: 1px solid rgba(201,168,118,0.2);
  background: transparent;
  color: #A9A296;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vione-bf-cancel:hover {
  border-color: rgba(201,168,118,0.5);
  color: #EDE7D9;
}

.vione-bf-submit {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  font-family: var(--font-heading, 'Cinzel'), serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: #07130E;
  background: linear-gradient(to bottom, #E4CFA0, #C9A876);
  padding: 0.85rem 1.75rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.vione-bf-submit:hover { transform: scale(1.02); }
.vione-bf-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
`;