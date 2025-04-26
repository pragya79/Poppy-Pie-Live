// app/components/context/AuthWrapper.js
"use client";

import { AuthProvider } from "./AuthProvider";
import { SessionProvider } from "next-auth/react";

export default function AuthWrapper({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
