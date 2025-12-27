import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
