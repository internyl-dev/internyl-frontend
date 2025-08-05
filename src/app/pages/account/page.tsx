"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/config/firebaseConfig";
import {
  updatePassword,
  updateEmail,
  onAuthStateChanged,
  signOut,
  User,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  // Removed unused [status, setStatus]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL || null);

        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setDisplayName(snapshot.data().displayName || "");
          setUsername(snapshot.data().username);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateEmail = async () => {
    if (user && email !== user.email) {
      try {
        await updateEmail(user, email);
        setStatusMessage("✅ Email updated.");
        setStatusType("success");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating email.");
        setStatusType("error");
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;

    if (newPassword.length < 6) {
      setStatusType("error");
      setStatusMessage("Password must be at least 6 characters");
      return;
    }

    if (!currentPassword) {
      setStatusType("error");
      setStatusMessage("Please enter your current password");
      return;
    }

    setIsUpdating(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      setStatusType("success");
      setStatusMessage("Password successfully updated!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err: unknown) {
      const error = err as FirebaseError;
      console.error(error);
      setStatusType("error");
      setStatusMessage(
        error.code === "auth/wrong-password"
          ? "Current password is incorrect"
          : "Error updating password. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { displayName });
        setStatusMessage("✅ Display name updated.");
        setStatusType("success");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating display name.");
        setStatusType("error");
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { username });
        setStatusMessage("✅ Username updated.");
        setStatusType("success");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating username.");
        setStatusType("error");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen px-4 py-12 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/50 backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-3xl transition-all duration-300">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 drop-shadow-sm">
              Account Settings
            </h1>

            {photoURL && (
              <div className="flex justify-center mb-10">
                <div className="relative group">
                  <Image
                    src={photoURL}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover ring-4 ring-white shadow-xl transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-full shadow-inner"></div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="bg-white/40 rounded-2xl p-6 shadow-lg border border-white/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464] transition-all duration-200"
                      placeholder="Your display name"
                    />
                    <button
                      onClick={handleUpdateDisplayName}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-sm disabled:opacity-50"
                    >
                      Update Display Name
                    </button>
                  </div>

                  {/* Username */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464] transition-all duration-200"
                      placeholder="Your username"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-sm disabled:opacity-50"
                    >
                      Update Username
                    </button>
                  </div>
                </div>

                {/* User ID - Immutable */}
                <div className="space-y-3 mt-6">
                  <label className="block text-sm font-medium text-gray-700">User ID:</label>
                  <div className="mt-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl shadow-sm relative">
                    {user?.uid}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 group">
                      <HelpOutlineOutlinedIcon className="text-gray-400/50 hover:text-gray-600 transition-colors duration-200" />
                      <div className="invisible group-hover:visible absolute right-0 -top-12 w-64 bg-gray-700 text-white text-sm rounded-lg py-2 px-3 shadow-xl">
                        This is unchangeable and is only used for organization on our database.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white/40 rounded-2xl p-6 shadow-lg border border-white/50">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464] transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                    <button
                      onClick={handleUpdateEmail}
                      disabled={isUpdating}
                      className="px-6 py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-sm whitespace-nowrap disabled:opacity-50"
                    >
                      Update Email
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Change Password</label>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464] transition-all duration-200"
                      placeholder="Current password"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec6464] transition-all duration-200"
                      placeholder="New password"
                    />
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdating}
                      className="w-full py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-sm disabled:opacity-50"
                    >
                      {isUpdating ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>

                {/* Sign Out */}
                <div className="pt-6">
                  <button
                    onClick={handleSignOut}
                    className="w-full py-3 border-2 border-red-500/70 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Status Message */}
                {statusMessage && (
                  <div
                    className={`mt-4 p-4 rounded-xl backdrop-blur-md ${
                      statusType === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    } shadow-lg transition-all duration-300`}
                  >
                    <p className="text-sm font-medium text-center">
                      {statusType === "success" ? "✅ " : "❌ "}
                      {statusMessage}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
