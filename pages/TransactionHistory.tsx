
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  type: 'room' | 'electricity' | 'water';
  title: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
  month: string; // For grouping
}

const TransactionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'this_month' | 'type'>('all');

  // Mock Data
  const allTransactions: Transaction[] = [
    {
      id: '1',
      type: 'room',
      title: 'Thanh toán tiền phòng',
      date: '15/10/2024',
      amount: '2.500.000đ',
      status: 'paid',
      month: 'Tháng 10, 2024'
    },
    {
      id: '2',
      type: 'electricity',
      title: 'Thanh toán tiền điện',
      date: '12/10/2024',
      amount: '350.000đ',
      status: 'paid',
      month: 'Tháng 10, 2024'
    },
    {
      id: '3',
      type: 'water',
      title: 'Thanh toán tiền nước',
      date: '12/10/2024',
      amount: '120.000đ',
      status: 'pending',
      month: 'Tháng 10, 2024'
    },
    {
      id: '4',
      type: 'room',
      title: 'Thanh toán tiền phòng',
      date: '15/09/2024',
      amount: '2.500.000đ',
      status: 'paid',
      month: 'Tháng 9, 2024'
    }
  ];

  // Logic to simulate filtering for demonstration
  // 'this_month' will show Oct 2024.
  // 'type' is just a placeholder here, let's make it return empty to test empty state if needed, 
  // or just filter by 'electricity' for demo.
  const filteredTransactions = allTransactions.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'this_month') return t.month === 'Tháng 10, 2024';
    if (filter === 'type') return false; // Returns empty to demonstrate empty state
    return true;
  });

  // Group by month
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const month = transaction.month;
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getIconInfo = (type: Transaction['type']) => {
    switch (type) {
      case 'room':
        return { icon: 'bed', bg: 'bg-blue-100', text: 'text-primary' };
      case 'electricity':
        return { icon: 'bolt', bg: 'bg-yellow-100', text: 'text-yellow-600' };
      case 'water':
        return { icon: 'water_drop', bg: 'bg-cyan-100', text: 'text-cyan-600' };
      default:
        return { icon: 'receipt', bg: 'bg-slate-100', text: 'text-slate-600' };
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-start">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">Lịch sử giao dịch</h1>
        <div className="flex h-12 w-12 items-center justify-end">
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </div>

      {/* Chips Filter */}
      <div className="flex gap-3 px-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setFilter('all')}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 transition-colors ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Tất cả</p>
        </button>
        <button 
          onClick={() => setFilter('this_month')}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 transition-colors ${
            filter === 'this_month' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Tháng này</p>
          {filter !== 'this_month' && <span className="material-symbols-outlined text-[20px]">expand_more</span>}
        </button>
        <button 
          onClick={() => setFilter('type')}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-3 transition-colors ${
            filter === 'type' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
          }`}
        >
          <p className="text-sm font-medium leading-normal">Loại hóa đơn (Test Empty)</p>
          {filter !== 'type' && <span className="material-symbols-outlined text-[20px]">expand_more</span>}
        </button>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col gap-2 px-4 flex-1">
        {filteredTransactions.length > 0 ? (
          Object.entries(groupedTransactions).map(([month, transactions]) => (
            <div key={month}>
              {/* Section Header */}
              <h3 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] pt-4 pb-2">
                {month}
              </h3>
              
              <div className="flex flex-col gap-3">
                {transactions.map((item) => {
                  const style = getIconInfo(item.type);
                  return (
                    <div key={item.id} className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${style.bg} ${style.text}`}>
                          <span className="material-symbols-outlined">{style.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-base font-bold leading-normal text-slate-900 line-clamp-1">
                            {item.title}
                          </p>
                          <p className="text-sm font-normal leading-normal text-slate-500 line-clamp-2">
                            {item.date}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-base font-bold leading-normal text-slate-900">
                            {item.amount}
                          </p>
                          <div 
                            className={`mt-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 ${
                              item.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}
                          >
                            <p 
                              className={`text-xs font-bold ${
                                item.status === 'paid' ? 'text-green-700' : 'text-yellow-700'
                              }`}
                            >
                              {item.status === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <span className="material-symbols-outlined text-[40px]">receipt_long</span>
            </div>
            <h4 className="mt-4 text-lg font-bold text-slate-800">Không tìm thấy giao dịch</h4>
            <p className="mt-1 text-sm text-slate-500">
              Không có giao dịch nào phù hợp với bộ lọc của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
