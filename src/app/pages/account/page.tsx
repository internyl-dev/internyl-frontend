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
        // setUsername(currentUser.username || "");

        const docRef = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setDisplayName(snapshot.data().displayName || "");
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
  }

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="w-full max-w-lg bg-gradient-to-br from-gray-50 via-slate-100 to-blue-50 p-8 rounded-3xl shadow-xl border border-gray-300">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Account Settings</h1>

        {photoURL && (
          <div className="flex justify-center mb-8">
            <img
              src={photoURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Display Name */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
            <button
              onClick={handleUpdateDisplayName}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Update Display Name
            </button>
          </div>

          {/* Username */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
            <button
              onClick={handleUpdateUsername}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Update Username
            </button>
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
            <button
              onClick={handleUpdateEmail}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Update Email
            </button>
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Update Password
            </button>
          </div>

          {/* Sign Out */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-600 hover:text-red-600 transition-all duration-200 font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-center text-blue-700 font-medium">{statusMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}