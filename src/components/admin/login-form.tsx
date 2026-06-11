"use client";

import { useActionState } from "react";
import { adminLogin } from "@/app/admin/actions";
import { Button, Card, Input } from "@/components/ui";

const initialState = { error: undefined as string | undefined };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <Card className="mx-auto max-w-md p-6">
      <form action={formAction} className="space-y-4">
        <Input
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          label="Password"
          type="password"
          required
          autoComplete="current-password"
        />
        {state.error ? (
          <p className="text-sm text-[#8b0000]">{state.error}</p>
        ) : null}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
