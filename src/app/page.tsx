'use client';

import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react";
import { auth } from "@/lib/config/firebaseConfig";

import UserDashboardPage from "@/lib/build/UserDashboardPage";
import LandingPage from "@/lib/build/LandingPage";

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (user) {
        // const savedInternshipsFiltered = internships.filter((internship) =>
        //     userData?.savedInternships?.includes(internship.id)
        // );
        return <UserDashboardPage />
    } else {
        return <LandingPage />
    }
}