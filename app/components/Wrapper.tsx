"use client";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAppSelector } from "../redux/hooks";

import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const registerStatus = useAppSelector(
    (state) => state.user.user.registeredStatus
  );
  const loginStatus = useAppSelector((state) => state.user.user.loginStatus);
  const notifyRegistered = () =>
    toast.success("You have successfully created your account");
  const notifyLoggedIn = () => toast.success("You have successfully logged in");
  const notifyLoggedOut = () =>
    toast.success("You have successfully logged out");

  useEffect(() => {
    if (loginStatus === "succeeded") notifyLoggedIn();
    else if (loginStatus === "idle") notifyLoggedOut();
  }, [loginStatus]);

  useEffect(() => {
    if (registerStatus === "succeeded") notifyRegistered();
  }, [registerStatus]);

  return (
    <div>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
