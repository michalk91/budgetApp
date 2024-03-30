"use client";

import { useAppSelector } from "./redux/hooks";

export default function Home() {
  const loginStatus = useAppSelector((state) => state.user.user.loginStatus);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {loginStatus === "succeeded" ? (
        <p>Welcome</p>
      ) : (
        <p>You are not logged in </p>
      )}
    </main>
  );
}
