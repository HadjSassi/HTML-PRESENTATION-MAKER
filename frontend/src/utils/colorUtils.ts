const HEX_3 = /^#([0-9a-f]{3})$/i;
const HEX_6 = /^#([0-9a-f]{6})$/i;

function expandHex3(hex: string): string {
  return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
}

export function normalizeHexColor(color: string | undefined): string {
  if (!color) return "#000000";
  const v = color.trim();
  if (HEX_6.test(v)) return v.toLowerCase();
  if (HEX_3.test(v)) return expandHex3(v).toLowerCase();
  return "#000000";
}

export function inverseHexColor(color: string | undefined): string {
  const hex = normalizeHexColor(color);
  const r = 255 - Number.parseInt(hex.slice(1, 3), 16);
  const g = 255 - Number.parseInt(hex.slice(3, 5), 16);
  const b = 255 - Number.parseInt(hex.slice(5, 7), 16);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
