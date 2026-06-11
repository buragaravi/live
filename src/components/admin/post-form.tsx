"use client";

import { useActionState, useState } from "react";
import { createPost, updatePost } from "@/app/admin/actions";
import { slugifyTitle } from "@/lib/post-slug";
import { Button, Card, Input, Select, Textarea } from "@/components/ui";
import type { Post } from "@prisma/client";

const CATEGORIES = [
  "General",
  "Privacy",
  "GPS & Location",
  "How-to",
  "News",
  "Safety",
];

type Props = {
  post?: Post;
  defaultAuthorName: string;
};

const initialState: {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} = {};

export function PostForm({ post, defaultAuthorName }: Props) {
  const isEdit = !!post;
  const boundUpdate = isEdit
    ? updatePost.bind(null, post.id)
    : createPost;

  const [state, formAction, pending] = useActionState(boundUpdate, initialState);
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!post);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setSlug(slugifyTitle(e.target.value));
    }
  }

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            name="title"
            label="Title"
            defaultValue={post?.title}
            required
            onChange={handleTitleChange}
            error={state.fieldErrors?.title?.[0]}
          />
          <Input
            name="slug"
            label="URL slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            required
            error={state.fieldErrors?.slug?.[0]}
          />
        </div>

        <Textarea
          name="excerpt"
          label="Excerpt"
          defaultValue={post?.excerpt}
          placeholder="Short summary for blog listing and SEO"
          required
          error={state.fieldErrors?.excerpt?.[0]}
        />

        <Textarea
          name="content"
          label="Content (Markdown)"
          defaultValue={post?.content}
          className="min-h-[320px]"
          placeholder={`## Heading

Paragraph text with **bold** and [links](https://example.com).

![Image description](https://your-image-url.jpg)

@youtube https://www.youtube.com/watch?v=VIDEO_ID

@instagram https://www.instagram.com/p/POST_ID/

@product
Title: Product name
URL: https://amazon.com/dp/XXXX?tag=your-affiliate-tag
Image: https://product-image-url.jpg
Note: Why this is useful for location safety
@end`}
          required
          error={state.fieldErrors?.content?.[0]}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Select
            name="category"
            label="Category"
            defaultValue={post?.category ?? "General"}
            error={state.fieldErrors?.category?.[0]}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <Input
            name="tags"
            label="Tags"
            defaultValue={post?.tags ?? ""}
            placeholder="privacy, gps, consent"
            error={state.fieldErrors?.tags?.[0]}
          />
          <Input
            name="coverImage"
            label="Cover image URL (optional)"
            type="url"
            defaultValue={post?.coverImage ?? ""}
            placeholder="https://..."
            error={state.fieldErrors?.coverImage?.[0]}
          />
          <Input
            name="authorName"
            label="Author name"
            defaultValue={post?.authorName ?? defaultAuthorName}
            required
            error={state.fieldErrors?.authorName?.[0]}
          />
        </div>

        <div className="border border-[var(--border-light)] bg-[#fafafa] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            SEO
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <Input
              name="metaTitle"
              label="Meta title"
              defaultValue={post?.metaTitle ?? ""}
              placeholder="Defaults to post title"
              error={state.fieldErrors?.metaTitle?.[0]}
            />
            <Input
              name="keywords"
              label="Keywords"
              defaultValue={post?.keywords ?? ""}
              placeholder="gps consent, location sharing"
              error={state.fieldErrors?.keywords?.[0]}
            />
          </div>
          <Textarea
            name="metaDescription"
            label="Meta description"
            defaultValue={post?.metaDescription ?? ""}
            className="mt-4"
            placeholder="Defaults to excerpt"
            error={state.fieldErrors?.metaDescription?.[0]}
          />
        </div>

        <Select
          name="status"
          label="Status"
          defaultValue={post?.status ?? "DRAFT"}
          error={state.fieldErrors?.status?.[0]}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </Select>

        {state.error ? (
          <p className="text-sm text-[#8b0000]">{state.error}</p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Update post" : "Create post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
