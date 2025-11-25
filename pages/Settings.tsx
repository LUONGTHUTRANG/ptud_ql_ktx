import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import ConfirmModal from '../components/ConfirmModal';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Retrieve role from localStorage, default to 'student' if not found
  const role = (localStorage.getItem('role') as 'student' | 'manager') || 'student';

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-b-slate-200 bg-white px-4">
        <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">
          Cài đặt
        </h2>
        <div className="size-10 shrink-0"></div>
      </div>

      <div className="flex-grow p-4">
        {/* Account Section */}
        <div className="space-y-2">
          <p className="px-4 pb-1 pt-2 text-sm font-semibold text-slate-500">Tài khoản</p>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/* List Item: Account Info */}
            <div 
              onClick={() => navigate('/profile')}
              className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">person</span>
                </div>
                <p className="flex-1 truncate text-base font-medium leading-normal text-slate-800">
                  Thông tin tài khoản
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex size-7 items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <hr className="ml-16 border-slate-100" />
            
            {/* List Item: Change Password */}
            <div className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <p className="flex-1 truncate text-base font-medium leading-normal text-slate-800">
                  Đổi mật khẩu
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex size-7 items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Section */}
        <div className="mt-6 space-y-2">
          <p className="px-4 pb-1 pt-2 text-sm font-semibold text-slate-500">Chung</p>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {/* List Item: Notification Settings */}
            <div className="flex min-h-[56px] items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">notifications</span>
                </div>
                <p className="flex-1 truncate text-base font-medium leading-normal text-slate-800">
                  Cài đặt thông báo
                </p>
              </div>
              <div className="shrink-0">
                <label className="relative flex h-[28px] w-[48px] cursor-pointer items-center rounded-full bg-slate-200 p-0.5 transition-colors has-[:checked]:bg-primary">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <span className="h-[24px] w-[24px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[20px]"></span>
                </label>
              </div>
            </div>
            
            {/* Divider */}
            <hr className="ml-16 border-slate-100" />
            
            {/* List Item: Help & Feedback */}
            <div className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">help</span>
                </div>
                <p className="flex-1 truncate text-base font-medium leading-normal text-slate-800">
                  Trợ giúp & Phản hồi
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex size-7 items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-2xl">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="mt-8">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-red-50 text-base font-bold text-red-600 shadow-sm transition-colors hover:bg-red-100"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <BottomNav role={role} />

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        confirmLabel="Đăng xuất"
        variant="danger"
      />
    </div>
  );
};

export default Settings;