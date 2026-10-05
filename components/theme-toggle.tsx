"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-2 border-black dark:border-white bg-card text-foreground shadow-[2px_2px_0px_0px_#0A0A0A] dark:shadow-[2px_2px_0px_0px_#FFFFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_#0A0A0A] dark:shadow-[4px_4px_0px_0px_#FFFFFF] rounded-none p-1 font-mono text-xs uppercase"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer font-bold px-3 py-2 hover:bg-amber-400 dark:hover:bg-cyan-400 hover:text-black rounded-none"
        >
          <Sun className="mr-2 h-3.5 w-3.5" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer font-bold px-3 py-2 hover:bg-amber-400 dark:hover:bg-cyan-400 hover:text-black rounded-none"
        >
          <Moon className="mr-2 h-3.5 w-3.5" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer font-bold px-3 py-2 hover:bg-amber-400 dark:hover:bg-cyan-400 hover:text-black rounded-none"
        >
          <Monitor className="mr-2 h-3.5 w-3.5" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
