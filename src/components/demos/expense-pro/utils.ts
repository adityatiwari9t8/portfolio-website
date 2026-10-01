import { ChartPoint, Currency, Forecast, Transaction } from './types';
import { DAY } from './constants';

export const signed = (t: Transaction) => (t.type === 'income' ? t.amount : -t.amount);

export const balanceOf = (txs: Transaction[], start: number) => txs.reduce((acc, t) => acc + signed(t), start);

export const money = (usd: number, c: Currency) =>
  (usd * c.rate).toLocaleString(undefined, { minimumFractionDigits: c.digits, maximumFractionDigits: c.digits });

export const formatDate = (ts: number) => {
  const d = new Date(ts);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, sameYear ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' });
};

export const toDateInput = (ts: number) => {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

/** Noon of the chosen day, but never later than now. */
export const fromDateInput = (value: string, now = Date.now()) => {
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return now;
  return Math.min(new Date(y, m - 1, d, 12).getTime(), now);
};

/**
 * Least-squares straight line through the running balance, projected 30 days past `now`.
 * Needs at least three transactions; fewer points say nothing about a trend.
 */
export const buildForecast = (transactions: Transaction[], startBalance: number, now = Date.now()): Forecast | null => {
  if (transactions.length < 3) return null;

  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  const t0 = sorted[0].timestamp - DAY;

  const pts: { t: number; x: number; y: number }[] = [{ t: t0, x: 0, y: startBalance }];
  let running = startBalance;
  for (const tx of sorted) {
    running += signed(tx);
    pts.push({ t: tx.timestamp, x: (tx.timestamp - t0) / DAY, y: running });
  }

  const n = pts.length;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
    sxy += p.x * p.y;
    sxx += p.x * p.x;
  }
  const den = n * sxx - sx * sx;
  const m = den === 0 ? 0 : (n * sxy - sx * sy) / den;
  const b = (sy - m * sx) / n;

  const meanY = sy / n;
  let ssTot = 0, ssRes = 0;
  for (const p of pts) {
    ssTot += (p.y - meanY) ** 2;
    ssRes += (p.y - (m * p.x + b)) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  const horizon = now + 30 * DAY;
  const xHorizon = (horizon - t0) / DAY;
  const predicted = m * xHorizon + b;
  const xNow = (now - t0) / DAY;

  const chart: ChartPoint[] = pts.map((p) => ({ t: p.t, balance: p.y, trend: m * p.x + b }));
  if (now > pts[pts.length - 1].t) chart.push({ t: now, balance: running, trend: m * xNow + b });
  chart.push({ t: horizon, trend: predicted, forecast: predicted });

  return { predicted, slopePerDay: m, r2, samples: sorted.length, chart };
};

/** Balance history only, for when there is not enough data to forecast. */
export const buildHistory = (transactions: Transaction[], startBalance: number, now = Date.now()): ChartPoint[] => {
  const sorted = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  if (!sorted.length) return [];
  const out: ChartPoint[] = [{ t: sorted[0].timestamp - DAY, balance: startBalance }];
  let running = startBalance;
  for (const tx of sorted) {
    running += signed(tx);
    out.push({ t: tx.timestamp, balance: running });
  }
  out.push({ t: now, balance: running });
  return out;
};
