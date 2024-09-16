"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { BookOpen } from "lucide-react";

interface NavBarClientProps {
  userImage: string;
}

export default function NavBarClient({ userImage }: NavBarClientProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 border-b-transparent">
      <div className="flex justify-between items-center h-16 px-4">
        {/* Logo or Home Link */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-xl font-bold text-black flex items-center"
          >
            <BookOpen className="w-8 h-8 mr-2 text-black" />
            SHIFA'S LIBRARY
          </Link>
        </div>

        {/* Navigation Links and Profile */}
        <div className="flex items-center">
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 mr-6">
            <Link
              href="/dashboard"
              className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Dashboard
            </Link>
            <Link
              href="/about"
              className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-black hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              Contact
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-black hover:text-gray-600 focus:outline-none transition duration-150 ease-in-out"
            >
              <Image
                src={userImage}
                alt="Profile Picture"
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}