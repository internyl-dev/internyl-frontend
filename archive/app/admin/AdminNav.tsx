"use client";

import Link from "next/link";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/config/firebaseConfig";

import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import UserIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ReportIcon from "@mui/icons-material/ReportOutlined";
import CircularProgress from "@mui/material/CircularProgress";

export default function AdminNav({ title }: { title: string }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAdmin = useAdminCheck();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  const displayName = currentUser?.displayName || "Admin";

  const welcomeMessage = [
    "Welcome, your Kingship",
    "Welcome, your Highness",
    "Welcome, your Royalty",
    "Greetings, your Majesty",
    "Hail, esteemed Monarch",
    "Welcome, illustrious Ruler",
    "Salutations, revered Crown",
    "Welcome, Royal",
    "Greetings, honored Regent",
  ];

  const getRandomPhrase = () =>
    welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];

  const menuItems = [
    { text: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
    { text: "Internships", href: "/admin/internships", icon: <SearchIcon /> },
    { text: "Reports", href: "/admin/reports", icon: <ReportIcon /> },
    { text: "Admin Info", href: "/admin/users", icon: <UserIcon /> },
  ];

  // [revent premature return until the hook is fully resolved
  if (isAdmin === null) {
    return (
      <div className="flex justify-center mt-6">
        <CircularProgress />
      </div>
    );
  }

  // only hide after confirmed false
  if (!isAdmin) return null;

  return (
    <>
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

      <section>
        <h1 className="text-center text-3xl font-bold mt-6">{title}</h1>
        <p className="text-center mt-1 font-regular text-xl text-gray-600">
          {getRandomPhrase()},{" "}
          <span className="font-bold text-blue-600">
            {displayName.split(" ")[0]}
          </span>
        </p>
      </section>
    </>
  );
}
