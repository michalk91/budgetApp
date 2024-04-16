"use client";
import CurrencyType from "../components/CurrencyType";
import ChangePassword from "../components/ChangePassword";

export default function Account() {
  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <CurrencyType />
      <ChangePassword />
    </section>
  );
}
