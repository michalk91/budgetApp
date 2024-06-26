"use client";

import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { resetLoginStatus } from "../redux/usersSlice";
import "react-toastify/dist/ReactToastify.css";
import { useCallback, useEffect } from "react";

export default function Wrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();

  const loginStatus = useAppSelector((state) => state.user.loginStatus);

  const notifyLoggedOut = useCallback(
    () => toast.success("You have successfully logged out"),
    []
  );

  useEffect(() => {
    if (loginStatus === "loggedOut") {
      dispatch(resetLoginStatus());
      notifyLoggedOut();
    }
  }, [loginStatus, dispatch, notifyLoggedOut]);

  return (
    <>
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
    </>
  );
}
