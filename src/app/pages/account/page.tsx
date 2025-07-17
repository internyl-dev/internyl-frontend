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
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Account Settings</h1>

        {photoURL && (
          <div className="flex justify-center mb-6">
            <img
              src={photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}

        <div className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleUpdateDisplayName}
              className="w-full mt-2 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Update Display Name
            </button>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleUpdateUsername}
              className="w-full mt-2 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Update Username
            </button>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleUpdateEmail}
              className="w-full mt-2 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Update Email
            </button>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleUpdatePassword}
              className="w-full mt-2 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
            >
              Update Password
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full mt-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Sign Out
          </button>

          {/* Status Message */}
          {statusMessage && (
            <p className="mt-3 text-sm text-center text-blue-600">{statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
