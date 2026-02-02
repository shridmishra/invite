"use client"

import * as React from "react"
import { Search, Bell, Menu, User } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function AppNavbar() {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1">
                    <form className="hidden md:flex relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search templates..."
                            className="w-full bg-slate-50 pl-8 md:w-[200px] lg:w-[300px]"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2">
                    {session ? (
                        <>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-pink-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="h-5 w-5 rounded-full" />
                                ) : (
                                    <User size={20} />
                                )}
                            </Button>
                            <Button
                                className="hidden sm:flex bg-pink-600 hover:bg-pink-700 text-white border-none"
                                onClick={() => router.push("/valentine/create")}
                            >
                                Create Invite
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
