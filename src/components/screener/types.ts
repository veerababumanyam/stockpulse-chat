
export type FilterValue = {
  min?: number;
  max?: number;
  value?: string | number;
};

export type FilterOption = {
  id: string;
  label: string;
  type: 'range' | 'select' | 'date' | 'pine';
  options?: { label: string; value: string }[];
  values?: FilterValue;
};

export type ADRCalculation = {
  adrLen: number;
  close: number;
  high: number;
  low: number;
};
