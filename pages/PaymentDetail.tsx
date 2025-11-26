
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const PaymentDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'qr'>('account');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: Show toast
  };

  const handleConfirm = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate('/home'); // Return home or back to bills
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light p-4 pb-2 sticky top-0 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center text-slate-800 hover:bg-slate-200/50 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
          Thông tin thanh toán
        </h2>
      </div>

      <main className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-6">
        {/* Payment Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center">
          <h1 className="text-primary tracking-light text-[32px] font-bold leading-tight">
            4.000.000 VNĐ
          </h1>
          <p className="text-slate-500 text-sm font-normal leading-normal pt-1">
            Kỳ hạn thanh toán: Học kỳ 1, 2024-2025
          </p>
          
          <div className="w-full mt-6">
            <div className="grid grid-cols-[auto_1fr] gap-x-4">
              <div className="col-span-2 grid grid-cols-subgrid border-t border-slate-200 py-4 items-center">
                <p className="text-slate-500 text-sm font-normal leading-normal">Phòng</p>
                <p className="text-slate-900 text-sm font-medium leading-normal text-right">Phòng A301</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-slate-200 py-4 items-center">
                <p className="text-slate-500 text-sm font-normal leading-normal">Tòa nhà</p>
                <p className="text-slate-900 text-sm font-medium leading-normal text-right">Ký túc xá khu A</p>
              </div>
              <div className="col-span-2 grid grid-cols-subgrid border-t border-slate-200 py-4 items-center">
                <p className="text-slate-500 text-sm font-normal leading-normal">Loại phòng</p>
                <p className="text-slate-900 text-sm font-medium leading-normal text-right">Phòng 4 người, có máy lạnh</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 p-3 rounded-lg mt-5 w-full">
            <p className="text-primary text-sm font-normal leading-normal text-center break-words">
              Nội dung chuyển khoản: <span className="font-semibold">NGUYEN VAN A 123456 TT KTX</span>
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Tabs */}
          <div className="p-2">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-center py-2.5 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'account' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Số tài khoản
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`w-full text-center py-2.5 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'qr' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mã QR
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 pt-3">
            {activeTab === 'account' ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-sm text-slate-500">Ngân hàng</span>
                  <span className="text-sm font-medium text-slate-900">Vietcombank</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-sm text-slate-500">Chủ tài khoản</span>
                  <span className="text-sm font-medium text-slate-900 uppercase">Truong Dai Hoc XYZ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">1234567890</span>
                    <button 
                      onClick={() => handleCopy('1234567890')}
                      className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Vui lòng ghi đúng nội dung chuyển khoản để được xác nhận nhanh chóng.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 gap-4">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  {/* Placeholder QR Code */}
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePaymentData" 
                    alt="Payment QR Code" 
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-xs text-slate-500 text-center px-4">
                  Quét mã QR trên bằng ứng dụng ngân hàng của bạn để thanh toán nhanh chóng.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <div className="sticky bottom-0 bg-background-light p-4 pt-2 border-t border-slate-200">
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleConfirm}
            className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-base flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
          >
            Xác nhận đã thanh toán
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full h-12 rounded-xl bg-transparent text-slate-500 font-semibold text-base flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        onConfirm={handleCloseSuccess}
        title="Đã gửi xác nhận"
        message="Hệ thống đã ghi nhận yêu cầu xác nhận thanh toán của bạn. Vui lòng chờ Ban quản lý duyệt trong 24h."
        confirmLabel="Về trang chủ"
        cancelLabel=""
        variant="success"
      />
    </div>
  );
};

export default PaymentDetail;
