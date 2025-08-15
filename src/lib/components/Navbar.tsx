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
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function Navbar() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // NEW: track both desktop and mobile dropdown containers
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const isAdmin = useAdminCheck();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target as Node;

      const insideDesktop =
        desktopDropdownRef.current?.contains(target) ?? false;
      const insideMobile =
        mobileDropdownRef.current?.contains(target) ?? false;

      if (!insideDesktop && !insideMobile) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    // Use pointerdown so it fires on touch + mouse
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
          @keyframes homeFloat{0%,100%{transform:scale(1) rotate(0deg);}25%{transform:scale(1.15) rotate(-1deg);}50%{transform:scale(1.25) rotate(0deg);}75%{transform:scale(1.15) rotate(1deg);}}
          @keyframes searchMagnify{0%{transform:rotate(0deg) scale(1);}10%{transform:rotate(-5deg) scale(1.1);}20%{transform:rotate(10deg) scale(1.2);}30%{transform:rotate(-8deg) scale(1.15);}40%{transform:rotate(12deg) scale(1.25);}50%{transform:rotate(-10deg) scale(1.3);}60%{transform:rotate(8deg) scale(1.25);}70%{transform:rotate(-5deg) scale(1.15);}80%{transform:rotate(3deg) scale(1.1);}90%{transform:rotate(-2deg) scale(1.05);}100%{transform:rotate(0deg) scale(1);}}
          @keyframes personBreathe{0%,100%{transform:scale(1) translateY(0px);filter:drop-shadow(0 0 0px rgba(59,130,246,0));}25%{transform:scale(1.05) translateY(-1px);filter:drop-shadow(0 2px 4px rgba(59,130,246,0.1));}50%{transform:scale(1.1) translateY(-2px);filter:drop-shadow(0 4px 8px rgba(59,130,246,0.2));}75%{transform:scale(1.05) translateY(-1px);filter:drop-shadow(0 2px 4px rgba(59,130,246,0.1));}}
          @keyframes settingsRotate{0%{transform:rotate(0deg) scale(1);}25%{transform:rotate(90deg) scale(1.1);}50%{transform:rotate(180deg) scale(1.2);}75%{transform:rotate(270deg) scale(1.1);}100%{transform:rotate(360deg) scale(1);}}
          @keyframes dropdownSlide{0%{opacity:0;transform:translateY(-10px) scale(0.95);}100%{opacity:1;transform:translateY(0) scale(1);}}
          @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
          @keyframes logoGlow{0%,100%{text-shadow:0 0 0px rgba(59,130,246,0);}50%{text-shadow:0 0 20px rgba(59,130,246,0.3);}}

          .navbar-scrolled{backdrop-filter:blur(20px);}
          .logo-hover:hover{animation:shimmer 3s ease-in-out infinite,logoGlow 2s ease-in-out infinite;background-size:400% 400%;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;}

          .nav-link{position:relative;overflow:hidden;transition:all .4s cubic-bezier(.4,0,.2,1);}
          .nav-link::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(59,130,246,.1),transparent);transition:left .6s cubic-bezier(.4,0,.2,1);}
          .nav-link::after{content:'';position:absolute;bottom:-2px;left:50%;width:0;height:2px;background:linear-gradient(45deg,#3b82f6,#6366f1);transition:all .4s cubic-bezier(.4,0,.2,1);transform:translateX(-50%);}
          @media (min-width:640px){
            .nav-link:hover::before{left:100%;}
            .nav-link:hover::after{width:100%;}
          }

          .dropdown-menu{animation:dropdownSlide .3s cubic-bezier(.4,0,.2,1);background:rgba(255,255,255,.95);backdrop-filter:blur(16px) saturate(200%);border:1px solid rgba(255,255,255,.3);box-shadow:0 20px 40px rgba(0,0,0,.15);}
          .dropdown-item{position:relative;transition:all .3s cubic-bezier(.4,0,.2,1);touch-action:manipulation;}
          .dropdown-item::before{content:'';position:absolute;top:0;left:0;width:0;height:100%;background:linear-gradient(45deg,#3b82f6,#6366f1);opacity:.1;transition:width .3s cubic-bezier(.4,0,.2,1);}
          @media (min-width:640px){
            .dropdown-item:hover::before{width:100%;}
            .dropdown-item:hover{transform:translateX(4px);color:#3b82f6;}
          }

          .mobile-nav-item{transition:all .3s cubic-bezier(.4,0,.2,1);border-radius:50%;padding:8px;}
          .mobile-nav-item:hover{background:rgba(59,130,246,.1);transform:scale(1.1);}
          .arrow-rotate{transition:transform .3s cubic-bezier(.4,0,.2,1);}
          .arrow-rotate.open{transform:rotate(180deg);}
        `,
        }}
      />

      <nav
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md px-5 sm:px-7 py-2 flex justify-between items-center transition-all duration-500 ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        {/* Logo */}
        <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-gray-900 tracking-[-0.05em] logo-hover cursor-pointer">
          internyl
        </h1>

        {/* Desktop Nav (wrap with ref) */}
        <div
          className="hidden sm:flex gap-6 md:gap-7 items-center text-base text-gray-800 font-medium relative"
          ref={desktopDropdownRef}
        >
          <Link
            href="/"
            className="nav-link hover:text-blue-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-home"
          >
            <HomeOutlinedIcon />
            home
          </Link>

          <Link
            href="/pages/internships"
            className="nav-link hover:text-emerald-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-search"
          >
            <SearchOutlinedIcon />
            internships
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="nav-link hover:text-amber-600 transition flex items-center gap-2 px-3 py-2 rounded-lg animate-settings"
            >
              <SettingsOutlinedIcon />
              admin dashboard
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="nav-link flex items-center gap-2 hover:text-purple-600 transition focus:outline-none cursor-pointer px-3 py-2 rounded-lg animate-person"
            >
              <PersonOutlineOutlinedIcon />
              account
              <KeyboardArrowDownIcon
                className={`arrow-rotate ${dropdownOpen ? "open" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                className="dropdown-menu absolute right-0 top-full mt-3 w-44 rounded-2xl py-2 z-50"
                // prevent closing on internal taps
                onPointerDown={(e) => e.stopPropagation()}
              >
                {user ? (
                  <>
                    <Link
                      href="/pages/account"
                      className="dropdown-item block w-full text-left px-4 py-3 text-sm text-gray-700 cursor-pointer"
                      onClick={() => setDropdownOpen(false)}
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

        {/* Mobile Nav (wrap with ref) */}
        <div className="sm:hidden flex items-center gap-3" ref={mobileDropdownRef}>
          <Link
            href="/"
            className="mobile-nav-item hover:text-blue-600 transition animate-home"
          >
            <HomeOutlinedIcon />
          </Link>
          <Link
            href="/pages/internships"
            className="mobile-nav-item hover:text-emerald-600 transition animate-search"
          >
            <SearchOutlinedIcon />
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="mobile-nav-item hover:text-amber-600 transition animate-settings"
            >
              <SettingsOutlinedIcon />
            </Link>
          )}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="mobile-nav-item text-gray-800 hover:text-purple-600 transition focus:outline-none animate-person"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            <PersonOutlineOutlinedIcon />
          </button>

          {dropdownOpen && (
            <div
              className="dropdown-menu absolute right-4 top-16 w-48 rounded-2xl py-2 z-50"
              // prevent closing on taps inside
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
