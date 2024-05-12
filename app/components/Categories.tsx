"use client";
import ExpenseCategories from "../components/ExpenseCategories";
import IncomeCategories from "../components/IncomeCategories";

export default function Categories() {
  return (
    <section className="flex flex-col grow justify-center items-center mt-10">
      <ExpenseCategories />
      <IncomeCategories />
    </section>
  );
}
