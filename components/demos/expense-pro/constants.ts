import { Currency } from './types';

export const STARTING_BALANCE = 10542.50;

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'INR', symbol: '₹', rate: 83.45 },
  { code: 'JPY', symbol: '¥', rate: 151.20 }
];

export const CATEGORIES = [
  'Tech', 'Income', 'Design', 'Food', 'Travel', 'Health', 'Entertainment'
];