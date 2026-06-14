const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateValue = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const isValidDateInput = (value) => {
  if (!value) return true;
  if (!DATE_ONLY_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

const isDateRangeValid = (start, end) => {
  if (!isValidDateInput(start) || !isValidDateInput(end)) return false;
  if (!start || !end) return true;
  return new Date(start).getTime() <= new Date(end).getTime();
};

const toDateInputValue = (value) => {
  if (!isValidDateValue(value)) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
};

export {
  isDateRangeValid,
  isValidDateInput,
  isValidDateValue,
  toDateInputValue
};
