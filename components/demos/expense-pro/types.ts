export interface Transaction {
  id: string;
  name: string;
  cat: string;
  amount: number;
  date: string;
  timestamp: number;
  type: 'income' | 'expense';
}

export interface ChartPoint {
  date: string;
  balance: number | null;
  trend: number | null;
}

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}