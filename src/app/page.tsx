'use client';

import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react";
import { auth } from "@/lib/config/firebaseConfig";

// import UserDashboardPage from "@/lib/build/UserDashboardPage";
// import LandingPage from "@/lib/build/LandingPage";
import dynamic from "next/dynamic";

const UserDashboardPage = dynamic(
    () => import("@/lib/build/UserDashboardPage"),
    { ssr: false }
);

const LandingPage = dynamic(
    () => import("@/lib/build/LandingPage"),
    { ssr: false }
);

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            </div>
        )
    }

    if (user) {
        // const savedInternshipsFiltered = internships.filter((internship) =>
        //     userData?.savedInternships?.includes(internship.id)
        // );
        return <UserDashboardPage />
    } else {
        return <LandingPage />
    }
}