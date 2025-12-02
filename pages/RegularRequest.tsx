
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegularRequest: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center bg-background-light p-4 pb-2 justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/register-accommodation')}
          className="text-slate-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Đăng ký ở
        </h2>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pb-20">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-200 mb-6">
          <span className="material-symbols-outlined text-4xl text-slate-500">calendar_month</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          Chưa tới thời gian đăng ký
        </h3>
        <p className="mt-2 text-slate-500">
          Hệ thống sẽ mở đăng ký vào thời gian dự kiến:
        </p>
        <p className="mt-1 text-slate-600 font-semibold">
          08:00 ngày 20/08/2024
        </p>
      </main>
    </div>
  );
};

export default RegularRequest;
