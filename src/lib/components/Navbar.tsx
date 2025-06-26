"use client";

import Link from "next/link";

import * as React from 'react';
import Button from '@mui/material/Button';

// Material UI Icons
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <h1 className="text-[1.75rem] font-bold text-gray-900 tracking-[-0.05em]">internyl</h1>

            {/* Navigation links */}
            <div className="flex gap-8 items-center text-sm text-gray-800 font-light">
                <Link href="/" className="hover:text-black transition flex items-end gap-1.5">
                    <HomeOutlinedIcon />
                    home
                </Link>

                <Link href="/pages/internships" className="hover:text-black transition flex items-end gap-1.5">
                    <SearchOutlinedIcon />
                    internships
                </Link>

                <Link href="/pages/account" className="hover:text-black transition flex items-end gap-1.5">
                    <PersonOutlineOutlinedIcon />
                    account
                </Link>

            </div>
        </nav>
    );
}