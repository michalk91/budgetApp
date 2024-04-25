"use client";
import ExpenseCategories from "../components/ExpenseCategories";
import IncomeCategories from "../components/IncomeCategories";

export default function Account() {
  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <ExpenseCategories />
      <IncomeCategories />
    </section>
  );
}
