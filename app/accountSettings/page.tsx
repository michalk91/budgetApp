"use client";
import Categories from "../components/Categories";
import CurrencyType from "../components/CurrencyType";

export default function Account() {
  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <Categories />
      <CurrencyType />
    </section>
  );
}
