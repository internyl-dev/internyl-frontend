"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";

import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from '@/lib/config/firebaseConfig';

interface AuthContextType {
    user: User | null;
    loading: boolean; // determines whether or not firebase has finished determining the user's auth state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // the 'user' can either be User or defined as null (not logged in)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser); // updates the user variable to the current logged in user; if not logged in, then it's set to null
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};