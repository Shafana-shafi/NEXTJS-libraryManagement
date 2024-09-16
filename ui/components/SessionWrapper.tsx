"use client";

import { SessionProvider } from "next-auth/react";

const SessionWrapper = ({ Children }: { Children: React.ReactNode }) => {
  return <SessionProvider>{Children}</SessionProvider>;
};

export default SessionWrapper;
