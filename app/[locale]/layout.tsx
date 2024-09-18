"use client";

import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <EdgeStoreProvider>
            <main>
              {children}
              <Toaster />
            </main>
          </EdgeStoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
