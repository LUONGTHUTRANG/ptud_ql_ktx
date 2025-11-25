import React from 'react';
import BottomNav from '../components/BottomNav';
import { User } from '../types';

const ManagerHome: React.FC = () => {
  const user: User = {
    name: "Minh Anh",
    room: "",
    building: "Admin",
    roommate: "",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmB15ln7Wmm2s23yx4ofXpFGt8U1GzxnVwc1D1bhGvM7Ra4vRKDZc9NuuSxfCoHk3AjumpcpF7yoLm1VJKoVmx-ceynKGPCeSpkkx9uOSUgP-GLiTg1vL_V5XuNBoK2MuShJEKtrHHSatF--Cj_Th3gF6b2GUz62viuozwhpscW5nntx5zV48IlHYh-zeS6inzgtvqeJXZAuZzcPaQ4v4RestFofrVqrK1rVEJVpNxlVCsrtV1XVSiw47NqoWBxr9lWvcZ0ryXgKc"
  };

  const quickAccessItems = [
    { icon: 'apartment', label: 'Quản lý Tòa nhà', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: 'groups', label: 'Quản lý Sinh viên', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: 'receipt_long', label: 'Quản lý Hóa đơn', color: 'text-orange-600', bg: 'bg-orange-100' },
    { icon: 'checklist', label: 'Duyệt Đơn', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: 'campaign', label: 'Tạo Thông báo', color: 'text-red-600', bg: 'bg-red-100' },
    { icon: 'build', label: 'Bảo trì', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light pb-24 font-sans">
      {/* Header - Student Style as requested */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/95 p-4 pb-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200">
            <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Chào buổi sáng, {user.name}!</h2>
        </div>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100">
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background-light"></div>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Statistics Grid */}
        <div className="flex flex-wrap gap-4 p-4 pb-0">
          <div className="flex min-w-[calc(50%-8px)] flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-800">Tổng sinh viên</p>
            <p className="text-2xl font-bold leading-tight text-slate-900">850</p>
          </div>
          <div className="flex min-w-[calc(50%-8px)] flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-800">Phòng trống</p>
            <p className="text-2xl font-bold leading-tight text-slate-900">25</p>
          </div>
          <div className="flex min-w-[calc(50%-8px)] flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-800">Đơn đăng ký mới</p>
            <p className="text-2xl font-bold leading-tight text-yellow-500">12</p>
          </div>
          <div className="flex min-w-[calc(50%-8px)] flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-slate-800">Yêu cầu cần xử lý</p>
            <p className="text-2xl font-bold leading-tight text-red-500">5</p>
          </div>
        </div>

        {/* Warning Section */}
        <div>
          <h3 className="px-4 pb-2 text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">Cảnh báo</h3>
          <div className="px-4">
            <div className="flex min-h-[72px] items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="line-clamp-1 text-base font-medium leading-normal text-slate-900">5 hóa đơn đã quá hạn</p>
                  <p className="line-clamp-2 text-sm font-normal leading-normal text-slate-500">Nhấn để xem chi tiết danh sách</p>
                </div>
              </div>
              <div className="shrink-0 text-slate-600">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div>
          <h3 className="px-4 pb-2 pt-2 text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">Tỷ lệ lấp đầy phòng</h3>
          <div className="px-4">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative mx-auto h-40 w-40">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-slate-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <path
                    className="stroke-primary"
                    strokeDasharray="94, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">94%</span>
                  <span className="text-sm text-slate-500">Đã lấp đầy</span>
                </div>
              </div>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-slate-600">Đã ở: 470/500</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                  <span className="text-sm text-slate-600">Còn trống: 30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h3 className="px-4 pb-2 pt-2 text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">Truy cập nhanh</h3>
          <div className="px-4">
            <div className="grid grid-cols-4 gap-3 py-2">
              {quickAccessItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center gap-2">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <p className="text-center text-xs font-medium text-slate-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav role="manager" />
    </div>
  );
};

export default ManagerHome;