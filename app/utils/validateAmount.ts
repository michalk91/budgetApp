// Validates a raw amount input value. Returns an error message to show the
// user, or null when the amount is a positive number.
export const validateAmount = (
  value: string,
  subject: "budget" | "transaction"
): string | null => {
  if (value.trim() === "") return `You need to enter the ${subject} amount.`;

  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return `The ${subject} amount must be greater than 0.`;
  }

  return null;
};
