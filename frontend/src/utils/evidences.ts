import { Complemento, Evidencia, Item } from "@/models/checklist";

export function extractEvidences(complements?: Complemento[]): Evidencia[] {
  return complements?.flatMap((c) => c.evidences || []) || [];
}

export function extractAllEvidences(item: Item): Evidencia[] {
  return [
    ...extractEvidences(item.complements),
    ...(item.response?.listSelected?.flatMap((r) =>
      extractEvidences(r.complements)
    ) || []),
    ...(item.response?.evaluativeOptions?.flatMap((r) =>
      extractEvidences(r.complements)
    ) || []),
  ];
}

export function countEvidences(item: Item, type: number = 1): number {
  return extractAllEvidences(item).filter((img) => img.type === type).length;
}

export function imageSrc(path: string) {
  return "/api/images?path=" + encodeURI(path);
}
