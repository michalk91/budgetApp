"use client";
import UpdateBudget from "../components/UpdateBudget";
import CurrentBudget from "../components/CurrentBudget";

export default function Budget() {
  return (
    <section className="flex flex-col w-full h-screen max-h-full justify-center items-center">
      <UpdateBudget />
      <CurrentBudget />
    </section>
  );
}
