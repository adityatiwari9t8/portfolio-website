import { Transaction, ChartPoint } from './types';

export const calculatePrediction = (transactions: Transaction[], baseBalance: number) => {
  if (transactions.length < 2) return { predictedBalance: baseBalance, newChartData: [] };

  const sortedTx = [...transactions].sort((a, b) => a.timestamp - b.timestamp);
  const t0 = sortedTx[0].timestamp;
  const data: { x: number, y: number }[] = [];
  let runningBalance = baseBalance;
  
  data.push({ x: 0, y: runningBalance });
  
  sortedTx.forEach(tx => {
    runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
    const daysFromStart = (tx.timestamp - t0) / (1000 * 60 * 60 * 24);
    data.push({ x: daysFromStart, y: runningBalance });
  });

  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  
  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumXX += data[i].x * data[i].x;
  }

  const denominator = (n * sumXX) - (sumX * sumX);
  const m = denominator === 0 ? 0 : ((n * sumXY) - (sumX * sumY)) / denominator;
  const b = (sumY - m * sumX) / n;

  const targetDaysFromStart = (Date.now() + (30 * 24 * 60 * 60 * 1000) - t0) / (1000 * 60 * 60 * 24);
  const predictedBalance = Math.max(0, (m * targetDaysFromStart) + b);

  const newChartData: ChartPoint[] = data.map((point, index) => ({
    date: index === 0 ? 'Start' : new Date(t0 + point.x * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    balance: point.y,
    trend: (m * point.x) + b
  }));

  newChartData.push({
    date: '30d Forecast',
    balance: null,
    trend: predictedBalance
  });

  return { predictedBalance, newChartData };
};