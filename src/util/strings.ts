export function title(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function moneyRegex(value: string) {
  value = value.replace(/[^0-9.]/g, "");

  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  if (parts[1]) {
    value = parts[0] + "." + parts[1].slice(0, 2);
  }

  return value;
}