import React from "react";
import type { WarningProps } from "../types";

export default function Warning({ text, additionalStyles }: WarningProps) {
  return (
    <div
      className={`p-10 bg-white rounded-lg shadow-xl ${
        additionalStyles ? additionalStyles : ""
      }`}
    >
      <span className={`text-2xl `}>{text}</span>
    </div>
  );
}
