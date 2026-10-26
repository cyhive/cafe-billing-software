import React, { useMemo, useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { MENU_CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/format';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Banknote,
  QrCode,
  Download,
  Calendar,
  Layers,
  Award,
  Receipt,
} from 'lucide-react';
import { formatDateTime } from '../utils/format';

export const SalesReports: React.FC = () => {
  const { bills, settings } = useBilling();
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const today = new Date();
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const selectedBills = useMemo(() => bills.filter((bill) => {
    const d = new Date(bill.createdAt);
    return dateKey(d) === selectedDate && bill.status !== 'cancelled';
  }), [bills, selectedDate]);
  const todayStats = {
    revenue: selectedBills.reduce((sum, bill) => sum + bill.total, 0),
    orderCount: selectedBills.length,
    cashTotal: selectedBills.filter((b) => b.paymentMethod === 'cash').reduce((sum, b) => sum + b.total, 0),
    cardTotal: selectedBills.filter((b) => b.paymentMethod === 'card').reduce((sum, b) => sum + b.total, 0),
    upiTotal: selectedBills.filter((b) => b.paymentMethod === 'upi').reduce((sum, b) => sum + b.total, 0),
    itemsSold: selectedBills.reduce((sum, b) => sum + b.items.reduce((n, item) => n + item.quantity, 0), 0),
  };

  // Aggregate Category Breakdown
  const categoryStats: Record<string, { count: number; revenue: number }> = {};
  MENU_CATEGORIES.forEach((cat) => {
    categoryStats[cat.id] = { count: 0, revenue: 0 };
  });

  // Aggregate Top Selling Items
  const itemCounts: Record<string, { name: string; qty: number; revenue: number }> = {};

  selectedBills.forEach((bill) => {
    bill.items.forEach((item) => {
      // Category
      const cat = item.category || 'other';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, revenue: 0 };
      }
      categoryStats[cat].count += item.quantity;
      categoryStats[cat].revenue += item.unitPrice * item.quantity;

      // Item
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemCounts[item.name].qty += item.quantity;
      itemCounts[item.name].revenue += item.unitPrice * item.quantity;
    });
  });

  const topItems = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const averageTicket =
    todayStats.orderCount > 0 ? todayStats.revenue / todayStats.orderCount : 0;

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'Order Number',
      'Token',
      'Date Time',
      'Type',
      'Table',
      'Customer',
      'Items Count',
      'Payment Method',
      'Subtotal',
      'Tax',
      'Discount',
      'Total',
    ];

    const rows = selectedBills.map((b) => [
      b.orderNumber,
      b.tokenNumber,
      b.createdAt,
      b.orderType,
      b.tableNumber || '',
      b.customerName || '',
      b.items.reduce((s, i) => s + i.quantity, 0),
      b.paymentMethod,
      b.subtotal.toFixed(2),
      b.taxAmount.toFixed(2),
      b.discountAmount.toFixed(2),
      b.total.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NU_Cafe_Sales_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categoryLabels: Record<string, { label: string; icon: string }> = Object.fromEntries(
    MENU_CATEGORIES.map((cat) => [cat.id, { label: cat.label, icon: cat.icon }])
  );

  return (
    <div className="w-full min-w-0 p-3 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-lg font-bold text-white">Shift & Daily Sales Analytics</h1>
          <p className="text-xs text-neutral-400">
            Real-time revenue metrics, register reconciliation and sales breakdowns
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl border border-neutral-800 text-xs font-semibold transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Shift sales for {new Date(`${selectedDate}T12:00:00`).toLocaleDateString()}</h2>
          <p className="text-xs text-neutral-500">Choose a day to view its sales, breakdowns and settled bills.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setSelectedDate(dateKey(today))} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${selectedDate === dateKey(today) ? 'bg-amber-500 text-neutral-950 border-amber-500' : 'bg-neutral-900 text-neutral-300 border-neutral-800'}`}>Today</button>
          <button onClick={() => setSelectedDate(dateKey(yesterday))} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${selectedDate === dateKey(yesterday) ? 'bg-amber-500 text-neutral-950 border-amber-500' : 'bg-neutral-900 text-neutral-300 border-neutral-800'}`}>Yesterday</button>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-300">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Date</span>
            <input aria-label="Select sales date" type="date" value={selectedDate} onChange={(e) => e.target.value && setSelectedDate(e.target.value)} className="bg-transparent text-white [color-scheme:dark] outline-none" />
          </label>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Today Revenue */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Selected Day Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(todayStats.revenue, settings.currencySymbol)}
          </div>
          <p className="text-[11px] text-neutral-500">Gross billing counter revenue</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Orders Settled</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {todayStats.orderCount}
          </div>
          <p className="text-[11px] text-neutral-500">
            {todayStats.itemsSold} food & beverage items sold
          </p>
        </div>

        {/* Average Ticket Size */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(averageTicket, settings.currencySymbol)}
          </div>
          <p className="text-[11px] text-neutral-500">Per customer ticket average</p>
        </div>

        {/* Shift Cash in Drawer */}
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Cash in Drawer</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(todayStats.cashTotal, settings.currencySymbol)}
          </div>
          <p className="text-[11px] text-neutral-500">Physical currency to reconcile</p>
        </div>
      </div>

      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2"><Receipt className="w-4 h-4 text-amber-400" />Bills for this day <span className="text-neutral-500 font-normal">({selectedBills.length})</span></h3>
        {selectedBills.length === 0 ? <p className="py-5 text-center text-xs text-neutral-500">No settled bills for this day.</p> : <div className="space-y-2">
          {[...selectedBills].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((bill) => <div key={bill.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-xs">
            <div><span className="font-bold text-amber-400">T-{bill.tokenNumber} · #{bill.orderNumber}</span><span className="ml-3 text-neutral-400">{formatDateTime(bill.createdAt)}</span><span className="ml-3 capitalize text-neutral-500">{bill.orderType} · {bill.paymentMethod}</span></div>
            <span className="font-mono font-bold text-white">{formatCurrency(bill.total, settings.currencySymbol)}</span>
          </div>)}
        </div>}
      </div>

      {/* Payment Modes Split & Top Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Modes Breakdown */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Payment Modes Reconciliation</span>
          </h3>

          <div className="space-y-3">
            {/* Cash */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Cash Payments</div>
                  <div className="text-[10px] text-neutral-500">Physical currency</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-emerald-400 tabular-nums">
                {formatCurrency(todayStats.cashTotal, settings.currencySymbol)}
              </div>
            </div>

            {/* Card */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Card / POS Terminal</div>
                  <div className="text-[10px] text-neutral-500">Swipe & Tap</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-blue-400 tabular-nums">
                {formatCurrency(todayStats.cardTotal, settings.currencySymbol)}
              </div>
            </div>

            {/* UPI */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">UPI / QR Code</div>
                  <div className="text-[10px] text-neutral-500">Instant digital transfers</div>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-sm text-amber-400 tabular-nums">
                {formatCurrency(todayStats.upiTotal, settings.currencySymbol)}
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Bestsellers */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Top Performing Items</span>
          </h3>

          <div className="space-y-2.5">
            {topItems.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No sales recorded yet.</p>
            ) : (
              topItems.map((item, idx) => (
                <div
                  key={item.name}
                  className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-mono font-bold text-xs text-neutral-500">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        {item.qty} units served
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs font-bold text-white tabular-nums">
                    {formatCurrency(item.revenue, settings.currencySymbol)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Category-Wise Breakdown</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Object.entries(categoryStats).map(([key, data]) => {
            const config = categoryLabels[key] || { label: key, icon: '🍽️' };
            return (
              <div
                key={key}
                className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                  <span className="text-base">{config.icon}</span>
                  <span className="font-semibold truncate">{config.label}</span>
                </div>
                <div className="text-base font-bold font-mono text-white tabular-nums">
                  {formatCurrency(data.revenue, settings.currencySymbol)}
                </div>
                <div className="text-[10px] font-mono text-neutral-500">
                  {data.count} items sold
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
