"use client"

import * as React from "react"
import {
    Home,
    LayoutTemplate,
    Inbox,
    Palette,
    Settings,
    Heart,
    Calendar,
    Users,
    Sun,
    Moon,
} from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { useTheme } from "next-themes"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Templates",
        url: "#",
        icon: LayoutTemplate,
        isActive: true,
    },
    {
        title: "My Invites",
        url: "#",
        icon: Inbox,
    },
]

const secondaryItems = [
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

export function AppSidebar() {
    const { data: session } = useSession();
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-20 border-b flex items-center justify-center px-4 group-data-[state=collapsed]:px-2">
                <div className="flex flex-row items-center justify-center gap-3 group-data-[state=collapsed]:gap-0 w-full transition-all duration-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md group-data-[state=collapsed]:h-10 group-data-[state=collapsed]:w-10 transition-all shrink-0">
                        <Heart className="w-5 h-5 group-data-[state=collapsed]:w-5 group-data-[state=collapsed]:h-5 transition-all" fill="currentColor" />
                    </div>
                    <span
                        className="text-2xl tracking-wide bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent group-data-[state=collapsed]:hidden transition-all duration-300 pointer-events-none pt-1"
                        style={{ fontFamily: "'MGF Pinlock', cursive" }}
                    >
                        invitely
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title} isActive={item.isActive}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarRail />
            <SidebarFooter className="border-t p-4 group-data-[state=collapsed]:p-2">
                {session ? (
                    <div className="flex items-center gap-3 px-2 group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0">
                        {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                {session.user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex flex-col group-data-[state=collapsed]:hidden">
                            <span className="text-sm font-medium">{session.user.name || "User"}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={session.user.email}>{session.user.email}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 group-data-[state=collapsed]:gap-0">
                        <p className="text-xs text-slate-500 px-2 group-data-[state=collapsed]:hidden">Log in to save your invites</p>
                        <a href="/login" className="flex items-center justify-center h-9 rounded-md bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors group-data-[state=collapsed]:h-8 group-data-[state=collapsed]:w-8 group-data-[state=collapsed]:mx-auto group-data-[state=collapsed]:rounded-lg" title="Sign In">
                            <span className="group-data-[state=collapsed]:hidden">Sign In</span>
                            <Users className="hidden group-data-[state=collapsed]:block h-4 w-4" />
                        </a>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
