const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
};
const formatDateTime = (value, locale = "en") => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  const dateText = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
  const timeText = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
  return `${dateText} - ${timeText}`;
};
const getProductStatus = (product) => {
  if (product.quantity <= 0) return "out-of-stock";
  if (product.quantity <= product.min_quantity) return "low-stock";
  const expirationDate = product.expiration_date || product.expiry_date;
  if (expirationDate) {
    const days = (new Date(expirationDate).getTime() - Date.now()) / (1e3 * 60 * 60 * 24);
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
  formatDateTime,
  getProductStatus,
  uniqueOptions
};
