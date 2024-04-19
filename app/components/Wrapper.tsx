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
  const registerStatus = useAppSelector((state) => state.user.registeredStatus);
  const loginStatus = useAppSelector((state) => state.user.loginStatus);
  const notifyRegistered = () =>
    toast.success("You have successfully created your account");
  const notifyLoggedIn = () => toast.success("You have successfully logged in");
  const notifyLoggedOut = () =>
    toast.success("You have successfully logged out");
  const notifyFailedLogin = () => toast.error("Wrong email or password");
  const notifyFailedRegister = () =>
    toast.error(
      "Username and email are probably taken. Use a different email and username."
    );

  useEffect(() => {
    if (loginStatus === "succeeded") notifyLoggedIn();
    else if (loginStatus === "idle") notifyLoggedOut();
    else if (loginStatus === "failed") notifyFailedLogin();
  }, [loginStatus]);

  useEffect(() => {
    if (registerStatus === "succeeded") notifyRegistered();
    else if (registerStatus === "failed") notifyFailedRegister();
  }, [registerStatus]);

  return (
    <div className="flex justify-center">
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
