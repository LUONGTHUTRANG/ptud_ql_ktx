
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RequestDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const role = localStorage.getItem('role') || 'student';

  // Mock Data matching the design
  const request = {
    id: id || 'YC-12345',
    code: 'YC-12345',
    type: 'Sửa chữa điện',
    date: '25/10/2023',
    status: 'pending',
    statusText: 'Đang chờ xử lý',
    description: 'Bóng đèn trong phòng tắm bị cháy và không thể sử dụng được. Vui lòng hỗ trợ thay thế bóng đèn mới. Xin cảm ơn.',
    images: [
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop", // Placeholder for portrait
      "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=200&auto=format&fit=crop"  // Placeholder for portrait
    ],
    timeline: [
      {
        status: 'Đang xử lý',
        time: '26/10/2023 09:15',
        user: 'Lê Minh',
        comment: 'Đã tiếp nhận và sẽ cử nhân viên kỹ thuật đến kiểm tra trong hôm nay.',
        active: true,
        icon: 'autorenew',
        color: 'blue'
      },
      {
        status: 'Đã gửi yêu cầu',
        time: '25/10/2023 20:30',
        user: 'Bạn',
        active: false,
        icon: 'receipt_long',
        color: 'slate'
      }
    ]
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* TopAppBar */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/95 backdrop-blur-sm border-b border-slate-200 p-4 shadow-sm">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Chi tiết Yêu cầu
        </h1>
      </div>

      <div className="flex flex-col gap-4 p-4 pb-8">
        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            <p className="text-slate-500 text-sm font-normal leading-normal">Mã yêu cầu:</p>
            <p className="text-slate-900 text-sm font-medium leading-normal">{request.code}</p>
            
            <p className="text-slate-500 text-sm font-normal leading-normal">Loại yêu cầu:</p>
            <p className="text-slate-900 text-sm font-medium leading-normal">{request.type}</p>
            
            <p className="text-slate-500 text-sm font-normal leading-normal">Ngày gửi:</p>
            <p className="text-slate-900 text-sm font-medium leading-normal">{request.date}</p>
            
            <p className="text-slate-500 text-sm font-normal leading-normal self-center">Trạng thái:</p>
            <div className="flex items-center">
              <div className="flex h-7 items-center justify-center gap-x-2 rounded-full bg-amber-100 px-3">
                <p className="text-amber-700 text-xs font-bold leading-normal">{request.statusText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <h3 className="text-slate-900 text-base font-bold leading-tight tracking-[-0.015em]">
            Mô tả chi tiết
          </h3>
          <p className="text-slate-700 text-sm font-normal leading-relaxed pt-2">
            {request.description}
          </p>
          
          {/* Image Gallery */}
          <div className="mt-4">
            <h4 className="text-slate-900 text-base font-bold leading-tight tracking-[-0.015em]">
              Ảnh đính kèm
            </h4>
            <div className="grid grid-cols-3 gap-3 pt-3">
              {request.images.map((img, idx) => (
                <img 
                  key={idx}
                  className="aspect-square w-full rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity bg-slate-100" 
                  src={img} 
                  alt={`Evidence ${idx + 1}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline/History Log Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
          <h3 className="text-slate-900 text-base font-bold leading-tight tracking-[-0.015em]">
            Lịch sử cập nhật
          </h3>
          <div className="relative mt-4 pl-6">
            {/* Vertical Line */}
            <div className="absolute left-0 top-2 h-[calc(100%-16px)] w-0.5 bg-slate-200"></div>
            
            {request.timeline.map((item, index) => (
              <div key={index} className="relative mb-6 last:mb-0">
                <div 
                  className={`absolute -left-[29px] top-0 flex size-7 items-center justify-center rounded-full ring-4 ring-white ${
                    item.color === 'blue' ? 'bg-blue-500' : 'bg-slate-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-white !text-base">
                    {item.icon}
                  </span>
                </div>
                
                <p className={`text-sm font-bold ${
                  item.color === 'blue' ? 'text-blue-600' : 'text-slate-800'
                }`}>
                  {item.status}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.time} - Bởi: {item.user}
                </p>
                
                {item.comment && (
                  <div className="mt-2 text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100">
                    {item.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Action Buttons - Only visible to Managers/Admins */}
          {role === 'manager' && (
            <div className="grid grid-cols-2 gap-3 pt-6 mt-2 border-t border-slate-50">
              <button className="flex h-12 w-full items-center justify-center rounded-xl border border-red-500 bg-transparent text-sm font-bold text-red-500 transition-colors hover:bg-red-50">
                Hủy Yêu cầu
              </button>
              <button className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/90 shadow-md shadow-primary/20">
                Gửi Phản Hồi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
