"use client";
import { cn } from "../utils/cn";
import type { ButtonProps } from "../types";

export default function Button({
  children,
  handleClick,
  additionalStyles,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      // cn() lets additionalStyles override the defaults (e.g. text color of disabled buttons).
      className={cn(
        "text-white font-bold py-2 my-2 mx-2 px-6 rounded-full max-md:px-6 max-md:py-4 max-md:my-6",
        additionalStyles
      )}
    >
      {children}
    </button>
  );
}
