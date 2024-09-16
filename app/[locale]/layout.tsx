"use client";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  session: Session | null;
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children, session }) => {
  return (
    <html lang="en">
      <head />
      <body>
        <main>
          <SessionProvider session={session}>{children}</SessionProvider>
          <Toaster />
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
