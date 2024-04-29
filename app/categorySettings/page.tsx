"use client";
import ExpenseCategories from "../components/ExpenseCategories";
import IncomeCategories from "../components/IncomeCategories";

export default function Account() {
  return (
    <section className="flex flex-col grow justify-center items-center mt-10">
      <ExpenseCategories />
      <IncomeCategories />
    </section>
  );
}
