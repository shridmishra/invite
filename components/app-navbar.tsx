"use client"

import * as React from "react"
import { Search, Bell, Menu, User, Github } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function AppNavbar() {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center gap-4 px-4 md:px-6">
                <SidebarTrigger className="-ml-1 [&_svg]:size-7" />
                <div className="flex-1">
                    <form className="hidden md:flex relative max-w-sm">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search templates..."
                            className="w-full bg-muted/50 pl-10 h-11 md:w-[200px] lg:w-[300px] rounded-full focus-visible:ring-pink-500 border-border text-base"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="https://github.com/shridmishra/invitely"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "hidden sm:flex items-center gap-2 border-border bg-background hover:bg-muted text-foreground transition-all rounded-full shadow-sm hover:shadow-md h-10 px-5"
                        )}
                    >
                        <Github size={20} className="text-foreground" />
                        <span className="font-medium text-base">Star on GitHub</span>
                    </a>
                    <ModeToggle />
                    {session ? (
                        <>
                          
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-10 w-10">
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="h-9 w-9 rounded-full border border-border" />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                                        <User size={20} />
                                    </div>
                                )}
                            </Button>

                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
                            <Button className="bg-pink-600 hover:bg-pink-700 text-white" onClick={() => router.push("/login")}>Get Started</Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
