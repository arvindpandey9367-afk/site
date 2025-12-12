"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FloatingThemeToggle() {
	const { setTheme } = useTheme()

	return (
		<div className="fixed top-20 right-4 z-50 md:top-4 md:right-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button 
						variant="outline" 
						size="icon"
						className="h-10 w-10 rounded-full border border-white/20 bg-[rgba(184,184,184,0.78)] backdrop-blur-2xl shadow-[0_30px_60px_rgba(15,15,15,0.35)] hover:bg-white/20 transition-all"
					>
						<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-white" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-white" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
