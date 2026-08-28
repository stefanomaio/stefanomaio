"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/moderate/actions";

const initialState: LoginState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-3">
      {state.status === "error" && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-lime-500 dark:border-neutral-700"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-lime-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-lime-400 disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
