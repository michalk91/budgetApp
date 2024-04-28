"use client";
import { useAppSelector } from "./redux/hooks";
import { usePathname } from "next/navigation";
import ControlPanel from "./components/ControlPanel";

export default function Dashboard() {
  const path = usePathname();
  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  return (
    <>
      {loginStatus === "succeeded" && path !== "/register" ? (
        <ControlPanel />
      ) : (
        <p>You are not logged in </p>
      )}
    </>
  );
}
