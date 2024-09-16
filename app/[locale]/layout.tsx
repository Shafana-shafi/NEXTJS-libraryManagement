"use client";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head />
      <body>
        <main>
          <SessionProvider>{children}</SessionProvider>{" "}
          {/* No need to pass session */}
          <Toaster />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
