"use client";
import { useAppSelector } from "./redux/hooks";
import { usePathname } from "next/navigation";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {loginStatus === "succeeded" && path !== "/register" ? (
        <Dashboard />
      ) : (
        <p>You are not logged in </p>
      )}
    </main>
  );
}
