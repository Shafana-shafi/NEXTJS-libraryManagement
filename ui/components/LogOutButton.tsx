"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogOutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Remove the next-auth.session-token cookie
    document.cookie =
      "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Sign out using NextAuth
    await signOut({ redirect: false });

    // Redirect to login page
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className={`w-full justify-start ${
        isLoggingOut
          ? "text-red-500 hover:text-red-700 hover:bg-red-100"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
      }`}
      disabled={isLoggingOut}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
}
