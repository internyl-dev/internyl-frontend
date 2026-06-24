"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/config/context/AuthContext";
import { auth } from "@/lib/config/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Navbar() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useAdminCheck();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const insideDesktop = desktopDropdownRef.current?.contains(target) ?? false;
      const insideMobile = mobileDropdownRef.current?.contains(target) ?? false;
      if (!insideDesktop && !insideMobile) setDropdownOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDownOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    setDropdownOpen(false);
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes dropdownSlide{0%{opacity:0;transform:translateY(-10px) scale(0.95);}100%{opacity:1;transform:translateY(0) scale(1);}}
          @keyframes blueWave{0%{background-position:100% 50%;}25%{background-position:0% 50%;}75%{background-position:200% 50%;}100%{background-position:100% 50%;}}

          .logo-hover{transition:all 0.3s ease;}
          .logo-hover:hover{
            background:linear-gradient(90deg, #1e40af, #3b82f6, #60a5fa, #3b82f6, #1e40af);
            background-size:400% 100%;
            background-clip:text;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            animation:blueWave 3s ease-in-out infinite;
          }

          .nav-link{
            position:relative;
            overflow:hidden;
            transition:all .3s cubic-bezier(.4,0,.2,1);
          }
          .nav-link::after{
            content:'';
            position:absolute;
            bottom:0;
            left:50%;
            width:0;
            height:2px;
            background:linear-gradient(90deg,#9381FF,#3C66C2);
            border-radius:2px;
            transition:all .3s cubic-bezier(.4,0,.2,1);
            transform:translateX(-50%);
          }
          .nav-link:hover::after,
          .nav-link.active::after{width:80%;}
          .nav-link.active{color:#9381FF !important;font-weight:600;}
          .nav-link:hover{background:rgba(147,129,255,.08);border-radius:8px;}

          .dropdown-menu{animation:dropdownSlide .25s cubic-bezier(.4,0,.2,1);background:rgba(255,255,255,.97);backdrop-filter:blur(20px) saturate(200%);border:1px solid rgba(147,129,255,.15);box-shadow:0 20px 40px rgba(0,0,0,.12), 0 0 0 1px rgba(255,255,255,.5);}
          .dropdown-item{position:relative;transition:all .25s cubic-bezier(.4,0,.2,1);touch-action:manipulation;}
          .dropdown-item:hover{background:rgba(147,129,255,.08);color:#9381FF;padding-left:20px;}

          .mobile-nav-item{
            transition:all .3s cubic-bezier(.4,0,.2,1);
            border-radius:50%;
            padding:8px;
            position:relative;
          }
          .mobile-nav-item:hover{background:rgba(147,129,255,.12);transform:scale(1.1);}
          .mobile-nav-item.active{color:#9381FF;}
          .mobile-nav-item.active::after{
            content:'';
            position:absolute;
            bottom:2px;
            left:50%;
            transform:translateX(-50%);
            width:4px;
            height:4px;
            background:#9381FF;
            border-radius:50%;
          }

          .arrow-rotate{transition:transform .3s cubic-bezier(.4,0,.2,1);}
          .arrow-rotate.open{transform:rotate(180deg);}

          .navbar-bg{
            background:rgba(255,255,255,0.75);
            backdrop-filter:blur(16px) saturate(180%);
            border-bottom:1px solid rgba(147,129,255,.12);
            box-shadow:0 1px 20px rgba(0,0,0,.06);
          }
          .navbar-bg-scrolled{
            background:rgba(255,255,255,0.92);
            backdrop-filter:blur(24px) saturate(200%);
            border-bottom:1px solid rgba(147,129,255,.18);
            box-shadow:0 2px 24px rgba(0,0,0,.10);
          }
        `,
        }}
      />

      <nav
        className={`fixed top-0 left-0 w-full z-50 px-5 sm:px-7 py-3 flex justify-between items-center transition-all duration-300 ${
          scrolled ? "navbar-bg-scrolled" : "navbar-bg"
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-gray-900 tracking-[-0.05em] logo-hover cursor-pointer select-none">
            internyl
          </h1>
        </Link>

        {/* Desktop Nav */}
        <div
          className="hidden sm:flex gap-1 md:gap-2 items-center text-base text-gray-700 font-medium relative"
          ref={desktopDropdownRef}
        >
          <Link
            href="/"
            className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg ${isActive("/") ? "active" : "hover:text-[#9381FF]"}`}
          >
            <HomeOutlinedIcon fontSize="small" />
            home
          </Link>

          <Link
            href="/pages/internships"
            className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg ${isActive("/pages/internships") ? "active" : "hover:text-[#9381FF]"}`}
          >
            <SearchOutlinedIcon fontSize="small" />
            internships
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg ${isActive("/admin") ? "active" : "hover:text-[#9381FF]"}`}
            >
              <SettingsOutlinedIcon fontSize="small" />
              admin
            </Link>
          )}

          <div className="relative ml-1">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`nav-link flex items-center gap-2 transition focus:outline-none cursor-pointer px-3 py-2 rounded-lg ${
                isActive("/pages/account") ? "active" : "hover:text-[#9381FF]"
              }`}
            >
              <PersonOutlineOutlinedIcon fontSize="small" />
              account
              <KeyboardArrowDownIcon
                fontSize="small"
                className={`arrow-rotate ${dropdownOpen ? "open" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu absolute right-0 top-full mt-3 w-44 rounded-2xl py-2 z-50"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {user ? (
                  <>
                    <Link
                      href="/pages/account"
                      className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer rounded-lg mx-1"
                      style={{ width: "calc(100% - 8px)" }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      User Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer rounded-lg mx-1"
                      style={{ width: "calc(100% - 8px)" }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/pages/signup"
                      className="dropdown-item block px-4 py-3 text-sm text-gray-700 rounded-lg mx-1"
                      style={{ width: "calc(100% - 8px)" }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/pages/login"
                      className="dropdown-item block px-4 py-3 text-sm text-gray-700 rounded-lg mx-1"
                      style={{ width: "calc(100% - 8px)" }}
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

        {/* Mobile Nav */}
        <div className="sm:hidden flex items-center gap-1" ref={mobileDropdownRef}>
          <Link
            href="/"
            className={`mobile-nav-item ${isActive("/") ? "active text-[#9381FF]" : "text-gray-700 hover:text-[#9381FF]"}`}
          >
            <HomeOutlinedIcon />
          </Link>
          <Link
            href="/pages/internships"
            className={`mobile-nav-item ${isActive("/pages/internships") ? "active text-[#9381FF]" : "text-gray-700 hover:text-[#9381FF]"}`}
          >
            <SearchOutlinedIcon />
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`mobile-nav-item ${isActive("/admin") ? "active text-[#9381FF]" : "text-gray-700 hover:text-[#9381FF]"}`}
            >
              <SettingsOutlinedIcon />
            </Link>
          )}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`mobile-nav-item focus:outline-none ${
              isActive("/pages/account") ? "active text-[#9381FF]" : "text-gray-700 hover:text-[#9381FF]"
            }`}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            <PersonOutlineOutlinedIcon />
          </button>

          {dropdownOpen && (
            <div
              className="dropdown-menu absolute right-4 top-16 w-48 rounded-2xl py-2 z-50"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {user ? (
                <>
                  <Link
                    href="/pages/account"
                    className="dropdown-item block w-full text-left px-5 py-4 sm:py-3 text-base text-gray-700 cursor-pointer"
                    onClick={() => setDropdownOpen(false)}
                  >
                    User Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item block w-full text-left px-5 py-4 sm:py-3 text-base text-gray-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/pages/signup"
                    className="dropdown-item block px-5 py-4 sm:py-3 text-base text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/pages/login"
                    className="dropdown-item block px-5 py-4 sm:py-3 text-base text-gray-700"
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
