
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap, 
  Plus, 
  ChevronDown,
  Coins,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: string;
  name: string;
  cat: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'INR', symbol: '₹', rate: 83.45 },
  { code: 'JPY', symbol: '¥', rate: 151.20 }
];

const CATEGORIES = ['Tech', 'Income', 'Design', 'Food', 'Travel', 'Health', 'Entertainment'];

const ExpenseProDemo: React.FC = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [forecast, setForecast] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Transaction State
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', name: 'AWS Cloud Services', cat: 'Tech', amount: 142.50, date: 'Today', type: 'expense' },
    { id: '2', name: 'Stripe Payout', cat: 'Income', amount: 2450.00, date: 'Yesterday', type: 'income' },
    { id: '3', name: 'Github Copilot', cat: 'Tech', amount: 10.00, date: '3 days ago', type: 'expense' },
    { id: '4', name: 'Dribbble Pro', cat: 'Design', amount: 15.00, date: 'Last week', type: 'expense' },
  ]);

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    name: '',
    amount: '',
    cat: 'Tech',
    type: 'expense' as 'income' | 'expense'
  });

  // Edit Transaction Form State
  const [editTx, setEditTx] = useState({
    name: '',
    amount: '',
    cat: 'Tech',
    type: 'expense' as 'income' | 'expense'
  });

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
    }, 10542.50); // Starting base balance for demo
  }, [transactions]);

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(t => t.cat === activeTab || (activeTab === 'Income' && t.type === 'income'));

  const handlePredict = () => {
    setIsPredicting(true);
    setForecast(null);
    setTimeout(() => {
      setForecast(balance + (balance * 0.15));
      setIsPredicting(false);
    }, 2000);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.name || !newTx.amount) return;

    const tx: Transaction = {
      id: Date.now().toString(),
      name: newTx.name,
      amount: parseFloat(newTx.amount),
      cat: newTx.cat,
      type: newTx.type,
      date: 'Just now'
    };

    setTransactions([tx, ...transactions]);
    setNewTx({ name: '', amount: '', cat: 'Tech', type: 'expense' });
    setShowAddForm(false);
    setForecast(null);
  };

  const handleEditTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTx.name || !editTx.amount) return;

    setTransactions(transactions.map(t =>
      t.id === editingId
        ? { ...t, name: editTx.name, amount: parseFloat(editTx.amount), cat: editTx.cat, type: editTx.type }
        : t
    ));
    setEditingId(null);
    setShowEditForm(false);
    setForecast(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setForecast(null);
  };

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditTx({
      name: tx.name,
      amount: tx.amount.toString(),
      cat: tx.cat,
      type: tx.type
    });
    setShowEditForm(true);
  };

  const formatCurrency = (val: number) => {
    return (val * currency.rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-16 px-4 md:px-6 space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Expense Insight Pro</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">Financial orchestration with multi-currency AI forecasting.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Currency Selector */}
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

          <button 
            onClick={handlePredict}
            className="flex-1 md:flex-none bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:scale-105 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current text-amber-400 md:text-inherit" />
            <span className="text-sm">Predict</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Balance Card */}
        <div className="bg-[#3d4977] p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-2 text-slate-300">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Net Liquidity</span>
            </div>
            <div className="text-4xl md:text-5xl font-black tracking-tighter">
              {currency.symbol}{formatCurrency(balance)}
            </div>
            <div className="flex items-center space-x-2 text-green-400 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Vault is healthy</span>
            </div>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-lg group hover:border-blue-500/30 transition-all">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-400">
              <PieChart className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">AI Forecast</span>
            </div>
            {isPredicting ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-[10px] font-black text-slate-400 animate-pulse tracking-widest uppercase">Crunching Data...</span>
              </div>
            ) : forecast ? (
              <div className="animate-in zoom-in duration-500">
                <div className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter">
                  {currency.symbol}{formatCurrency(forecast)}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest">Next Month Projection</p>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm font-bold text-slate-300 dark:text-slate-600 italic">Run engine to see future trends</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-[#3d4977] dark:text-blue-400">
            <Plus className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 dark:text-white">New Record</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add an expense or income entry.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 bg-[#3d4977] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#2d365a] transition-all active:scale-95"
          >
            Create Entry
          </button>
        </div>
      </div>

      {/* Modal / Form for New Transaction */}
      {showAddForm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">New Financial Record</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setNewTx({...newTx, type: 'expense'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newTx.type === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm' : 'text-slate-400'}`}
                    >
                      Expense
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewTx({...newTx, type: 'income'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newTx.type === 'income' ? 'bg-white dark:bg-slate-800 text-green-500 shadow-sm' : 'text-slate-400'}`}
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
                      value={newTx.name}
                      onChange={(e) => setNewTx({...newTx, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount ({currency.code})</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        required
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                        value={newTx.amount}
                        onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white font-bold"
                        value={newTx.cat}
                        onChange={(e) => setNewTx({...newTx, cat: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                >
                  Save Transaction
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Transaction History</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time update stream</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {['All', 'Tech', 'Income', 'Food'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === cat ? 'bg-white dark:bg-slate-800 text-[#3d4977] dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {filteredTransactions.length > 0 ? filteredTransactions.map((t) => (
            <div key={t.id} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors animate-in fade-in slide-in-from-left-4 duration-300 group">
              <div className="flex items-center space-x-4 flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${t.type === 'income' ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20 text-green-600' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                  {t.type === 'income' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight">{t.name}</h4>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{t.cat}</span>
                    <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
                    <span className="text-[10px] font-bold text-slate-400">{t.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`text-lg font-black tracking-tight ${t.type === 'income' ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                  {t.type === 'income' ? '+' : '-'}{currency.symbol}{formatCurrency(t.amount)}
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(t)}
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

      {/* Modal / Form for Editing Transaction */}
      {showEditForm && editingId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => { setShowEditForm(false); setEditingId(null); }} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Edit Transaction</h3>
                <button onClick={() => { setShowEditForm(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleEditTransaction} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => setEditTx({...editTx, type: 'expense'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${editTx.type === 'expense' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-sm' : 'text-slate-400'}`}
                    >
                      Expense
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditTx({...editTx, type: 'income'})}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${editTx.type === 'income' ? 'bg-white dark:bg-slate-800 text-green-500 shadow-sm' : 'text-slate-400'}`}
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
                      value={editTx.name}
                      onChange={(e) => setEditTx({...editTx, name: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Amount ({currency.code})</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        required
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
                        value={editTx.amount}
                        onChange={(e) => setEditTx({...editTx, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white font-bold"
                        value={editTx.cat}
                        onChange={(e) => setEditTx({...editTx, cat: e.target.value})}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => { setShowEditForm(false); setEditingId(null); handleDeleteTransaction(editingId); }}
                    className="py-5 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95"
                  >
                    Delete
                  </button>
                  <button 
                    type="submit"
                    className="py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 px-6 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />)}
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Used by 2.4k users globally</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseProDemo;
