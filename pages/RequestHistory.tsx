
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RequestItem {
  id: string;
  code: string;
  title: string;
  status: 'processing' | 'completed' | 'rejected';
  date: string;
}

const RequestHistory: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'processing' | 'completed' | 'rejected'>('all');

  // Mock Data
  const requests: RequestItem[] = [
    {
      id: '1',
      code: '#S12345',
      title: 'Sửa chữa vòi nước',
      status: 'processing',
      date: '12/08/2024'
    },
    {
      id: '2',
      code: '#K67890',
      title: 'Khiếu nại về tiếng ồn',
      status: 'completed',
      date: '10/08/2024'
    },
    {
      id: '3',
      code: '#D11223',
      title: 'Đề xuất lắp thêm máy bán nước',
      status: 'rejected',
      date: '05/08/2024'
    },
    {
      id: '4',
      code: '#D45678',
      title: 'Yêu cầu dọn dẹp hành lang',
      status: 'completed',
      date: '02/08/2024'
    },
    {
      id: '5',
      code: '#M90123',
      title: 'Báo mất thẻ sinh viên',
      status: 'processing',
      date: '01/08/2024'
    },
    {
      id: '6',
      code: '#G45678',
      title: 'Góp ý về thực đơn nhà ăn',
      status: 'rejected',
      date: '28/07/2024'
    }
  ];

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusStyle = (status: RequestItem['status']) => {
    switch (status) {
      case 'processing':
        return { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Đang xử lý' };
      case 'completed':
        return { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Đã hoàn thành' };
      case 'rejected':
        return { bg: 'bg-red-500/10', text: 'text-red-600', label: 'Bị từ chối' };
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/services')}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">Lịch Sử Yêu Cầu</h1>
        <div className="flex items-center">
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </div>

      <main className="flex-1 pb-24">
        {/* Filter Tabs */}
        <div className="sticky top-16 z-10 bg-background-light px-4 pt-4 pb-2">
          <div className="flex h-10 w-full items-center rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-medium transition-all ${
                filter === 'processing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              Đang xử lý
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-medium transition-all ${
                filter === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              Hoàn thành
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`flex h-full flex-1 items-center justify-center rounded-md text-sm font-medium transition-all ${
                filter === 'rejected' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'
              }`}
            >
              Bị từ chối
            </button>
          </div>
        </div>

        {/* Request List */}
        <div className="flex flex-col gap-3 px-4 py-3">
          {filteredRequests.map((req) => {
            const style = getStatusStyle(req.status);
            return (
              <div 
                key={req.id}
                className="flex cursor-pointer flex-col gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-100 transition-all hover:bg-slate-50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 line-clamp-1">{req.title}</span>
                  <div className={`flex items-center justify-center rounded-full px-2.5 py-1 ${style.bg}`}>
                    <p className={`text-xs font-bold ${style.text}`}>{style.label}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span className="font-medium">Mã: {req.code}</span>
                  <span>{req.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="px-4 pt-2 pb-8">
          <button className="flex h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]">
            Xem tất cả
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => navigate('/create-request')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default RequestHistory;
