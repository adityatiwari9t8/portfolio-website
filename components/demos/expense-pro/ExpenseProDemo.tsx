import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, CreditCard, DollarSign, PieChart, ArrowUpRight, 
  ArrowDownRight, Zap, Plus, ChevronDown, Coins, Wallet, Activity, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { Transaction, ChartPoint } from './types';
import { STARTING_BALANCE, CURRENCIES, CATEGORIES } from './constants';
import { calculatePrediction } from './utils';

const ExpenseProDemo: React.FC = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [forecast, setForecast] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, mode: 'add' | 'edit', editId?: string}>({ isOpen: false, mode: 'add' });
  const [formData, setFormData] = useState({ name: '', amount: '', cat: 'Tech', type: 'expense' as 'income' | 'expense' });

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', name: 'AWS Cloud Services', cat: 'Tech', amount: 142.50, date: 'Today', timestamp: Date.now(), type: 'expense' },
    { id: '2', name: 'Stripe Payout', cat: 'Income', amount: 2450.00, date: 'Yesterday', timestamp: Date.now() - 86400000, type: 'income' },
    { id: '3', name: 'Github Copilot', cat: 'Tech', amount: 10.00, date: '3 days ago', timestamp: Date.now() - 3 * 86400000, type: 'expense' },
    { id: '4', name: 'Dribbble Pro', cat: 'Design', amount: 15.00, date: 'Last week', timestamp: Date.now() - 7 * 86400000, type: 'expense' },
  ]);

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, STARTING_BALANCE);
  }, [transactions]);

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(t => t.cat === activeTab || (activeTab === 'Income' && t.type === 'income'));

  const handlePredict = () => {
    setIsPredicting(true);
    setForecast(null);
    setChartData([]);
    
    setTimeout(() => {
      const { predictedBalance, newChartData } = calculatePrediction(transactions, STARTING_BALANCE);
      setChartData(newChartData);
      setForecast(predictedBalance);
      setIsPredicting(false);
    }, 1200); 
  };

  const handleClearChart = () => {
    setForecast(null);
    setChartData([]);
  };

  const resetFormAndCharts = () => {
    setFormData({ name: '', amount: '', cat: 'Tech', type: 'expense' });
    setModalConfig({ isOpen: false, mode: 'add' });
    handleClearChart();
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    if (modalConfig.mode === 'add') {
      const tx: Transaction = {
        id: Date.now().toString(),
        name: formData.name,
        amount: parseFloat(formData.amount),
        cat: formData.cat,
        type: formData.type,
        date: 'Just now',
        timestamp: Date.now()
      };
      setTransactions([tx, ...transactions]);
    } else {
      setTransactions(transactions.map(t =>
        t.id === modalConfig.editId
          ? { ...t, name: formData.name, amount: parseFloat(formData.amount), cat: formData.cat, type: formData.type }
          : t
      ));
    }
    resetFormAndCharts();
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    handleClearChart();
    if (modalConfig.isOpen) resetFormAndCharts();
  };

  const openEditModal = (tx: Transaction) => {
    setFormData({ name: tx.name, amount: tx.amount.toString(), cat: tx.cat, type: tx.type });
    setModalConfig({ isOpen: true, mode: 'edit', editId: tx.id });
  };

  const openAddModal = () => {
    setFormData({ name: '', amount: '', cat: 'Tech', type: 'expense' });
    setModalConfig({ isOpen: true, mode: 'add' });
  };

  const formatCurrency = (val: number) => {
    return (val * currency.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {entry.name}: {currency.symbol}{formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-6 space-y-8 md:space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Expense Insight Pro</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Financial orchestration with multi-currency AI forecasting.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group">
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm">
              <Coins className="w-4 h-4 text-amber-500" />
              <select 
                value={currency.code}
                onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                className="bg-transparent text-sm font-bold focus:outline-none appearance-none pr-6 dark:text-white cursor-pointer"
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code} className="dark:bg-slate-800">{c.code} ({c.symbol})</option>)}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-4 pointer-events-none text-slate-400" />
            </div>
          </div>

          {chartData.length > 0 && (
            <button 
              onClick={handleClearChart}
              className="flex-1 md:flex-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
              title="Clear Chart"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={handlePredict}
            disabled={isPredicting}
            className="flex-1 md:flex-none bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Zap className="w-4 h-4 fill-current text-amber-400 md:text-inherit" />
            <span className="text-sm">{isPredicting ? 'Running...' : 'Predict'}</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-[#3d4977] p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Net Liquidity</span>
            </div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter truncate">
              {currency.symbol}{formatCurrency(balance)}
            </div>
            <div className="flex items-center space-x-2 text-green-400 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Vault is healthy</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-lg group hover:border-blue-500/30 transition-all">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-400">
              <PieChart className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">ML Forecast</span>
            </div>
            {isPredicting ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black text-slate-400 animate-pulse tracking-widest uppercase">Computing Regressions...</span>
              </div>
            ) : forecast !== null ? (
              <div className="animate-in zoom-in duration-500">
                <div className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter truncate">
                  {currency.symbol}{formatCurrency(forecast)}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest">Next Month Projection (OLS)</p>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm font-bold text-slate-300 dark:text-slate-600 italic">Run engine to see future trends</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-[#3d4977] dark:text-blue-400">
            <Plus className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-white">New Record</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add an expense or income entry.</p>
          </div>
          <button 
            onClick={openAddModal}
            className="w-full py-3 bg-[#3d4977] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#2d365a] transition-all active:scale-95"
          >
            Create Entry
          </button>
        </div>
      </div>

      {/* CHART SECTION */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center space-x-2 mb-8">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Liquidity Trajectory</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={(value) => `${currency.symbol}${(value * currency.rate).toLocaleString(undefined, { notation: "compact" })}`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  name="Actual Balance"
                  dataKey="balance" 
                  stroke="#3d4977" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3d4977', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  name="OLS Trend"
                  dataKey="trend" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TRANSACTION LIST */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Transaction History</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time update stream</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl overflow-x-auto w-full sm:w-auto">
            {['All', 'Tech', 'Income', 'Food'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === cat ? 'bg-white dark:bg-slate-800 text-[#3d4977] dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
            <div key={t.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors animate-in fade-in slide-in-from-left-4 duration-300 group">
              <div className="flex items-center space-x-4 flex-1 overflow-hidden">
                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center border ${t.type === 'income' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 text-green-600' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                  {t.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight truncate">{t.name}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{t.cat}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{t.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <div className={`text-lg font-black tracking-tight ${t.type === 'income' ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{currency.symbol}{formatCurrency(t.amount)}
                </div>
                <div className="hidden md:flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(t)}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(t.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all"
                  >
                    Delete
                  </button>
                </div>
                {/* Mobile action button (since hover states don't work well on mobile) */}
                <button 
                  className="md:hidden p-2 text-slate-400 hover:text-blue-500"
                  onClick={() => openEditModal(t)}
                >
                  <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                <Plus className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No matching entries</p>
            </div>
          )}
        </div>
      </div>

      {/* UNIFIED MODAL (Add / Edit) */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={resetFormAndCharts} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {modalConfig.mode === 'add' ? 'New Financial Record' : 'Edit Transaction'}
                </h3>
                <button onClick={resetFormAndCharts} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitTransaction} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'expense'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm' : 'text-slate-400'}`}
                    >
                      Expense
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, type: 'income'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.type === 'income' ? 'bg-white dark:bg-slate-800 text-green-500 shadow-sm' : 'text-slate-400'}`}
                    >
                      Income
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Monthly Rent, Freelance Payment"
                      required
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount ({currency.code})</label>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        required
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white font-bold"
                        value={formData.cat}
                        onChange={(e) => setFormData({...formData, cat: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`grid ${modalConfig.mode === 'edit' ? 'grid-cols-2 gap-3' : 'grid-cols-1'}`}>
                  {modalConfig.mode === 'edit' && (
                    <button 
                      type="button"
                      onClick={() => { if (modalConfig.editId) handleDeleteTransaction(modalConfig.editId); }}
                      className="py-5 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                  >
                    {modalConfig.mode === 'add' ? 'Save Transaction' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExpenseProDemo;