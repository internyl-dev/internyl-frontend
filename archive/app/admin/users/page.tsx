/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import AdminNav from "../AdminNav";
import toast from "react-hot-toast";

// Define Admin type
interface Admin {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminUserInfo() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserData, setCurrentUserData] = useState<Admin | null>(null);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchCurrentUserData(user.uid);
            } else {
                setCurrentUser(null);
                setCurrentUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch current admin info from Firestore
    async function fetchCurrentUserData(uid: string) {
        try {
            const adminsSnap = await getDocs(collection(db, "admins"));
            const adminsData: Admin[] = adminsSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Admin));

            setAdmins(adminsData);
            const me = adminsData.find((admin) => admin.id === uid) || null;
            setCurrentUserData(me);
        } catch (err) {
            console.error("Error fetching admins:", err);
            toast.error("Failed to fetch admin info.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <AdminNav title="Admin | User Info" />

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-lg text-gray-600">Loading user info...</p>
                    </div>
                ) : (
                    <>
                        {/* Current User Info */}
                        {currentUserData ? (
                            <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">👤 My Info</h2>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-semibold text-gray-700">Name:</span>{" "}
                                        {currentUserData.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-700">Email:</span>{" "}
                                        {currentUserData.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-gray-700">Role:</span>{" "}
                                        <span className="capitalize">{currentUserData.role}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm text-red-700">
                                You do not have admin access.
                            </div>
                        )}

                        {/* Current Admins List */}
                        <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-lg shadow-lg p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🛠 Current Admins</h2>
                            {admins.length === 0 ? (
                                <p className="text-gray-600">No admins found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {admins.map((admin) => (
                                                <tr key={admin.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 text-gray-800">{admin.name}</td>
                                                    <td className="px-4 py-2 text-gray-800">{admin.email}</td>
                                                    <td className="px-4 py-2 capitalize text-gray-700">{admin.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
