import { AnalysisStatus } from "@/models/analysis";

export function getAnalysisColor(status: AnalysisStatus) {
  if (status === AnalysisStatus.COMPLETADO) {
    return "bg-green-200 dark:bg-green-800";
  }
  return "bg-gray-200 dark:bg-gray-700";
}
