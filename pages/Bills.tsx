
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface BillItem {
  id: string;
  type: 'electricity' | 'room' | 'water';
  title: string;
  amount: number;
  amountDisplay: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'paid';
  icon: string;
}

const Bills: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'unpaid' | 'paid' | 'overdue'>('unpaid');
  const [selectedBills, setSelectedBills] = useState<string[]>([]);

  // Mock Data
  const allBills: BillItem[] = [
    {
      id: '1',
      type: 'electricity',
      title: 'Tiền điện tháng 10/2023',
      amount: 500000,
      amountDisplay: '500.000 VND',
      dueDate: '25/10/2023',
      status: 'overdue',
      icon: 'electric_bolt'
    },
    {
      id: '2',
      type: 'room',
      title: 'Tiền phòng tháng 11/2023',
      amount: 2500000,
      amountDisplay: '2.500.000 VND',
      dueDate: '30/11/2023',
      status: 'pending',
      icon: 'night_shelter'
    },
    {
      id: '3',
      type: 'water',
      title: 'Tiền nước tháng 10/2023',
      amount: 500000,
      amountDisplay: '500.000 VND',
      dueDate: '25/11/2023',
      status: 'pending',
      icon: 'water_drop'
    }
  ];

  // Filter bills based on active tab
  const filteredBills = useMemo(() => {
    if (activeTab === 'overdue') return allBills.filter(b => b.status === 'overdue');
    if (activeTab === 'paid') return allBills.filter(b => b.status === 'paid');
    // 'unpaid' usually includes pending and overdue in many apps, 
    // but based on the UI tabs, we'll group pending and overdue together for 'unpaid' 
    // or just 'pending' if strictly separated. 
    // Let's assume 'unpaid' shows everything not paid.
    return allBills.filter(b => b.status !== 'paid');
  }, [activeTab]);

  const toggleBillSelection = (id: string) => {
    if (selectedBills.includes(id)) {
      setSelectedBills(selectedBills.filter(billId => billId !== id));
    } else {
      setSelectedBills([...selectedBills, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedBills.length === filteredBills.length) {
      setSelectedBills([]);
    } else {
      setSelectedBills(filteredBills.map(b => b.id));
    }
  };

  const totalAmount = useMemo(() => {
    return allBills
      .filter(bill => selectedBills.includes(bill.id))
      .reduce((sum, bill) => sum + bill.amount, 0);
  }, [selectedBills, allBills]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'overdue') {
      return (
        <div className="flex shrink-0 items-center justify-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
          Quá hạn
        </div>
      );
    }
    return (
      <div className="flex shrink-0 items-center justify-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
        Chưa TT
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans pb-36">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-background-light p-4 pb-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-12 shrink-0 items-center justify-start text-slate-800"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">
          Hóa đơn & Thanh toán
        </h1>
        <div className="flex w-12 items-center justify-end">
          {/* Notification icon removed */}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[60px] z-10 bg-background-light px-4 pt-2">
        <div className="flex border-b border-slate-200 justify-between">
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'unpaid' ? 'border-b-primary text-primary' : 'border-b-transparent text-slate-500'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Chưa thanh toán</p>
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'paid' ? 'border-b-primary text-primary' : 'border-b-transparent text-slate-500'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Đã thanh toán</p>
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex flex-1 flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors ${
              activeTab === 'overdue' ? 'border-b-primary text-primary' : 'border-b-transparent text-slate-500'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Quá hạn</p>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col px-4 py-3 gap-3">
        {/* Select All Row */}
        {activeTab !== 'paid' && filteredBills.length > 0 && (
          <div className="flex items-center justify-end">
            <button 
              onClick={toggleSelectAll}
              className="text-sm font-bold leading-normal tracking-[0.015em] text-primary"
            >
              {selectedBills.length === filteredBills.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>
        )}

        {filteredBills.map((bill) => {
          const isSelected = selectedBills.includes(bill.id);
          return (
            <div 
              key={bill.id}
              onClick={() => toggleBillSelection(bill.id)}
              className={`flex items-start gap-4 p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-blue-50 ring-1 ring-primary/50' 
                  : 'bg-white'
              }`}
            >
              {/* Icon & Selection Circle */}
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-primary">
                  <span className="material-symbols-outlined">{bill.icon}</span>
                </div>
                {/* Checkbox Logic */}
                {isSelected ? (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-base font-bold">check</span>
                  </div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full border-2 border-slate-300"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col justify-center">
                <p className="text-base font-medium leading-normal text-slate-900">{bill.title}</p>
                <p className="text-sm font-normal leading-normal text-slate-500">{bill.amountDisplay}</p>
                <p className={`text-sm font-normal leading-normal ${bill.status === 'overdue' ? 'text-red-500' : 'text-slate-500'}`}>
                  Hạn cuối: {bill.dueDate}
                </p>
              </div>

              {/* Status Badge */}
              {getStatusBadge(bill.status)}
            </div>
          );
        })}

        {filteredBills.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2">assignment_turned_in</span>
            <p>Không có hóa đơn nào</p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {selectedBills.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 w-full max-w-md mx-auto rounded-t-2xl bg-white p-4 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-base font-normal leading-normal text-slate-500">
                Tổng tiền ({selectedBills.length} hóa đơn)
              </p>
              <p className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <button 
              onClick={() => navigate('/payment-detail')}
              className="flex h-12 w-full min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-4 text-base font-bold leading-normal text-white hover:bg-primary/90 transition-colors"
            >
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;