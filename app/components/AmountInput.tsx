import type { ClipboardEvent, ComponentProps, KeyboardEvent } from "react";
import { cn } from "../utils/cn";

// Characters a number input accepts that would let a negative value or
// exponent notation (e.g. "1e-5") through.
const BLOCKED_CHARS = /[-+eE]/;

const blockKey = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key.length === 1 && BLOCKED_CHARS.test(e.key)) e.preventDefault();
};

const blockPaste = (e: ClipboardEvent<HTMLInputElement>) => {
  if (BLOCKED_CHARS.test(e.clipboardData.getData("text"))) e.preventDefault();
};

type AmountInputProps = Omit<
  ComponentProps<"input">,
  "type" | "min" | "onKeyDown" | "onPaste"
>;

// Number input for money amounts that does not accept negative values.
// This only guards typing; callers still validate with `validateAmount`.
export default function AmountInput({
  className,
  placeholder = "amount",
  ...props
}: AmountInputProps) {
  return (
    <input
      {...props}
      type="number"
      min={0}
      inputMode="decimal"
      placeholder={placeholder}
      onKeyDown={blockKey}
      onPaste={blockPaste}
      className={cn("px-2 py-1 rounded-xl bg-surface border-2", className)}
    />
  );
}
