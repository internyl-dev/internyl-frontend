"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCheck } from "@/lib/hooks/useAdminCheck";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/config/firebaseConfig";
import { query, where, collection, getDocs } from "firebase/firestore";

import CircularProgress from "@mui/material/CircularProgress";
import AdminNav from "./AdminNav";
import { DashboardCard } from "./DashboardCard";

export default function AdminDashboard() {
    const router = useRouter();
    const isAdmin = useAdminCheck();

    // --- State ---
    const [status, setStatus] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const [internshipCount, setInternshipCount] = useState(0);
    const [reportCount, setReportCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const [newUsersCount, setNewUsersCount] = useState<number | null>(null);
    const [userPercentIncrease, setUserPercentIncrease] = useState<number | null>(null);
    const [newReportsCount, setNewReportsCount] = useState<number | null>(null);
    const [reportPercentIncrease, setReportPercentIncrease] = useState<number | null>(null);

    // --- Redirect non-admin users ---
    useEffect(() => {
        if (isAdmin === false) router.replace("/");
    }, [isAdmin, router]);

    // --- Track authenticated user ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
        return () => unsubscribe();
    }, []);

    // --- Helper Functions ---
    const calculatePercentageChange = (oldValue: number, newValue: number) => {
        if (oldValue === 0) return newValue * 100;
        return ((newValue - oldValue) / oldValue) * 100;
    };

    const fetchTotalInternships = async () => {
        const snapshot = await getDocs(collection(db, "programs-display"));
        setInternshipCount(snapshot.size);
    };

    const fetchRecentUsers = async (days: number) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        const q = query(collection(db, "users"), where("createdAt", ">", pastDate));
        const snapshot = await getDocs(q);
        return snapshot.size;
    };

    const fetchRecentReports = async (days: number) => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        const q = query(collection(db, "reports"), where("createdAt", ">", pastDate));
        const snapshot = await getDocs(q);
        return snapshot.size;
    };

    // --- Stats ---
    const fetchUserStats = async () => {
        const totalSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = totalSnapshot.size;
        const usersLast7Days = await fetchRecentUsers(7);
        const oldUsers = totalUsers - usersLast7Days;

        setUserCount(totalUsers);
        setNewUsersCount(usersLast7Days);
        setUserPercentIncrease(calculatePercentageChange(oldUsers, totalUsers));
    };

    const fetchReportStats = async () => {
        const totalSnapshot = await getDocs(collection(db, "reports"));
        const totalReports = totalSnapshot.size;
        const reportsLast30Days = await fetchRecentReports(30);
        const oldReports = totalReports - reportsLast30Days;

        setReportCount(totalReports);
        setNewReportsCount(reportsLast30Days);
        setReportPercentIncrease(calculatePercentageChange(oldReports, totalReports));
    };

    // --- Fetch All Stats ---
    useEffect(() => {
        fetchTotalInternships();
        fetchUserStats();
        fetchReportStats();
    }, [status]);

    // --- Loading State ---
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

    // --- Main Render ---
    return (
        <div>
            <AdminNav title="Admin Dashboard" />

            {status === "loading" && (
                <p className="text-center text-sm text-gray-500 mt-2 animate-pulse">
                    Refreshing data...
                </p>
            )}

            <section className="flex justify-center mt-8 gap-4">
                {/* Internship Card */}
                <DashboardCard
                    title="Internship Count"
                    count={internshipCount}
                    subtitle="Total internships in database"
                    color="purple"
                    onRefresh={fetchTotalInternships}
                    setStatus={setStatus}
                />

                {/* User Count Card */}
                <DashboardCard
                    title="Total Number of Users"
                    count={userCount}
                    subtitle={
                        userPercentIncrease !== null && newUsersCount !== null ? (
                            <>
                                <span className="text-green-600">
                                    {newUsersCount} new user(s)
                                </span>
                                <br />
                                <span className="text-green-600">
                                    {userPercentIncrease.toFixed(1)}% increase in past 7 days
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-600">No recorded change</span>
                        )
                    }
                    color="blue"
                    onRefresh={fetchUserStats}
                    setStatus={setStatus}
                />

                {/* Reports Count Card */}
                <DashboardCard
                    title="Total Reports Count"
                    count={reportCount}
                    subtitle={
                        reportPercentIncrease !== null && newReportsCount !== null ? (
                            <>
                                <span className="text-red-700">
                                    {newReportsCount} new report(s)
                                </span>
                                <br />
                                <span className="text-red-700">
                                    {reportPercentIncrease.toFixed(1)}% increase in past 7 days
                                </span>
                            </>
                        ) : (
                            <span className="text-gray-600">No recorded change</span>
                        )
                    }
                    color="red"
                    onRefresh={fetchReportStats}
                    setStatus={setStatus}
                />
            </section>
        </div>
    );
}