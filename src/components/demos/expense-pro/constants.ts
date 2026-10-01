import { Currency, Transaction } from './types';

export const STARTING_BALANCE = 10542.5;
export const DAY = 24 * 60 * 60 * 1000;
export const STORAGE_KEY = 'expense-pro-demo-v2';

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1, digits: 2 },
  { code: 'EUR', symbol: '€', rate: 0.92, digits: 2 },
  { code: 'GBP', symbol: '£', rate: 0.79, digits: 2 },
  { code: 'INR', symbol: '₹', rate: 83.45, digits: 2 },
  { code: 'JPY', symbol: '¥', rate: 151.2, digits: 0 }
];

export const CATEGORIES = ['Tech', 'Income', 'Design', 'Food', 'Travel', 'Health', 'Entertainment'];
export const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== 'Income');

/** Full class names so Tailwind can see them. */
export const CATEGORY_DOT: Record<string, string> = {
  Tech: 'bg-indigo-500',
  Income: 'bg-emerald-500',
  Design: 'bg-violet-500',
  Food: 'bg-amber-500',
  Travel: 'bg-sky-500',
  Health: 'bg-rose-500',
  Entertainment: 'bg-fuchsia-500'
};

/** Sample history, dated relative to today so the chart always looks current. */
export const sampleTransactions = (now = Date.now()): Transaction[] => {
  const rows: [number, string, string, number, 'income' | 'expense'][] = [
    [40, 'Client payout', 'Income', 3200, 'income'],
    [38, 'AWS cloud services', 'Tech', 142.5, 'expense'],
    [35, 'Groceries', 'Food', 86.4, 'expense'],
    [33, 'Dribbble Pro', 'Design', 15, 'expense'],
    [30, 'Conference flight', 'Travel', 210, 'expense'],
    [27, 'Stripe payout', 'Income', 2450, 'income'],
    [24, 'GitHub Copilot', 'Tech', 10, 'expense'],
    [21, 'Pharmacy', 'Health', 38.2, 'expense'],
    [18, 'Team lunch', 'Food', 42.75, 'expense'],
    [14, 'Figma subscription', 'Design', 15, 'expense'],
    [10, 'Cinema', 'Entertainment', 24, 'expense'],
    [7, 'Domain renewal', 'Tech', 18, 'expense'],
    [3, 'AWS cloud services', 'Tech', 148.2, 'expense'],
    [1, 'Client payout', 'Income', 1800, 'income']
  ];
  return rows
    .map(([d, name, cat, amount, type], i) => ({
      id: `seed-${i}`,
      name,
      cat,
      amount,
      type,
      timestamp: now - d * DAY
    }))
    .reverse();
};
