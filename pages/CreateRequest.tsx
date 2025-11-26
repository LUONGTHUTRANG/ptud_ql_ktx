
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const CreateRequest: React.FC = () => {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState('repair'); // repair, complaint, suggestion
  const [description, setDescription] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = () => {
    // In a real app, validate and submit data here
    if (!description.trim()) {
      alert('Vui lòng nhập mô tả chi tiết');
      return;
    }
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/requests');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">Yêu Cầu Hỗ Trợ</h1>
        <div className="flex size-10 shrink-0 items-center"></div>
      </div>

      <main className="flex flex-col flex-1">
        <div className="flex flex-col px-4 pt-5 pb-3">
          <h2 className="text-slate-900 tracking-light text-[28px] font-bold leading-tight text-left">
            Tạo Yêu Cầu Mới
          </h2>
          <p className="text-slate-500 text-base font-normal leading-normal pt-1">
            Bạn cần hỗ trợ về việc gì?
          </p>
        </div>

        {/* Request Type Selector */}
        <div className="flex px-4 py-3">
          <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setRequestType('repair')}
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all ${
                requestType === 'repair'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="truncate">Sửa chữa</span>
            </button>
            <button
              onClick={() => setRequestType('complaint')}
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all ${
                requestType === 'complaint'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="truncate">Khiếu nại</span>
            </button>
            <button
              onClick={() => setRequestType('suggestion')}
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium transition-all ${
                requestType === 'suggestion'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="truncate">Đề xuất</span>
            </button>
          </div>
        </div>

        {/* Description Input */}
        <div className="flex w-full flex-col px-4 py-3 gap-2">
          <p className="text-slate-900 text-base font-bold leading-normal">
            Mô tả chi tiết sự việc
          </p>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-slate-50 focus:border-primary min-h-36 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal" 
            placeholder="Vui lòng mô tả rõ vấn đề bạn đang gặp phải..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="px-4 py-3">
          <p className="text-slate-900 text-base font-bold leading-normal pb-2">
            Đính kèm ảnh minh họa
          </p>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">photo_camera</span>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold">Nhấn để tải ảnh lên</span>
                </p>
              </div>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-auto px-4 pt-4 pb-8">
          <button 
            onClick={handleSubmit}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Gửi Yêu Cầu
          </button>
        </div>
      </main>

      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        onConfirm={handleCloseSuccess}
        title="Gửi thành công"
        message="Yêu cầu hỗ trợ của bạn đã được gửi thành công. Ban quản lý sẽ phản hồi trong thời gian sớm nhất."
        confirmLabel="Đồng ý"
        cancelLabel=""
        variant="success"
      />
    </div>
  );
};

export default CreateRequest;
