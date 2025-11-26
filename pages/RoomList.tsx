
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Mock Data
  const rooms = [
    {
      id: '101',
      name: 'Phòng 101',
      price: '1.500.000 VNĐ/tháng',
      status: 'available',
      capacity: 8,
      hasAC: true,
      hasHeater: true,
      hasBalcony: true,
    },
    {
      id: '102',
      name: 'Phòng 102',
      price: '1.500.000 VNĐ/tháng',
      status: 'full',
      capacity: 8,
      hasAC: true,
      hasHeater: true,
      hasBalcony: false,
    },
    {
      id: '103',
      name: 'Phòng 103',
      price: '1.200.000 VNĐ/tháng',
      status: 'maintenance',
      capacity: 6,
      hasAC: false,
      hasHeater: true,
      hasBalcony: false,
    },
    {
      id: '201',
      name: 'Phòng 201',
      price: '1.700.000 VNĐ/tháng',
      status: 'available',
      capacity: 6,
      hasAC: true,
      hasHeater: true,
      hasBalcony: true,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
            Còn trống
          </div>
        );
      case 'full':
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
            Đã đầy
          </div>
        );
      case 'maintenance':
        return (
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
            Bảo trì
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-start">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">
          Quản lý phòng - Nhà {id || 'A1'}
        </h1>
        <div className="flex h-12 w-12 items-center justify-end">
          {/* Spacer */}
        </div>
      </div>

      {/* Sticky Search & Filter Section */}
      <div className="sticky top-16 z-10 bg-background-light px-4 pt-3 pb-2 shadow-sm">
        {/* Search */}
        <div className="flex w-full items-center rounded-xl bg-white p-2 shadow-sm border border-slate-100 mb-3">
          <div className="flex h-10 w-10 items-center justify-center text-slate-500">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            className="flex-1 border-none bg-transparent px-2 text-base text-slate-900 placeholder-slate-400 focus:ring-0" 
            placeholder="Tìm kiếm số phòng..." 
            type="text"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg border border-slate-200 bg-white px-3 shadow-sm active:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Giá</span>
            <span className="material-symbols-outlined text-[20px] text-slate-500">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg border border-slate-200 bg-white px-3 shadow-sm active:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Sức chứa</span>
            <span className="material-symbols-outlined text-[20px] text-slate-500">expand_more</span>
          </button>
          <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg border border-slate-200 bg-white px-3 shadow-sm active:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Điều hòa</span>
          </button>
           <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg border border-slate-200 bg-white px-3 shadow-sm active:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Nóng lạnh</span>
          </button>
           <button className="flex h-9 shrink-0 items-center justify-center gap-x-1 rounded-lg border border-slate-200 bg-white px-3 shadow-sm active:bg-slate-50">
            <span className="text-sm font-medium text-slate-700">Ban công</span>
          </button>
        </div>
      </div>

      {/* Room List */}
      <main className="flex-1 p-4 pt-2 flex flex-col gap-4 pb-8">
        {rooms.map((room) => (
          <div key={room.id} className="flex flex-col gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-slate-900 text-lg font-bold leading-normal">
                  {room.name}
                </p>
                <p className="text-slate-500 text-sm font-medium leading-normal mt-1">
                  Giá: {room.price}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(room.status)}
                {/* Edit button removed as requested */}
              </div>
            </div>
            
            {/* Amenities Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-500 mt-2 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">group</span>
                <span>Sức chứa: {room.capacity} người</span>
              </div>
              <div className={`flex items-center gap-2 ${room.hasAC ? 'text-slate-700' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                <span>Điều hòa: {room.hasAC ? 'Có' : 'Không'}</span>
              </div>
              <div className={`flex items-center gap-2 ${room.hasHeater ? 'text-slate-700' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined text-[18px]">water_heater</span>
                <span>Nóng lạnh: {room.hasHeater ? 'Có' : 'Không'}</span>
              </div>
              <div className={`flex items-center gap-2 ${room.hasBalcony ? 'text-slate-700' : 'text-slate-400'}`}>
                 <span className="material-symbols-outlined text-[18px]">balcony</span>
                <span>Ban công: {room.hasBalcony ? 'Có' : 'Không'}</span>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Add Button removed as requested */}
    </div>
  );
};

export default RoomList;
