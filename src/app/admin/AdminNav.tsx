"use client";

import Link from "next/link";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";

import DashboardIcon from "@mui/icons-material/Dashboard";
import UserIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

export default function AdminNav() {
    // check if admin
    const isAdmin = useAdminCheck();

    if (!isAdmin) return null; // Only show for admins

    const menuItems = [
        { text: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
        { text: "Internships", href: "/admin/internships", icon: <SearchIcon /> },
        { text: "Admin Info", href: "/admin/users", icon: <UserIcon /> },
        // { text: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
    ];

    return (
        <nav className="backdrop-blur-md flex text-center items-center justify-center mb-4">
            {menuItems.map((item) => (
                <Link
                    key={item.text}
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-800 font-medium nav-link hover:text-blue-600 transition"
                >
                    {item.icon}
                    <span>{item.text}</span>
                </Link>
            ))}
        </nav>
    );
}
