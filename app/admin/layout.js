"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import {
    Inbox,
    Edit,
    Settings,
    Home,
    LogOut,
    Menu,
    X,
    User,
    BarChart,
    PanelLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/components/context/AuthProvider"

export default function AdminLayout({ children }) {
    // const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const { logout } = useAuth()
    

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <Home className="w-5 h-5" />
        },
        {
            name: "Inquiries",
            path: "/admin/inquiries",
            icon: <Inbox className="w-5 h-5" />
        },
        {
            name: "Blog Posts",
            path: "/admin/blog",
            icon: <Edit className="w-5 h-5" />
        },
        {
            name: "Analytics",
            path: "/admin/analytics",
            icon: <BarChart className="w-5 h-5" />
        },
        {
            name: "Settings",
            path: "/admin/settings",
            icon: <Settings className="w-5 h-5" />
        },
    ]

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 mr-2 bg-blue-500 rounded-md flex items-center justify-center">
                            <PanelLeft className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Poppy Pie Admin</h1>
                    </div>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${pathname === item.path
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Admin User</p>
                            <p className="text-xs text-gray-500">admin@poppypie.com</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        size="sm"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </Button>
                </div>
            </aside>

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 bg-black/50 bg-opacity-50 z-20 md:hidden transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            />

            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white z-30 transform transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="h-8 w-8 mr-2 bg-blue-500 rounded-md flex items-center justify-center">
                            <PanelLeft className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="text-lg font-semibold text-gray-800">Poppy Pie Admin</h1>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors ${pathname === item.path
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    onClick={toggleSidebar}
                                >
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Admin User</p>
                            <p className="text-xs text-gray-500">admin@poppypie.com</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        size="sm"
                        onClick={logout}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 h-14 flex items-center px-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="ml-auto flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}