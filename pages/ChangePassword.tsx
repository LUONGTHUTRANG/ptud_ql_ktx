import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    // Validation passed, show confirmation modal
    setShowConfirmModal(true);
  };

  const executeChangePassword = () => {
    // Mock API call success
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/settings');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-background-light/80 p-4 pb-3 backdrop-blur-sm">
        <button 
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900">
          Đổi mật khẩu
        </h1>
        <div className="size-10 shrink-0"></div>
      </div>

      <main className="flex-1 p-4">
        <form onSubmit={handlePreSubmit} className="flex flex-col gap-4">
          
          {/* Current Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
            <div className="relative">
              <input
                name="currentPassword"
                type={showPassword.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('current')}
                className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-500 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword.current ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu mới</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('new')}
                className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-500 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword.new ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-12 text-base text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => toggleVisibility('confirm')}
                className="absolute right-0 top-0 flex h-full items-center px-4 text-slate-500 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {showPassword.confirm ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executeChangePassword}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn thay đổi mật khẩu không?"
        confirmLabel="Đồng ý"
        cancelLabel="Hủy"
        variant="primary"
      />

      {/* Success Modal */}
      <ConfirmModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        onConfirm={handleSuccessClose}
        title="Thành công"
        message="Mật khẩu của bạn đã được thay đổi thành công. Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo."
        confirmLabel="Đóng"
        cancelLabel="" // Hide cancel button
        variant="success"
      />
    </div>
  );
};

export default ChangePassword;