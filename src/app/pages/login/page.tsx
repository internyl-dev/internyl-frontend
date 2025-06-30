"use client";

import { useState } from "react";
import { auth, GoogleProvider } from "@/lib/config/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-[#1d1d1f] mb-6">Welcome Back</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Log in to access your Internyl account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C66C2] transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C66C2] transition"
          />

          {status && <p className="text-red-500 text-sm">{status}</p>}

          <button
            type="submit"
            disabled={isLoading}
            // CHANGE THE COLORS AND STUFF
            className="w-full hover:bg-[#3C66C2] bg-white text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500 text-sm">or</div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-[#3C66C2] text-[#3C66C2] py-2 rounded-md font-semibold hover:bg-[#3C66C2] hover:text-white transition-all shadow-sm"
        >
          Sign in with <span>
                        <Image
                            src="/google-logo.svg"
                            alt="Google icon"
                            width={32}
                            height={32}
                            priority
                        />
                    </span>
        </button>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account? <a href="signup" className="text-[#3C66C2] hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
