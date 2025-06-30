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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      setStatus("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, GoogleProvider);
      router.push("/dashboard");
    } catch (error) {
      setStatus("Google sign-in failed.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setStatus("Please enter your email above to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("Password reset email sent.");
    } catch (error) {
      setStatus("Failed to send reset email. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-[#1d1d1f] mb-6">
          Welcome Back
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Log in to access your Internyl account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C66C2] transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C66C2] transition pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#3C66C2]"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-[#3C66C2] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {status && <p className="text-red-500 text-sm">{status}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3C66C2] hover:bg-[#3459a8] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">or</div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-[#3C66C2] text-[#3C66C2] py-2 rounded-md font-semibold hover:bg-[#3C66C2] hover:text-white transition-all shadow-sm"
        >
          Sign in with{" "}
          <Image
            src="/google-logo.svg"
            alt="Google icon"
            width={24}
            height={24}
            priority
          />
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link href="signup" className="text-[#3C66C2] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
