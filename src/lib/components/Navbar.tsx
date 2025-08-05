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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const isAdmin = useAdminCheck();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes homeFloat {
            0%, 100% { 
              transform: scale(1) rotate(0deg);
            }
            25% { 
              transform: scale(1.15) rotate(-1deg);
            }
            50% { 
              transform: scale(1.25) rotate(0deg);
            }
            75% { 
              transform: scale(1.15) rotate(1deg);
            }
          }
          
          @keyframes searchMagnify {
            0% { 
              transform: rotate(0deg) scale(1);
            }
            10% { 
              transform: rotate(-5deg) scale(1.1);
            }
            20% { 
              transform: rotate(10deg) scale(1.2);
            }
            30% { 
              transform: rotate(-8deg) scale(1.15);
            }
            40% { 
              transform: rotate(12deg) scale(1.25);
            }
            50% { 
              transform: rotate(-10deg) scale(1.3);
            }
            60% { 
              transform: rotate(8deg) scale(1.25);
            }
            70% { 
              transform: rotate(-5deg) scale(1.15);
            }
            80% { 
              transform: rotate(3deg) scale(1.1);
            }
            90% { 
              transform: rotate(-2deg) scale(1.05);
            }
            100% { 
              transform: rotate(0deg) scale(1);
            }
          }
          
          @keyframes personBreathe {
            0%, 100% { 
              transform: scale(1) translateY(0px);
              filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0));
            }
            25% { 
              transform: scale(1.05) translateY(-1px);
              filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1));
            }
            50% { 
              transform: scale(1.1) translateY(-2px);
              filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.2));
            }
            75% { 
              transform: scale(1.05) translateY(-1px);
              filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.1));
            }
          }
          
          @keyframes settingsRotate {
            0% { 
              transform: rotate(0deg) scale(1);
            }
            25% { 
              transform: rotate(90deg) scale(1.1);
            }
            50% { 
              transform: rotate(180deg) scale(1.2);
            }
            75% { 
              transform: rotate(270deg) scale(1.1);
            }
            100% { 
              transform: rotate(360deg) scale(1);
            }
          }
          
          @keyframes dropdownSlide {
            0% {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes logoGlow {
            0%, 100% {
              text-shadow: 0 0 0px rgba(59, 130, 246, 0);
            }
            50% {
              text-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
          }
          
          .navbar-scrolled {
            backdrop-filter: blur(20px);
          }
          
          .logo-hover:hover {
            animation: logoGlow 2s ease-in-out infinite;
            background: linear-gradient(45deg, #1f2937, #3b82f6, #1f2937);
            background-size: 400% 400%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite;
          }
          
          .nav-link {
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .nav-link:hover::before {
            left: 100%;
          }
          
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(45deg, #3b82f6, #6366f1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-50%);
          }
          
          .nav-link:hover::after {
            width: 100%;
          }
          
          .animate-home svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-home:hover svg {
            animation: homeFloat 2s ease-in-out infinite;
            color: #3b82f6;
          }
          
          .animate-search svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-search:hover svg {
            animation: searchMagnify 1s cubic-bezier(0.4, 0, 0.2, 1);
            color: #10b981;
          }
          
          .animate-person svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-person:hover svg {
            animation: personBreathe 1.5s ease-in-out infinite;
            color: #8b5cf6;
          }
          
          .animate-settings svg {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-settings:hover svg {
            animation: settingsRotate 1.2s cubic-bezier(0.4, 0, 0.2, 1);
            color: #f59e0b;
          }
          
          .dropdown-menu {
            animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(16px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }
          
          .dropdown-item {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .dropdown-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background: linear-gradient(45deg, #3b82f6, #6366f1);
            opacity: 0.1;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .dropdown-item:hover::before {
            width: 100%;
          }
          
          .dropdown-item:hover {
            transform: translateX(4px);
            color: #3b82f6;
          }
          
          .mobile-nav-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 50%;
            padding: 8px;
          }
          
          .mobile-nav-item:hover {
            background: rgba(59, 130, 246, 0.1);
            transform: scale(1.1);
          }
          
          .arrow-rotate {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .arrow-rotate.open {
            transform: rotate(180deg);
          }
        `
      }} />
      
      <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md px-5 sm:px-7 py-2 flex justify-between items-center transition-all duration-500 ${
        scrolled ? 'navbar-scrolled' : ''
      }`}>
        {/* Logo */}
        <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-gray-900 tracking-[-0.05em] logo-hover cursor-pointer">
          internyl
        </h1>

        {/* Navigation Links */}
        <div className="hidden sm:flex gap-6 md:gap-7 items-center text-base text-gray-800 font-medium relative">
          <Link href="/" className="nav-link hover:text-blue-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-home">
            <HomeOutlinedIcon />
            home
          </Link>

          <Link href="/pages/internships" className="nav-link hover:text-emerald-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-search">
            <SearchOutlinedIcon />
            internships
          </Link>

          {isAdmin && (
            <Link href="/admin" className="nav-link hover:text-amber-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-settings">
              <SettingsOutlinedIcon />
              admin dashboard
            </Link>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="nav-link flex items-center gap-2 hover:text-purple-600 transition focus:outline-none cursor-pointer px-3 py-2 rounded-lg animate-person"
            >
              <PersonOutlineOutlinedIcon />
              account
              <KeyboardArrowDownIcon className={`arrow-rotate ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu absolute right-0 top-full mt-3 w-44 rounded-2xl py-2 z-50">
                {user ? (
                  <>
                    <Link
                      href="/pages/account"
                      className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer"
                    >
                      User Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer"
                    >
                      Logout
                    </button> 
                  </>
                ) : (
                  <>
                    <Link
                      href="/pages/signup"
                      className="dropdown-item block px-4 py-3 text-sm text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/pages/login"
                      className="dropdown-item block px-4 py-3 text-sm text-gray-700"
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

        {/* Mobile Menu */}
        <div className="sm:hidden flex items-center gap-3">
          <Link href="/" className="mobile-nav-item hover:text-blue-600 transition animate-home">
            <HomeOutlinedIcon />
          </Link>
          <Link href="/pages/internships" className="mobile-nav-item hover:text-emerald-600 transition animate-search">
            <SearchOutlinedIcon />
          </Link>
          {isAdmin && (
            <Link href="/admin" className="mobile-nav-item hover:text-amber-600 transition animate-settings">
              <SettingsOutlinedIcon />
            </Link>
          )}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="mobile-nav-item text-gray-800 hover:text-purple-600 transition focus:outline-none animate-person"
          >
            <PersonOutlineOutlinedIcon />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu absolute right-4 top-16 w-44 rounded-2xl py-2 z-50">
              {user ? (
                <>
                  <Link
                    href="/pages/account"
                    className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer"
                  >
                    User Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer"
                  >
                    Logout
                  </button> 
                </>
              ) : (
                <>
                  <Link
                    href="/pages/signup"
                    className="dropdown-item block px-4 py-3 text-sm text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/pages/login"
                    className="dropdown-item block px-4 py-3 text-sm text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}