export function toTitle(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function cleanText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Quitar **texto**
    .replace(/\*(.*?)\*/g, "$1") // Quitar *texto*
    .replace(/^[•\-\*]\s+/gm, "") // Quitar viñetas
    .replace(/\n+/g, " ") // Quitar saltos de línea
    .replace(/\s+/g, " ") // Normalizar espacios
    .trim();
}
