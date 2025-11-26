export interface Evidencia {
  type: number;
  path: string;
  id: string;
  name: string;
}

export interface Complemento {
  nombre: string;
  enable: boolean;
  evidences: Evidencia[];
}

export interface ListResponse {
  id?: string;
  name?: string;
  complements?: Complemento[];
}

export interface Item {
  id: string;
  type: string;
  description: string;
  complements?: Complemento[];
  response?: {
    evaluativeOptions?: ListResponse[];
    listSelected?: ListResponse[];
  };
}

export interface Area {
  id?: string;
  name: string;
  description?: string;
  items: Item[];
}

export interface Checklist {
  _id: string;
  status: string;
  title: string;
  dateApplyed: string;
  checkApply: string;
  areas: Area[];
}

export interface Form {
  _id: string;
  title: string;
  areas: Area[];
  expanded: boolean;
}

export interface Filtro {
  inicio: string;
  final: string;
  tiendas: string;
  grupos: string;
}

export interface UnitType {
  _id: string;
  name: string;
  enable: boolean;
}

export interface Unit extends UnitType {
  typeUnity: string;
  storeCode: string;
  email: string;
}

export interface ItemSelection extends Item {
  replie?: string;
  checkApply: string;
  area: string;
}
