
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const SpecialRequest: React.FC = () => {
  const navigate = useNavigate();
  const [building, setBuilding] = useState('');
  const [circumstance, setCircumstance] = useState('other'); // poor, disabled, other
  const [note, setNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock file state
  const [files, setFiles] = useState([
    { name: 'giay_chung_nhan_ho_ngheo.pdf', size: '1.2 MB' }
  ]);

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    // Simulate API call
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/register-accommodation');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center bg-background-light/95 backdrop-blur-sm p-4 pb-3 justify-between border-b border-slate-200">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-700 hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Đăng Ký Chỗ Ở - Ưu Tiên
        </h1>
        <div className="size-10"></div>
      </div>

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="flex flex-col gap-6">
          
          {/* Section 1: Building Selection */}
          <section>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
              Thông tin phòng mong muốn
            </h2>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col w-full">
                <p className="text-slate-700 text-base font-medium leading-normal pb-2">
                  Tòa mong muốn ở
                </p>
                <div className="relative">
                  <select 
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="flex w-full appearance-none rounded-lg border border-slate-300 bg-white p-3.5 pr-10 text-base font-normal text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Chọn tòa nhà</option>
                    <option value="a1">Tòa A1</option>
                    <option value="a2">Tòa A2</option>
                    <option value="b1">Tòa B1</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Section 2: Circumstance */}
          <section>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
              Khai báo hoàn cảnh đặc biệt
            </h2>
            <div className="space-y-3">
              <div 
                className="relative flex items-center cursor-pointer"
                onClick={() => setCircumstance('poor')}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${circumstance === 'poor' ? 'border-primary' : 'border-slate-400'}`}>
                   {circumstance === 'poor' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <label className="ml-3 block text-base font-medium text-slate-700 cursor-pointer">
                  Hộ nghèo / Cận nghèo
                </label>
              </div>
              
              <div 
                className="relative flex items-center cursor-pointer"
                onClick={() => setCircumstance('disabled')}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${circumstance === 'disabled' ? 'border-primary' : 'border-slate-400'}`}>
                   {circumstance === 'disabled' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <label className="ml-3 block text-base font-medium text-slate-700 cursor-pointer">
                  Người khuyết tật
                </label>
              </div>

              <div 
                className="relative flex items-center cursor-pointer"
                onClick={() => setCircumstance('other')}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${circumstance === 'other' ? 'border-primary' : 'border-slate-400'}`}>
                   {circumstance === 'other' && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <label className="ml-3 block text-base font-medium text-slate-700 cursor-pointer">
                  Hoàn cảnh khác
                </label>
              </div>
            </div>

            {/* Note Area */}
            <div className="mt-4">
              <label className="flex flex-col w-full">
                <p className="text-slate-700 text-base font-medium leading-normal pb-2">
                  Ghi chú hoàn cảnh
                </p>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white p-3.5 text-base font-normal text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Vui lòng mô tả rõ hoàn cảnh của bạn..." 
                  rows={3}
                ></textarea>
              </label>
            </div>
            
            <p className="mt-4 text-sm text-slate-500 leading-normal">
              Vui lòng cung cấp giấy tờ minh chứng hợp lệ ở mục dưới đây.
            </p>
          </section>

          {/* Section 3: Upload */}
          <section>
            <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
              Tải lên minh chứng
            </h2>
            <div className="relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>
              <p className="mt-4 text-base font-semibold text-slate-900">
                Nhấn để tải lên ảnh hoặc tệp
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Chấp nhận .JPG, .PNG, .PDF
              </p>
              <input className="absolute inset-0 h-full w-full cursor-pointer opacity-0" type="file" />
            </div>
            
            {/* File List */}
            <div className="mt-4 flex flex-col gap-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-slate-300 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFile(index)}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 mt-auto bg-background-light p-4 border-t border-slate-200">
        <button 
          onClick={handleSubmit}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
        >
          Gửi đơn
        </button>
      </footer>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận gửi đơn"
        message="Bạn có chắc chắn muốn gửi đơn đăng ký này không? Vui lòng kiểm tra kỹ thông tin trước khi gửi."
        confirmLabel="Gửi đơn"
        cancelLabel="Hủy"
        variant="primary"
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        title="Gửi thành công"
        message="Đơn đăng ký của bạn đã được gửi thành công. Vui lòng chờ kết quả xét duyệt."
        confirmLabel="Về trang đăng ký"
        cancelLabel=""
        variant="success"
      />
    </div>
  );
};

export default SpecialRequest;
