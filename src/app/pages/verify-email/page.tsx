"use client";

import { useState } from "react";
import { auth } from "@/lib/config/firebaseConfig";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResendEmail = async () => {
    if (!auth.currentUser) {
      setStatus("No user logged in.");
      return;
    }

    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      setStatus("Verification email resent! Please check your inbox.");
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message ?? "Failed to send verification email";
      setStatus(errorMessage || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/pages/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="rounded-2xl shadow-lg p-8 w-full max-w-md border backdrop-blur-lg bg-white border-gray-200 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve sent a verification link to your email.  
          Please click it before logging in again.
        </p>

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full bg-[#3C66C2] text-white py-2 rounded-md hover:bg-[#2f529c] transition font-medium mb-3"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>

        <button
          onClick={handleSignOut}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition font-medium"
        >
          Back to Login
        </button>

        {status && (
          <p className="mt-4 text-sm text-[#E66646]">{status}</p>
        )}
      </div>
    </div>
  );
}
