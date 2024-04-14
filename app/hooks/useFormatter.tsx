const useFormatter = () => {
  const formatCurrency = (amount: number, currency: string) => {
    if (!currency) return;

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });

    return formatter.format(amount);
  };

  return formatCurrency;
};

export default useFormatter;
