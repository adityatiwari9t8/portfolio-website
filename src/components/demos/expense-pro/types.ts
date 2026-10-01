export type TxType = 'income' | 'expense';

export interface Transaction {
  id: string;
  name: string;
  cat: string;
  /** Always stored in USD; shown in whichever currency is selected. */
  amount: number;
  timestamp: number;
  type: TxType;
}

export interface Currency {
  code: string;
  symbol: string;
  /** Fixed sample rate against USD, not a live rate. */
  rate: number;
  digits: number;
}

export interface ChartPoint {
  t: number;
  balance?: number;
  trend?: number;
  forecast?: number;
}

export interface Forecast {
  predicted: number;
  slopePerDay: number;
  r2: number;
  samples: number;
  chart: ChartPoint[];
}
