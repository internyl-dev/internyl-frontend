"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/config/firebaseConfig";
import {
  updatePassword,
  updateEmail,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);

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
          setUsername(snapshot.data().username)
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
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating email.");
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (user && newPassword.length >= 6) {
      try {
        await updatePassword(user, newPassword);
        setStatusMessage("✅ Password updated.");
        setNewPassword("");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating password.");
      }
    } else {
      setStatusMessage("❌ Password must be at least 6 characters.");
    }
  };

  const handleUpdateDisplayName = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { displayName });
        setStatusMessage("✅ Display name updated.");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating display name.");
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { username });
        setStatusMessage("✅ Username updated.");
      } catch (err) {
        console.error(err);
        setStatusMessage("❌ Error updating username.");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-3xl transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 drop-shadow">Account Settings</h1>

        {photoURL && (
          <div className="flex justify-center mb-8">
            <img
              src={photoURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Display Name */}
            <div className="w-full space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 bg-white/10 text-gray-900 placeholder-gray-500 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <button
                onClick={handleUpdateDisplayName}
                className="w-full py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-lg"
              >
                Update Display Name
              </button>
            </div>

            {/* Username */}
            <div className="w-full space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 bg-white/10 text-gray-900 placeholder-gray-500 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              />
              <button
                onClick={handleUpdateUsername}
                className="w-full py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-lg"
              >
                Update Username
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-white/30 bg-white/10 text-gray-900 placeholder-gray-500 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            <button
              onClick={handleUpdateEmail}
              className="w-full py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-lg"
            >
              Update Email
            </button>
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-white/30 bg-white/10 text-gray-900 placeholder-gray-500 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full py-3 bg-[#ec6464] text-white rounded-xl hover:bg-[#d55555] transition-all duration-300 font-medium shadow-lg"
            >
              Update Password
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-white/30">
            <button
              onClick={handleSignOut}
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-4 p-4 rounded-xl backdrop-blur-md bg-white/30 border border-white/20 text-center shadow-md">
              <p className="text-sm font-medium text-gray-800">{statusMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
