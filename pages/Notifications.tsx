import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { NotificationItem } from '../types';

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'power',
      title: 'Lịch cắt điện toàn KTX ngày 30/11',
      content: 'Để phục vụ công tác bảo trì hệ thống, BQL sẽ tiến hành cắt điện toàn khu vực...',
      time: '2 giờ trước',
      isRead: false,
    },
    {
      id: '2',
      type: 'document',
      title: 'Đăng ký nội trú học kỳ mới',
      content: 'Sinh viên có nhu cầu ở lại KTX trong học kỳ tới vui lòng hoàn tất đăng ký...',
      time: 'Hôm qua',
      isRead: false,
    },
    {
      id: '3',
      type: 'cleaning',
      title: 'Yêu cầu giữ gìn vệ sinh chung',
      content: 'Nhắc nhở toàn thể sinh viên về việc giữ gìn vệ sinh tại các khu vực sinh hoạt chung.',
      time: '25/10/2023',
      isRead: true,
    },
    {
      id: '4',
      type: 'bug',
      title: 'Lịch phun thuốc diệt côn trùng',
      content: 'BQL sẽ tiến hành phun thuốc diệt muỗi và côn trùng toàn bộ các phòng ở.',
      time: '22/10/2023',
      isRead: true,
    },
  ];

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'power': return 'power_off';
      case 'document': return 'edit_document';
      case 'cleaning': return 'cleaning_services';
      case 'bug': return 'bug_report';
      default: return 'notifications';
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background-light pb-24 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 p-4 pb-3 backdrop-blur-sm">
        <div className="flex size-12 shrink-0 items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">
          Thông báo
        </h1>
        <div className="flex w-12 items-center justify-end">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-slate-700 hover:bg-slate-200/50 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 px-4 py-2">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex cursor-pointer items-center gap-4 rounded-lg bg-transparent p-3 transition-colors hover:bg-slate-200/50 ${
              item.isRead ? 'opacity-70 hover:opacity-100' : ''
            }`}
          >
            <div className="flex flex-1 items-center gap-4">
              {/* Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  !item.isRead
                    ? 'bg-primary/20 text-primary'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {getIcon(item.type)}
                </span>
              </div>
              
              {/* Content */}
              <div className="flex flex-col justify-center">
                <p className={`text-base leading-normal text-slate-900 line-clamp-1 ${!item.isRead ? 'font-semibold' : 'font-normal'}`}>
                  {item.title}
                </p>
                <p className="text-sm font-normal leading-normal text-slate-600 line-clamp-2">
                  {item.content}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className={`shrink-0 flex flex-col items-end gap-2 ${item.isRead ? 'justify-start' : ''}`}>
              <p className="text-xs font-normal leading-normal text-slate-500">
                {item.time}
              </p>
              {!item.isRead && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav role="student" />
    </div>
  );
};

export default Notifications;