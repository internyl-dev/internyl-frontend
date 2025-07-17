"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/config/context/AuthContext";
import { auth } from "@/lib/config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Navbar() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    setDropdownOpen(false);
  };

  // Check admin status
  const isAdmin = useAdminCheck();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-[1.75rem] font-bold text-gray-900 tracking-[-0.05em]">internyl</h1>

      {/* Navigation Links */}
      <div className="flex gap-8 items-center text-sm text-gray-800 font-light relative">
        <Link href="/" className="hover:text-black transition flex items-end gap-1.5">
          <HomeOutlinedIcon />
          home
        </Link>

        <Link href="/pages/internships" className="hover:text-black transition flex items-end gap-1.5">
          <SearchOutlinedIcon />
          internships
        </Link>

        {/* Only show admin link if admin check is done AND user is admin */}
        {isAdmin && (
          <Link href="/admin" className="hover:text-black transition flex items-end gap-1.5">
            <SettingsOutlinedIcon />
            admin settings
          </Link>
        )}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-end gap-1 hover:text-black transition focus:outline-none cursor-pointer"
          >
            <PersonOutlineOutlinedIcon />
            account
            <KeyboardArrowDownIcon className="ml-1" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 cursor-pointer">
              {user ? (
                <>
                  <Link
                    href="/pages/account"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    User Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button> 
                </>
              ) : (
                <>
                  <Link
                    href="/pages/signup"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/pages/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
