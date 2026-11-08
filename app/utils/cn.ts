import { extendTailwindMerge } from "tailwind-merge";
import { tokenNames } from "../theme/tokens";

// tailwind-merge configured with the theme tokens, so e.g. `text-on-disabled`
// is known to be a text color and correctly overrides `text-white`.
const twMerge = extendTailwindMerge({
  extend: { theme: { colors: tokenNames } },
});

export const cn = (...classes: (string | false | null | undefined)[]) =>
  twMerge(...classes);
