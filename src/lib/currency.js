export const CURRENCIES = [
  { code: "UZS", label: "So'm" },
  { code: "USD", label: "Dollar ($)" },
];

export function formatMoney(amount, currency = "UZS") {
  const n = Number(amount) || 0;

  if (currency === "USD") {
    return `$${n.toLocaleString("en-US")}`;
  }

  return `${n.toLocaleString("uz-UZ")} so'm`;
}
