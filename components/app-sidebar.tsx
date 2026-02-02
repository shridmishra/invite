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
} from "lucide-react"
import { useSession } from "@/lib/auth-client"

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
        title: "Styles",
        url: "#",
        icon: Palette,
    },
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
            <SidebarHeader className="h-16 border-b flex items-center px-6">
                <div className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500 text-white">
                        <Heart size={18} fill="currentColor" />
                    </div>
                    <span className="text-xl tracking-tight text-pink-700 font-serif">Invitely</span>
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
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>Preferences</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton render={<a href={item.url} />} tooltip={item.title}>
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
            <SidebarFooter className="border-t p-4">
                {session ? (
                    <div className="flex items-center gap-3 px-2">
                        {session.user.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="h-8 w-8 rounded-full bg-slate-200" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                {session.user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{session.user.name || "User"}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]" title={session.user.email}>{session.user.email}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-slate-500 px-2">Log in to save your invites</p>
                        <a href="/login" className="flex items-center justify-center h-9 rounded-md bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors">
                            Sign In
                        </a>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
