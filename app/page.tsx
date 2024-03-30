"use client";
import { useAppSelector } from "./redux/hooks";
import { usePathname } from "next/navigation";

export default function Home() {
  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.user.loginStatus);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loginStatus === "succeeded" && path !== "/register" ? (
        <p>Welcome</p>
      ) : (
        <p>You are not logged in </p>
      )}
    </main>
  );
}
