"use client";

import { useState } from "react";
import { auth, GoogleProvider } from "@/lib/config/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      if (!user) throw new Error("User not found after login.");

      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const updates: Partial<typeof data> = {};
        if (!data.displayName) updates.displayName = user.displayName || "";
        if (!data.username) updates.username = "";
        if (!data.email) updates.email = user.email || "";
        if (Object.keys(updates).length > 0) {
          await setDoc(userDocRef, { ...data, ...updates });
        }
      } else {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || "",
          username: "",
          email: user.email || "",
          createdAt: new Date(),
        });
      }

      const pendingBookmark = localStorage.getItem("pendingBookmark");
      router.push(pendingBookmark ? "/pages/internships" : "/");
    } catch { {/* (error) */}
      setStatusType("error");
      setStatus("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, GoogleProvider);
      const user = userCredential.user;

      if (!user) throw new Error("Google sign-in failed to return a user.");

      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName || "",
          username: "",
          email: user.email || "",
          createdAt: new Date(),
        });
      }

      const pendingBookmark = localStorage.getItem("pendingBookmark");
      router.push(pendingBookmark ? "/pages/internships" : "/");
    } catch { {/* (error) */}
      setStatusType("error");
      setStatus("Google sign-in failed.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setStatusType("error");
      setStatus("Please enter your email above to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setStatusType("success");
      setStatus("Password reset email sent — check your inbox.");
    } catch { {/* (error) */}
      setStatusType("error");
      setStatus("Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Branded top strip */}
          <div className="bg-gradient-to-r from-[#9381FF] to-[#A891FF] px-10 py-8">
            <Link href="/" className="text-white/70 text-sm font-semibold tracking-wide hover:text-white transition">
              internyl
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">Welcome back</h1>
            <p className="text-white/70 text-sm mt-1">Log in to your account to continue</p>
          </div>

          <div className="px-10 py-8">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <EmailOutlinedIcon
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9381FF]/40 focus:border-[#9381FF] transition text-sm"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <LockOutlinedIcon
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9381FF]/40 focus:border-[#9381FF] transition text-sm"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9381FF] transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs text-[#9381FF] hover:text-[#7a6de0] hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>

              {status && (
                <div className={`text-sm px-4 py-2.5 rounded-xl ${
                  statusType === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#9381FF] to-[#A891FF] hover:from-[#7a6de0] hover:to-[#9880ee] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Logging in...
                  </span>
                ) : "Log in"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Image
                src="/google-logo.svg"
                alt="Google icon"
                width={18}
                height={18}
                priority
              />
              Continue with Google
            </button>

            <p className="text-sm text-center mt-6 text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="signup" className="text-[#9381FF] font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
