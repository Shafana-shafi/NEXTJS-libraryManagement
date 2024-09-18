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
      <body>
        <SessionProvider>
          <main>
            {children}
            <Toaster />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
