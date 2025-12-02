
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const Services: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Đăng ký ở',
      description: 'Bắt đầu quá trình đăng ký chỗ ở mới.',
      icon: 'sensor_door',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      path: '/register-accommodation'
    },
    {
      title: 'Gia hạn chỗ ở',
      description: 'Tiếp tục hợp đồng cho kỳ học tiếp theo.',
      icon: 'autorenew',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      path: '#'
    },
    {
      title: 'Yêu cầu hỗ trợ',
      description: 'Báo cáo sự cố hoặc yêu cầu giúp đỡ.',
      icon: 'support_agent',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      path: '/requests'
    },
    {
      title: 'Thanh toán',
      description: 'Xem và thanh toán các hóa đơn của bạn.',
      icon: 'receipt_long',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      path: '/bills'
    },
    {
      title: 'Lịch sử',
      description: 'Tra cứu các giao dịch thanh toán đã thực hiện.',
      icon: 'history',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      path: '/transaction-history'
    },
    {
      title: 'Tòa nhà & phòng',
      description: 'Xem thông tin chi tiết về ký túc xá.',
      icon: 'apartment',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
      path: '/buildings'
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-start">
          {/* Back button removed for main nav page */}
          <div className="size-10"></div>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">Dịch vụ</h1>
        <div className="flex h-12 w-12 items-center justify-end"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => navigate(service.path)}
              className="group flex flex-col items-start rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-slate-50 text-left"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${service.iconBg} ${service.iconColor}`}>
                <span className="material-symbols-outlined !text-3xl">{service.icon}</span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-bold text-slate-800">{service.title}</h2>
                <p className="mt-1 text-xs text-slate-500 font-normal leading-relaxed">
                  {service.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav role="student" />
    </div>
  );
};

export default Services;
