import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, Coins, Pencil, Plus, RotateCcw, Search, Trash2, TrendingUp, Wallet, X
} from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Transaction, TxType } from './types';
import {
  CATEGORIES, CATEGORY_DOT, CURRENCIES, DAY, EXPENSE_CATEGORIES, STARTING_BALANCE, STORAGE_KEY, sampleTransactions
} from './constants';
import { balanceOf, buildForecast, buildHistory, formatDate, fromDateInput, money, signed, toDateInput } from './utils';
import { useDialog } from '../../../lib/useDialog';

const useIsDark = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const load = (): { transactions: Transaction[]; currency: string } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.transactions) && parsed.transactions.every((t: Transaction) => typeof t.amount === 'number' && typeof t.timestamp === 'number')) {
        return { transactions: parsed.transactions, currency: parsed.currency || 'USD' };
      }
    }
  } catch {
    /* storage unavailable: fall back to the sample data */
  }
  return { transactions: sampleTransactions(), currency: 'USD' };
};

interface FormState {
  name: string;
  amount: string;
  cat: string;
  type: TxType;
  date: string;
}

const card = 'rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900';
const label = 'text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400';
const input =
  'w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-indigo-500 dark:border-white/10 dark:bg-neutral-950 dark:text-white';

const ExpenseProDemo: React.FC = () => {
  const initial = useMemo(load, []);
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [currency, setCurrency] = useState(CURRENCIES.find((c) => c.code === initial.currency) ?? CURRENCIES[0]);
  const [showForecast, setShowForecast] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; id?: string; initialAmount?: string } | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', amount: '', cat: 'Tech', type: 'expense', date: toDateInput(Date.now()) });
  const [error, setError] = useState('');
  const [undo, setUndo] = useState<Transaction | null>(null);
  const undoTimer = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const dark = useIsDark();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, currency: currency.code }));
    } catch {
      /* ignore */
    }
  }, [transactions, currency]);

  useEffect(() => () => { if (undoTimer.current) window.clearTimeout(undoTimer.current); }, []);

  const closeModal = () => {
    setModal(null);
    setError('');
  };
  useDialog(!!modal, closeModal, dialogRef);

  const now = Date.now();
  const sorted = useMemo(() => [...transactions].sort((a, b) => b.timestamp - a.timestamp), [transactions]);
  const balance = useMemo(() => balanceOf(transactions, STARTING_BALANCE), [transactions]);
  const forecast = useMemo(() => buildForecast(transactions, STARTING_BALANCE), [transactions]);
  const history = useMemo(() => buildHistory(transactions, STARTING_BALANCE), [transactions]);
  const chartData = showForecast && forecast ? forecast.chart : forecast ? forecast.chart.filter((p) => p.forecast === undefined) : history;

  const recent = useMemo(() => transactions.filter((t) => t.timestamp >= now - 30 * DAY), [transactions, now]);
  const income30 = recent.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const spend30 = recent.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net30 = income30 - spend30;
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    recent.filter((t) => t.type === 'expense').forEach((t) => m.set(t.cat, (m.get(t.cat) ?? 0) + t.amount));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [recent]);

  const visible = sorted.filter(
    (t) => (filter === 'All' || t.cat === filter) && t.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const fmt = (usd: number) => money(usd, currency);
  const signedFmt = (usd: number) => `${usd < 0 ? '-' : '+'}${currency.symbol}${fmt(Math.abs(usd))}`;

  const openAdd = () => {
    setForm({ name: '', amount: '', cat: 'Tech', type: 'expense', date: toDateInput(Date.now()) });
    setModal({ mode: 'add' });
  };
  const openEdit = (t: Transaction) => {
    const amount = (t.amount * currency.rate).toFixed(currency.digits);
    setForm({ name: t.name, amount, cat: t.cat, type: t.type, date: toDateInput(t.timestamp) });
    setModal({ mode: 'edit', id: t.id, initialAmount: amount });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const entered = Number(form.amount);
    if (!name) return setError('Give the transaction a description.');
    if (!Number.isFinite(entered) || entered <= 0) return setError('Enter an amount greater than zero.');
    const cat = form.type === 'income' ? 'Income' : form.cat;
    const usd = entered / currency.rate;
    const timestamp = fromDateInput(form.date);

    if (modal?.mode === 'edit' && modal.id) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === modal.id
            ? { ...t, name, cat, type: form.type, timestamp, amount: form.amount === modal.initialAmount ? t.amount : usd }
            : t
        )
      );
    } else {
      setTransactions((prev) => [{ id: `tx-${Date.now()}`, name, cat, type: form.type, timestamp, amount: usd }, ...prev]);
    }
    closeModal();
  };

  const remove = (tx: Transaction) => {
    setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    if (modal) closeModal();
    setUndo(tx);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), 6000);
  };
  const restore = () => {
    if (!undo) return;
    setTransactions((prev) => [undo, ...prev]);
    setUndo(null);
  };

  const grid = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const tick = { fontSize: 11, fill: dark ? '#a3a3a3' : '#737373' };

  const Tip = ({ active, payload, label: t }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: number }) => {
    if (!active || !payload?.length || t === undefined) return null;
    return (
      <div className="space-y-1.5 rounded-xl border border-black/5 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-neutral-900">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">{formatDate(t)}</p>
        {payload.filter((p) => typeof p.value === 'number').map((p) => (
          <p key={p.name} className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-white">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}: {currency.symbol}{fmt(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:px-6 md:py-10">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium tracking-[-0.03em] text-neutral-900 dark:text-white md:text-5xl">
            Expense <span className="accent text-[1.1em]">Insight</span> Pro
          </h1>
          <p className="max-w-xl text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
            Track income and expenses in five currencies, and see where the balance is heading with a trend line. Sample data, saved in your browser only.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-neutral-900">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="sr-only">Currency</span>
            <select
              value={currency.code}
              onChange={(e) => setCurrency(CURRENCIES.find((c) => c.code === e.target.value) ?? CURRENCIES[0])}
              className="cursor-pointer bg-transparent text-sm font-semibold text-neutral-900 outline-none dark:text-white"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="text-neutral-900">{c.code} ({c.symbol})</option>
              ))}
            </select>
          </label>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" /> Add transaction
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative space-y-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/80">
              <Wallet className="h-4 w-4" /> Balance
            </p>
            <p className="truncate text-4xl font-semibold tracking-tight">{currency.symbol}{fmt(balance)}</p>
            <p className="text-xs font-medium text-white/85">
              Last 30 days: {signedFmt(net30)} net
            </p>
          </div>
        </div>

        <div className={`${card} p-6`}>
          <p className={`${label} flex items-center gap-2`}><TrendingUp className="h-4 w-4" /> 30-day forecast</p>
          {forecast ? (
            <div className="mt-4 space-y-2">
              <p className={`truncate text-3xl font-semibold tracking-tight ${forecast.predicted < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-white'}`}>
                {forecast.predicted < 0 ? '-' : ''}{currency.symbol}{fmt(Math.abs(forecast.predicted))}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Trend {signedFmt(forecast.slopePerDay)} per day · R² {forecast.r2.toFixed(2)} · from {forecast.samples} transactions
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">Add at least three transactions to fit a trend line.</p>
          )}
        </div>

        <div className={`${card} p-6`}>
          <p className={label}>Last 30 days</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Income</p>
              <p className="truncate text-xl font-semibold text-emerald-600 dark:text-emerald-400">{currency.symbol}{fmt(income30)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Spending</p>
              <p className="truncate text-xl font-semibold text-neutral-900 dark:text-white">{currency.symbol}{fmt(spend30)}</p>
            </div>
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800" aria-hidden>
            <div className="bg-emerald-500" style={{ width: `${income30 + spend30 ? (income30 / (income30 + spend30)) * 100 : 0}%` }} />
            <div className="bg-neutral-500" style={{ width: `${income30 + spend30 ? (spend30 / (income30 + spend30)) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <section className={`${card} p-5 md:p-6`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Balance history</h2>
            <label className={`flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 ${forecast ? '' : 'opacity-40'}`}>
              <input
                type="checkbox"
                checked={showForecast && !!forecast}
                disabled={!forecast}
                onChange={(e) => setShowForecast(e.target.checked)}
                className="h-4 w-4 accent-indigo-600"
              />
              Show trend and forecast
            </label>
          </div>
          <div className="h-[300px] w-full" role="img" aria-label="Line chart of the running balance with a straight-line trend and a 30 day forecast">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={grid} />
                <XAxis
                  dataKey="t"
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(t: number) => formatDate(t)}
                  tick={tick}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={40}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={tick}
                  width={64}
                  domain={['auto', 'auto']}
                  tickFormatter={(v: number) => `${currency.symbol}${(v * currency.rate).toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })}`}
                />
                <Tooltip content={<Tip />} />
                <Line type="stepAfter" name="Balance" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} isAnimationActive={false} />
                {showForecast && forecast && (
                  <Line type="linear" name="Trend" dataKey="trend" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} isAnimationActive={false} />
                )}
                {showForecast && forecast && (
                  <Line type="linear" name="Forecast" dataKey="forecast" stroke="none" dot={{ r: 5, fill: '#10b981', stroke: dark ? '#171717' : '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            The trend is a least-squares straight line through the balance after each transaction. It is a rough extrapolation, not financial advice, and exchange rates here are fixed sample values rather than live ones.
          </p>
        </section>

        <section className={`${card} p-5 md:p-6`}>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Spending by category</h2>
          <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">Last 30 days</p>
          {byCategory.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No spending in the last 30 days.</p>
          ) : (
            <ul className="space-y-3">
              {byCategory.map(([cat, amount]) => (
                <li key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-neutral-800 dark:text-neutral-100">
                      <i className={`h-2 w-2 rounded-full ${CATEGORY_DOT[cat] ?? 'bg-neutral-400'}`} /> {cat}
                    </span>
                    <span className="tabular-nums text-neutral-600 dark:text-neutral-300">{currency.symbol}{fmt(amount)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <div className={`h-full rounded-full ${CATEGORY_DOT[cat] ?? 'bg-neutral-400'}`} style={{ width: `${(amount / spend30) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className={`${card} overflow-hidden`}>
        <div className="space-y-4 border-b border-black/5 p-5 dark:border-white/10 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Transactions</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{visible.length} of {transactions.length} shown</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by description"
                aria-label="Search transactions"
                className={`${input} py-2.5 pl-9`}
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filter === c
                    ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950'
                    : 'border-black/10 text-neutral-600 hover:border-indigo-400 dark:border-white/10 dark:text-neutral-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {visible.length ? (
          <ul className="divide-y divide-black/5 dark:divide-white/10">
            {visible.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.03] md:px-6">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-neutral-400'}`}>
                  {t.type === 'income' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <i className={`h-1.5 w-1.5 rounded-full ${CATEGORY_DOT[t.cat] ?? 'bg-neutral-400'}`} /> {t.cat} · {formatDate(t.timestamp)}
                  </p>
                </div>
                <p className={`shrink-0 text-sm font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-white'}`}>
                  {signedFmt(signed(t))}
                </p>
                <div className="flex shrink-0 items-center">
                  <button onClick={() => openEdit(t)} aria-label={`Edit ${t.name}`} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-indigo-600 dark:hover:bg-white/10 dark:hover:text-indigo-400">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(t)} aria-label={`Delete ${t.name}`} className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-rose-600 dark:hover:bg-white/10 dark:hover:text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-12 text-center text-sm text-neutral-500 dark:text-neutral-400">No transactions match.</p>
        )}

        <div className="border-t border-black/5 p-4 text-right dark:border-white/10">
          <button
            onClick={() => { setTransactions(sampleTransactions()); setFilter('All'); setQuery(''); }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset to sample data
          </button>
        </div>
      </section>

      {undo && (
        <div role="status" className="fixed bottom-5 left-1/2 z-[130] flex -translate-x-1/2 items-center gap-4 rounded-xl bg-neutral-950 px-4 py-3 text-sm text-white shadow-xl dark:bg-white dark:text-neutral-950">
          <span className="max-w-[14rem] truncate">Deleted {undo.name}</span>
          <button onClick={restore} className="font-semibold underline underline-offset-4">Undo</button>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm" onClick={closeModal} />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tx-title"
            tabIndex={-1}
            className="relative w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-2xl outline-none dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 id="tx-title" className="text-xl font-semibold text-neutral-900 dark:text-white">
                {modal.mode === 'add' ? 'New transaction' : 'Edit transaction'}
              </h3>
              <button onClick={closeModal} aria-label="Close" className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-950">
                {(['expense', 'income'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={form.type === type}
                    onClick={() => setForm({ ...form, type, cat: type === 'income' ? 'Income' : form.cat === 'Income' ? 'Tech' : form.cat })}
                    className={`rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                      form.type === type ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white' : 'text-neutral-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tx-name" className={label}>Description</label>
                <input id="tx-name" data-autofocus maxLength={60} className={input} placeholder="e.g. Freelance payment" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="tx-amount" className={label}>Amount ({currency.code})</label>
                  <input id="tx-amount" type="number" inputMode="decimal" step="any" min="0" className={input} placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="tx-cat" className={label}>Category</label>
                  {form.type === 'income' ? (
                    <div className={`${input} text-neutral-500`}>Income</div>
                  ) : (
                    <select id="tx-cat" className={input} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                      {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tx-date" className={label}>Date</label>
                <input id="tx-date" type="date" max={toDateInput(Date.now())} className={input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>

              {error && <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>}

              <div className="flex gap-3 pt-1">
                {modal.mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => { const tx = transactions.find((t) => t.id === modal.id); if (tx) remove(tx); }}
                    className="rounded-xl border border-rose-500/40 px-4 py-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className="flex-1 rounded-xl bg-neutral-950 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
                  {modal.mode === 'add' ? 'Save transaction' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseProDemo;
