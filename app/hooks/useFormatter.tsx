const useFormatter = (amount: number, currency: string) => {
  if (!currency) return;

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  return formatter.format(amount);
};

export default useFormatter;
