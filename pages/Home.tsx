
import React from 'react';
import BottomNav from '../components/BottomNav';
import { Bill, MenuItem, User } from '../types';

const Home: React.FC = () => {
  const user: User = {
    name: "An",
    room: "404",
    building: "B2",
    roommate: "Lê Văn Hưng",
    avatarUrl: "https://picsum.photos/100/100" // Placeholder
  };

  const menuItems: MenuItem[] = [
    { icon: 'cottage', title: 'Đăng ký ở', subtitle: 'Tìm phòng mới' },
    { icon: 'support_agent', title: 'Gửi yêu cầu', subtitle: 'Hỗ trợ & sửa chữa' },
    { icon: 'autorenew', title: 'Gia hạn', subtitle: 'Kéo dài hợp đồng' },
    { icon: 'apartment', title: 'Tòa nhà & phòng', subtitle: 'Thông tin KTX' },
  ];

  const bills: Bill[] = [
    { id: '1', title: 'Tiền phòng - Tháng 09/2023', status: 'overdue', amount: '2.500.000đ', dueDate: '05/10', type: 'room' },
    { id: '2', title: 'Tiền điện & nước - Tháng 10/2023', status: 'pending', amount: '450.000đ', dueDate: '30/10', type: 'utility' },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light pb-24">
      {/* Header */}
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

      <div className="space-y-6 p-4 pt-2">
        {/* Warning Card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-yellow-500/50">
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2 text-yellow-600">
              <span className="material-symbols-outlined filled text-xl">warning</span>
              <p className="text-sm font-bold">Thông báo khẩn</p>
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">Lịch cắt điện tòa B2 ngày 25/10</h3>
            <p className="text-sm leading-relaxed text-on-surface-light">
              Sẽ có lịch cắt điện để bảo trì hệ thống từ 8:00 đến 11:00. Vui lòng lưu ý.
            </p>
          </div>
        </div>

        {/* Grid Menu */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-start gap-3 rounded-xl border border-border-light bg-white p-4 text-left transition-colors hover:border-primary/30 hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-3xl text-primary">{item.icon}</span>
              <div>
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-on-surface-light">{item.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Your Room */}
        <div className="overflow-hidden rounded-xl border border-border-light bg-white shadow-sm">
          <div className="flex">
            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Phòng của bạn</h3>
                <p className="text-sm text-on-surface-light">Tòa {user.building} - Phòng {user.room}</p>
                <p className="text-sm text-on-surface-light">Bạn cùng phòng: {user.roommate}</p>
              </div>
              <button className="mt-4 flex w-fit items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20">
                Chi tiết
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="w-1/3 min-w-[120px]">
              <img
                src="https://picsum.photos/300/200"
                alt="Room"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bills */}
        <div>
          <h3 className="mb-3 text-lg font-bold text-slate-900">Hóa đơn cần thanh toán</h3>
          <div className="space-y-3">
            {bills.length > 0 ? (
              bills.map((bill) => (
                <div
                  key={bill.id}
                  className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm ${
                    bill.status === 'overdue' ? 'border-red-500/50' : 'border-border-light'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                      bill.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{bill.title}</p>
                    <p
                      className={`text-xs ${
                        bill.status === 'overdue' ? 'font-medium text-red-600' : 'text-on-surface-light'
                      }`}
                    >
                      {bill.status === 'overdue' ? 'Đã quá hạn' : 'Sắp đến hạn'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{bill.amount}</p>
                    <p className="text-xs text-on-surface-light">Hạn: {bill.dueDate}</p>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State / All Paid */
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-light bg-white p-6 text-center">
                <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                <div>
                  <p className="font-bold text-slate-900">Không có hóa đơn mới</p>
                  <p className="text-xs text-on-surface-light">Bạn đã thanh toán hết các hóa đơn.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav role="student" />
    </div>
  );
};

export default Home;
