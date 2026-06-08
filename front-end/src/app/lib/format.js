const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
};
const getProductStatus = (product) => {
  if (product.quantity <= 0) return "out-of-stock";
  if (product.quantity <= product.min_quantity) return "low-stock";
  if (product.expiry_date) {
    const days = (new Date(product.expiry_date).getTime() - Date.now()) / (1e3 * 60 * 60 * 24);
    if (days <= 45) return "expiring-soon";
  }
  return "in-stock";
};
const uniqueOptions = (values, allLabel) => [
  { value: "all", label: allLabel },
  ...Array.from(new Set(values.filter(Boolean))).map((value) => ({ value, label: value }))
];
export {
  formatDate,
  getProductStatus,
  uniqueOptions
};
