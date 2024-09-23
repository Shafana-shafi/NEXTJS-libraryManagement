"use client";

import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <SpeedInsights />
          </main>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
