"use client";

import { useState } from "react";
import { auth, GoogleProvider } from "@/lib/config/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification
} from "firebase/auth";

import { db } from "@/lib/config/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SignUp() {
    const [signUpName, setSignUpName] = useState("");
    const [signUpUsername, setSignUserName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (signUpPassword !== signUpConfirmPassword) {
            setStatus("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: signUpName,
                username: signUpUsername,
                email: signUpEmail,
                createdAt: new Date(),
            });

            try {
                await sendEmailVerification(auth.currentUser!);
                await auth.signOut();
                router.push("/pages/verify-email");
                return;
            } catch (sendErr: unknown) {
                const errorMessage = (sendErr as Error)?.message ?? "Failed to send verification email";
                setStatus(errorMessage);
            }

            setStatus("Account created successfully!");
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setStatus(err.message);
            } else {
                setStatus("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const userCredential = await signInWithPopup(auth, GoogleProvider);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: user.displayName || signUpName,
                username: signUpUsername,
                email: user.email || signUpEmail,
                createdAt: new Date(),
            });

            setStatus("Account created successfully!");
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setStatus(err.message);
            } else {
                setStatus("An unknown error occurred.");
            }
        }
    };

    const inputBase = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ec6464]/40 focus:border-[#ec6464] transition text-sm";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Branded header */}
                    <div className="bg-gradient-to-r from-[#ec6464] to-[#f07575] px-10 py-7">
                        <Link href="/" className="text-white/70 text-sm font-semibold tracking-wide hover:text-white transition">
                            internyl
                        </Link>
                        <h1 className="text-2xl font-bold text-white mt-2">Create your account</h1>
                        <p className="text-white/70 text-sm mt-1">Start tracking internships for free</p>
                    </div>

                    <form onSubmit={handleSignUp} className="px-10 py-8 space-y-3">
                        {/* Full Name */}
                        <div className="relative">
                            <PersonOutlineIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                                className={inputBase}
                                autoComplete="name"
                            />
                        </div>

                        {/* Username */}
                        <div className="relative">
                            <AlternateEmailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={signUpUsername}
                                onChange={(e) => setSignUserName(e.target.value)}
                                className={inputBase}
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <EmailOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                className={inputBase}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type={showRegisterPassword ? "text" : "password"}
                                placeholder="Password (min 8 characters)"
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                className={`${inputBase} pr-12`}
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ec6464] transition"
                                onClick={() => setShowRegisterPassword((prev) => !prev)}
                                aria-label="Toggle password visibility"
                            >
                                {showRegisterPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <LockOutlinedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                            <input
                                type={showRegisterPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={signUpConfirmPassword}
                                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                                className={inputBase}
                                required
                            />
                        </div>

                        {status && (
                            <div className="text-sm px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200">
                                {status}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#ec6464] to-[#f07575] hover:from-[#d45555] hover:to-[#e06565] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : "Create account"}
                        </button>

                        <div className="flex items-center gap-3 my-1">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Image src="/google-logo.svg" alt="Google icon" width={18} height={18} priority />
                            Continue with Google
                        </button>

                        <p className="text-sm text-center pt-2 text-gray-500">
                            Already have an account?{" "}
                            <Link href="/pages/login" className="text-[#ec6464] font-semibold hover:underline transition">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
