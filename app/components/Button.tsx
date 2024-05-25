"use client";
import type { ButtonProps } from "../types";

export default function Button({
  children,
  handleClick,
  additionalStyles,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`${additionalStyles} text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4 max-md:my-6`}
    >
      {children}
    </button>
  );
}
