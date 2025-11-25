import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'manager'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'manager') {
      navigate('/manager-home');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-6">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"></path>
          </svg>
        </div>

        <h1 className="pb-2 text-center text-[32px] font-bold leading-tight text-slate-900">
          Chào mừng trở lại
        </h1>
        <p className="pb-8 text-center text-base font-normal text-slate-600">
          Đăng nhập để tiếp tục quản lý ký túc xá.
        </p>

        {/* Tabs */}
        <div className="mb-6 grid w-full grid-cols-2 gap-1 rounded-lg bg-slate-200 p-1">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex h-10 items-center justify-center rounded-md text-sm font-semibold transition-all ${
              activeTab === 'student'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:bg-slate-300/50'
            }`}
          >
            Tài khoản sinh viên
          </button>
          <button
            onClick={() => setActiveTab('manager')}
            className={`flex h-10 items-center justify-center rounded-md text-sm font-semibold transition-all ${
              activeTab === 'manager'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-600 hover:bg-slate-300/50'
            }`}
          >
            Tài khoản quản lý
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-base font-medium text-slate-800">
              {activeTab === 'manager' ? 'Email hoặc Mã cán bộ' : 'Email hoặc Mã sinh viên'}
            </label>
            <input
              className="h-14 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder={activeTab === 'manager' ? "Nhập email hoặc mã cán bộ" : "Nhập email hoặc mã sinh viên"}
              type="text"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-base font-medium text-slate-800">Mật khẩu</label>
            <div className="relative">
              <input
                className="h-14 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Nhập mật khẩu của bạn"
                type={showPassword ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-500 hover:text-primary"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex w-full justify-end pt-1">
            <a href="#" className="text-sm font-medium text-primary hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="mt-6 flex h-14 w-full items-center justify-center rounded-lg bg-primary text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20"
          >
            Đăng nhập
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 flex w-full items-center">
          <div className="h-px flex-grow bg-slate-300"></div>
          <span className="mx-4 text-sm text-slate-500">Hoặc</span>
          <div className="h-px flex-grow bg-slate-300"></div>
        </div>

        {/* HUST Login */}
        <button className="flex h-14 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 text-base font-medium text-slate-800 transition-colors hover:bg-slate-50">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.78l1.04 1.04a6 6 0 0 0 8.49 8.49l1.04 1.04a4 4 0 0 1-4.78 4.78L3.85 8.62Z"></path>
            <path d="M10.29 13.71a6 6 0 0 0 8.49-8.49L21.7 2.3a4 4 0 0 1-4.78 4.78l-1.04-1.04a6 6 0 0 0-8.49 8.49l-1.04 1.04A4 4 0 0 1 2.3 21.7l2.99-2.99Z"></path>
          </svg>
          <span>Đăng nhập bằng HUST</span>
        </button>
      </div>
    </div>
  );
};

export default Login;