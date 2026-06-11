"use client";

import { deletePost } from "@/app/admin/actions";
import { Button } from "@/components/ui";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost.bind(null, postId)}
      onSubmit={(e) => {
        if (!confirm("Delete this post permanently?")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger">
        Delete post
      </Button>
    </form>
  );
}
