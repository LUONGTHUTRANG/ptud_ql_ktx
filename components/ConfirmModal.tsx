import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning' | 'success';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'primary',
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: 'warning'
        };
      case 'warning':
        return {
          btn: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          icon: 'error'
        };
      case 'success':
        return {
          btn: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          icon: 'check_circle'
        };
      case 'primary':
      default:
        return {
          btn: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/20',
          iconBg: 'bg-blue-100',
          iconColor: 'text-primary',
          icon: 'help'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-xs scale-100 transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:max-w-sm">
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}>
            <span className={`material-symbols-outlined text-[32px] ${styles.iconColor}`}>
              {styles.icon}
            </span>
          </div>

          {/* Text */}
          <div className="text-center">
            <h3 className="mb-2 text-lg font-bold text-slate-900">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex h-11 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-colors focus:outline-none focus:ring-4 ${styles.btn}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;