"use client";
import { useAppSelector } from "./redux/hooks";
import { usePathname } from "next/navigation";
import ControlPanel from "./components/ControlPanel";

export default function Dashboard() {
  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {loginStatus === "succeeded" && path !== "/register" ? (
        <ControlPanel />
      ) : (
        <p>You are not logged in </p>
      )}
    </main>
  );
}
