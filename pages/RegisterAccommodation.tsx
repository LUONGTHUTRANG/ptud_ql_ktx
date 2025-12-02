
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const RegisterAccommodation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light font-sans pb-24">
      {/* Header */}
      <div className="flex shrink-0 items-center bg-background-light p-4 pb-2 justify-between sticky top-0 z-10">
        <button
            onClick={() => navigate('/services')}
            className="text-slate-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
            Đăng ký ký túc xá
        </h2>
      </div>

      {/* Progress Bar removed as requested */}

      <div className="px-4 flex flex-col flex-grow">
        <h1 className="text-slate-900 tracking-tight text-[32px] font-bold leading-tight text-left pb-2 pt-4">
            Chọn loại đơn đăng ký
        </h1>
        <p className="text-slate-600 text-base font-normal leading-normal pb-8">
            Vui lòng chọn loại đơn phù hợp với bạn để bắt đầu quá trình đăng ký.
        </p>

        <div className="flex flex-col gap-5 flex-grow justify-start">
            {/* Option 1 */}
            <button
                className="block rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
                onClick={() => navigate('/register-regular')}
            >
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-3xl">home</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">Đăng ký chỗ ở thông thường</h3>
                        <p className="text-sm text-slate-600 mt-1">Dành cho sinh viên đăng ký theo quy trình chuẩn.</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 mt-1">chevron_right</span>
                </div>
            </button>

            {/* Option 2 */}
            <button
                className="block rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-left"
                onClick={() => navigate('/register-special')}
            >
                <div className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">Đăng ký hoàn cảnh đặc biệt</h3>
                        <p className="text-sm text-slate-600 mt-1">Dành cho sinh viên thuộc diện ưu tiên, cần cung cấp minh chứng.</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 mt-1">chevron_right</span>
                </div>
            </button>
        </div>
      </div>

      <BottomNav role="student" />
    </div>
  );
};

export default RegisterAccommodation;