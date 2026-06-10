"use client";

import { useActionState } from "react";
import { verifyResultsAccess } from "@/app/actions/links";
import { Button, Card, Input } from "@/components/ui";

const initialState: { error?: string } = {};

export function AccessCodeForm() {
  const [state, formAction, pending] = useActionState(
    verifyResultsAccess,
    initialState
  );

  return (
    <Card className="mx-auto max-w-md p-6">
      <form action={formAction} className="space-y-4">
        <Input
          name="accessCode"
          label="Access code"
          placeholder="XXXX-XXXX-XXXX"
          required
          autoComplete="off"
          className="uppercase"
          error={state.error}
        />
        <p className="text-xs text-[var(--text-muted)]">
          Enter the private code shown when you created your link. Results are
          never visible without it.
        </p>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Verifying…" : "View results"}
        </Button>
      </form>
    </Card>
  );
}
