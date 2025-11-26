import { Evidencia } from "./checklist";

export enum AnalysisStatus {
  PENDIENTE = "pendiente",
  PROCESANDO = "procesando",
  COMPLETADO = "completado",
  ERROR = "error",
}

export interface Prompt {
  _id: string;
  title: string;
  description: string;
  text: string;
  with_references: boolean;
  type: string;
  enabled: boolean;
}

export interface DataEvidencia extends Evidencia {
  itemId?: string;
  replie?: string;
  checkApply?: string;
  area?: string;
}

export interface RuleResult {
  rule_id: string;
  name: string;
  complies: boolean;
  details: string;
  accuraccy: number;
}

export interface ImageResult {
  image: DataEvidencia;
  rule_results: RuleResult[];
}

export interface AnalysisResult {
  _id: string;
  status: AnalysisStatus;
  progress: number;
  total_images: number;
  total_rules: number;
  image_results: ImageResult[];
  createdAt: string;
  completedAt?: string;
  error?: string;
}
