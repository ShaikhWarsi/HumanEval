import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 border-2 border-black dark:border-white bg-card px-3.5 py-1 text-base font-mono font-bold shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 md:text-sm transition-all focus:shadow-[4px_4px_0px_0px_#0A0A0A] dark:focus:shadow-[4px_4px_0px_0px_#FFFFFF]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
