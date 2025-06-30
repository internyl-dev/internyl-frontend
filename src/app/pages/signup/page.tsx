"use client";

import { useState } from "react";
import { auth, GoogleProvider } from "@/lib/config/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { useAuth } from "@/lib/config/context/AuthContext";

import Image from "next/image";

export default function SignUp() {
    const { user } = useAuth();

    const [signUpName, setSignUpName] = useState("");
    const [signUpUsername, setSignUserName] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signUpPassword !== signUpConfirmPassword) {
            setStatus("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            setStatus("Account created successfully!");
        } catch (err: any) {
            setStatus(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, GoogleProvider);
        } catch (err: any) {
            setStatus(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <form
                onSubmit={handleSignUp}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-300 animate-fadeIn 
                   max-h-[90vh] overflow-y-auto"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-[#2f2f3a]">
                    Create your account
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3C66C2] transition"
                    />

                    <input
                        type="text"
                        placeholder="Username"
                        value={signUpUsername}
                        onChange={(e) => setSignUserName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3C66C2] transition"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3C66C2] transition"
                        required
                    />

                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Password"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E66646] transition"
                        required
                    />

                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E66646] transition"
                        required
                    />

                    <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={showRegisterPassword}
                                onChange={() => setShowRegisterPassword(!showRegisterPassword)}
                                className="mr-2"
                            />
                            Show Passwords
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-[#ec6464] text-white font-bold py-2 rounded-md hover:bg-[#d45555] transition-all shadow-md hover:shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing up..." : "Sign Up"}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">or</div>

                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="mt-4 w-full flex items-center justify-center gap-2 border border-[#3C66C2] text-[#3C66C2] py-2 rounded-md font-semibold hover:bg-[#3C66C2] hover:text-white transition-all shadow-sm"
                >
                    Sign up with <span>
                        <Image
                            src="/google-logo.svg"
                            alt="Google icon"
                            width={32}
                            height={32}
                            priority
                        />
                    </span>
                </button>

                {status && (
                    <div className="mt-4 text-center text-sm text-red-500">
                        {status}
                    </div>
                )}

                <hr className="mt-8 mb-4 border-t border-gray-200" />

                <div className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/pages/login"
                        className="text-[#3C66C2] font-medium hover:underline transition"
                    >
                        Login here.
                    </a>
                </div>
            </form>
        </div>
    );
}
