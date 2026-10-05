import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono font-bold uppercase tracking-wider border-2 border-black dark:border-white transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-amber-400 text-black shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-amber-300 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300",
        destructive:
          "bg-red-500 text-white shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-red-400",
        outline:
          "bg-card text-foreground shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-secondary",
        secondary:
          "bg-secondary text-foreground shadow-[3px_3px_0px_0px_#0A0A0A] dark:shadow-[3px_3px_0px_0px_#FFFFFF] hover:bg-secondary/80",
        ghost:
          "border-transparent shadow-none hover:border-black dark:hover:border-white hover:bg-secondary hover:shadow-[2px_2px_0px_0px_currentColor] active:shadow-none",
        link: "border-none shadow-none text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 px-3 gap-1.5 has-[>svg]:px-2.5 text-xs",
        lg: "h-11 px-6 has-[>svg]:px-4 text-sm",
        icon: "size-9 p-0 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
