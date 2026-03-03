import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, TrendingUp, TrendingDown, Plus, CreditCard, Wallet, Calendar } from 'lucide-react';

const Ledger = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-03-01', description: 'Urea Fertilizer 50kg', category: 'Input', type: 'Expense', amount: 1500 },
    { id: 2, date: '2024-03-05', description: 'Tractor Rental (4 hrs)', category: 'Equipment', type: 'Expense', amount: 3200 },
    { id: 3, date: '2024-03-15', description: 'Sold 10 qtl Wheat to APMC', category: 'Sales', type: 'Income', amount: 22500 },
    { id: 4, date: '2024-03-20', description: 'Pesticide Spraying Labor', category: 'Labor', type: 'Expense', amount: 900 }
  ]);

  const [form, setForm] = useState({ description: '', amount: '', type: 'Expense', category: 'Input' });

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const newTx = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...form,
      amount: parseFloat(form.amount)
    };
    setTransactions([newTx, ...transactions]);
    setForm({ description: '', amount: '', type: 'Expense', category: 'Input' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Wallet color="#6366f1" /> Farm Ledger & ERP
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Track inputs, labor, equipment, and crop sales to calculate exact ROI.</p>
      </div>

      {/* Financial Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={16} /> Total Revenue (Sales)</p>
           <h2 style={{ fontSize: '2rem', color: '#10b981' }}>₹{totalIncome.toLocaleString()}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingDown size={16} /> Total Expenses (Inputs)</p>
           <h2 style={{ fontSize: '2rem', color: '#ef4444' }}>₹{totalExpense.toLocaleString()}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${netProfit >= 0 ? '#6366f1' : '#f59e0b'}`, background: netProfit >= 0 ? 'rgba(99,102,241,0.05)' : 'rgba(245,158,11,0.05)' }}>
           <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><IndianRupee size={16} /> Net Season Profit</p>
           <h2 style={{ fontSize: '2rem', color: netProfit >= 0 ? 'white' : '#facc15' }}>{netProfit >= 0 ? '+' : '-'}₹{Math.abs(netProfit).toLocaleString()}</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem' }}>
        {/* Add Transaction Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={20} /> Add Entry</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="Expense">Expense (-)</option>
                <option value="Income">Income (+)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {form.type === 'Expense' ? (
                  <>
                    <option value="Input">Seeds/Fertilizer (Input)</option>
                    <option value="Labor">Labor</option>
                    <option value="Equipment">Equipment/Machinery</option>
                    <option value="Logistics">Transport</option>
                  </>
                ) : (
                  <>
                    <option value="Sales">Crop Sales</option>
                    <option value="Subsidy">Govt Subsidy</option>
                    <option value="Other">Other Revenue</option>
                  </>
                )}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" placeholder="e.g. 5 bags of Urea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" className="form-input" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Record Entry</button>
          </form>
        </div>

        {/* Transaction History Table */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} /> Season Ledger</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Description</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <motion.tr 
                  key={tx.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{tx.date}</td>
                  <td style={{ padding: '1rem' }}>{tx.description}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      background: tx.type === 'Income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tx.type === 'Income' ? '#10b981' : '#ef4444'
                    }}>
                      {tx.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'Income' ? '#10b981' : 'white' }}>
                    {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Ledger;
