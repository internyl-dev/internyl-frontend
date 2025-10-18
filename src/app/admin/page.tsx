/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/config/firebaseConfig";
import { db } from "@/lib/config/firebaseConfig";
import { query, where } from "firebase/firestore";

import CircularProgress from "@mui/material/CircularProgress";
import AdminNav from "./AdminNav";
import { Button } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
    // config variables
    const router = useRouter();
    const isAdmin = useAdminCheck();

    // state variables
    const [status, setStatus] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [userPercentIncrease, setUserPercentIncrease] = useState<number | null>(null);
    const [newUsersCount, setNewUsersCount] = useState<number | null>(null);

    const [reportPercentIncrease, setReportPercentIncrease] = useState<number | null>(null);
    const [newReportsCount, setNewReportsCount] = useState<number | null>(null);

    const [internshipCount, setInternshipCount] = useState<number>(0);
    const [reportCount, setReportCount] = useState<number>(0);
    const [userCount, setUserCount] = useState<number>(0);

    // other varaibles
    const welcomeMessage = [
        "Welcome, your Kingship",
        "Welcome, your Highness",
        "Welcome, your Royalty",
        "Greetings, your Majesty",
        "Hail, esteemed Monarch",
        "Welcome, illustrious Ruler",
        "Salutations, revered Crown",
        "Welcome, Royal",
        "Greetings, honored Regent",
    ]

    useEffect(() => {
        // If the check is done and user is not admin, redirect to home
        if (isAdmin === false) {
            router.replace("/");
        }
    }, [isAdmin, router]);

    // setting current user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
        return () => unsubscribe();
    }, []);

    // hooks
    // fetch stats
    const fetchTotalInternships = async () => {
        const snapshot = await getDocs(collection(db, "programs-display"));
        setInternshipCount(snapshot.size);
    }

    // calculate % change
    const calculatePercentageChange = (oldValue: number, newValue: number) => {
        if (oldValue === 0) return newValue * 100; // from 0 to X
        return ((newValue - oldValue) / oldValue) * 100;
    };

    const fetchRecentUsers = async (days: number) => {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - days);

        const q = query(
            collection(db, "users"),
            where("createdAt", ">", pastDate)
        );

        const snapshot = await getDocs(q);
        return snapshot.size;
    };

    const fetchRecentReports = async (days: number) => {
        const now = new Date();
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - days);

        const q = query(
            collection(db, "reports"),
            where("createdAt", ">", pastDate)
        );

        const snapshot = await getDocs(q);
        return snapshot.size;
    };

    // combined function to fetch total users + new users + percentage change
    const fetchUserStats = async () => {
        const totalSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = totalSnapshot.size;

        const usersLast7Days = await fetchRecentUsers(7); // number of new users in last 7 days
        const oldUsers = totalUsers - usersLast7Days;

        const percentIncrease = calculatePercentageChange(oldUsers, totalUsers);

        setUserCount(totalUsers);
        setNewUsersCount(usersLast7Days);
        setUserPercentIncrease(percentIncrease);
    };

    // report % change
    const fetchReportStats = async () => {
        const totalSnapshot = await getDocs(collection(db, "reports"));
        const totalReports = totalSnapshot.size;

        const reportsLast30Days = await fetchRecentReports(30); // number of new users in last 7 days
        const oldReports = totalReports - reportsLast30Days;

        const percentIncrease = calculatePercentageChange(oldReports, totalReports);

        setReportCount(totalReports);
        setNewReportsCount(reportsLast30Days);
        setReportPercentIncrease(percentIncrease);
    }

    useEffect(() => {
        fetchTotalInternships();
        fetchUserStats(); // fetch users + new users + percent
        fetchReportStats();
    }, [status]);

    // name variables
    const displayName = currentUser?.displayName || "Admin";

    // while the user is loading, display an unauthorized message
    if (isAdmin === null) {
        return (
            <div className="flex flex-col items-center justify-center mt-5">
                <CircularProgress />
                <p className="text-purple-400 font-semibold mt-2">
                    Attempting to Authorize
                </p>
            </div>
        );
    }

    // random welcome message
    const getRandomPhrase = () => {
        return welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];
    }

    return (
        <div className="">
            <AdminNav />
            <section>
                <h1 className="text-center text-3xl font-bold mt-6">Admin Dashboard</h1>
                <p className="text-center mt-1 font-regular text-xl text-gray-600">
                    {getRandomPhrase()},{" "}
                    <span className="font-bold text-blue-600">
                        {displayName.split(" ")[0]}
                    </span>
                </p>
            </section>

            {status === "loading" && (
                <p className="text-center text-sm text-gray-500 mt-2 animate-pulse">
                    Refreshing data...
                </p>
            )}

            <section className="flex justify-center mt-8 gap-4">
                {/* Internship Card */}
                <div
                    className="flex flex-col items-center justify-center w-full max-w-sm p-8 rounded-3xl border border-white/30 shadow-lg backdrop-blur-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
                    style={{
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                        WebkitBackdropFilter: "blur(12px)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h3 className="text-purple-700 font-bold text-xl mb-4 flex items-center gap-2">
                        Internship Count
                    </h3>
                    <p className="text-5xl font-extrabold text-gray-900 mb-2">
                        {internshipCount}
                    </p>
                    <p className="text-gray-600 text-sm mb-6 text-center">
                        Total internships in database
                    </p>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={async () => {
                            setStatus("loading");
                            await fetchTotalInternships();
                            setStatus("done");
                        }}
                        className="px-4 py-2 text-xs rounded-lg border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all"
                        style={{ minWidth: "80px" }}
                    >
                        Refresh
                    </Button>
                </div>

                {/* User Count Card */}
                <div
                    className="flex flex-col items-center justify-center w-full max-w-sm p-8 rounded-3xl border border-white/30 shadow-lg backdrop-blur-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
                    style={{
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                        WebkitBackdropFilter: "blur(12px)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h3 className="text-blue-700 font-bold text-xl mb-4 flex items-center gap-2">
                        Total Number of Users
                    </h3>
                    <p className="text-5xl font-extrabold text-gray-900 mb-2">{userCount}</p>
                    {userPercentIncrease !== null && newUsersCount !== null ? (
                        <p className="text-green-600 text-sm mb-6 text-center">
                            {newUsersCount} new user(s) <br />{" "}
                            {userPercentIncrease.toFixed(1)}% increase in past 7 days
                        </p>
                    ) : (
                        <p className="text-gray-600 text-sm mb-6 text-center">
                            No recorded change
                        </p>
                    )}
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={async () => {
                            setStatus("loading");
                            await fetchUserStats();
                            setStatus("done");
                        }}
                        className="px-4 py-2 text-xs rounded-lg border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all"
                        style={{ minWidth: "80px" }}
                    >
                        Refresh
                    </Button>
                </div>

                {/* Reports Count Card */}
                <div
                    className="flex flex-col items-center justify-center w-full max-w-sm p-8 rounded-3xl border border-white/30 shadow-lg backdrop-blur-lg bg-white/30 hover:bg-white/40 transition-all duration-300"
                    style={{
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                        WebkitBackdropFilter: "blur(12px)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h3 className="text-red-700 font-bold text-xl mb-4 flex items-center gap-2">
                        Total Reports Count
                    </h3>
                    <p className="text-5xl font-extrabold text-gray-900 mb-2">{reportCount}</p>
                    {reportPercentIncrease !== null &&
                    newReportsCount !== null &&
                    reportPercentIncrease != 0 ? (
                        <p className="text-red-600 text-sm mb-6 text-center">
                            {newReportsCount} new report(s) <br />{" "}
                            {reportPercentIncrease.toFixed(1)}% increase in past 7 days
                        </p>
                    ) : (
                        <p className="text-blue-600 text-sm mb-6 text-center">
                            No recorded change
                        </p>
                    )}
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={async () => {
                            setStatus("loading");
                            await fetchReportStats();
                            setStatus("done");
                        }}
                        className="px-4 py-2 text-xs rounded-lg border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all"
                        style={{ minWidth: "80px" }}
                    >
                        Refresh
                    </Button>
                </div>
            </section>
        </div>
    );
}
