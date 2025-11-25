import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const role = (localStorage.getItem('role') as 'student' | 'manager') || 'student';

  const studentData = {
    avatar: "https://picsum.photos/200",
    name: "Nguyễn Văn An",
    roleText: "Sinh viên - K66",
    details: [
      { icon: "person", label: "Họ và tên", value: "Nguyễn Văn An" },
      { icon: "badge", label: "Mã sinh viên", value: "20211234" },
      { icon: "school", label: "Lớp", value: "CNTT-04" },
      { icon: "calendar_month", label: "Ngày sinh", value: "01/01/2003" },
      { icon: "phone", label: "Số điện thoại", value: "0987654321" },
      { icon: "mail", label: "Email", value: "an.nv211234@sis.hust.edu.vn" },
      { icon: "bed", label: "Phòng", value: "Tòa B2 - 404" },
    ]
  };

  const managerData = {
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5fGTmbVq_ilZqybLg_MFxbrciC3Bwd2F1Ja5ljTMP2UoeHILChNE2GKPtJ_LRcJ0CKi27kpG0lYi-hUjVGJANzFBGFt7AoN00MyjeGpfcCVwGXuGLFysyzOai2Fa4UxCpx_eN3h7eVqdla8FMZHkiYhQYViAXRB0bPMjDJv76RmtQikYB5Bu6RD-WhvUO7JtANvxRhKku3vbnT-HphlCxXBglM6dWhJqPJIgL62r5K441QpTmGGqtnPpfxAE43qur3MAUoieQni8",
    name: "Nguyễn Văn An",
    roleText: "Quản lý Ký túc xá",
    details: [
      { icon: "person", label: "Họ và tên", value: "Nguyễn Văn An" },
      { icon: "calendar_month", label: "Ngày sinh", value: "01/01/1985" },
      { icon: "phone", label: "Số điện thoại", value: "0912345678" },
      { icon: "mail", label: "Email", value: "nguyen.van.an@email.com" },
      { icon: "badge", label: "Số CCCD", value: "*** *** 678" },
      { icon: "corporate_fare", label: "Tòa nhà phụ trách", value: "Tòa A1, Tòa B2" },
    ]
  };

  const data = role === 'manager' ? managerData : studentData;

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
          Hồ sơ của bạn
        </h1>
        <div className="size-10 shrink-0"></div>
      </div>

      <main className="flex-1">
        <div className="flex flex-col">
          <div className="p-4">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div 
                    className="aspect-square w-32 min-h-32 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white shadow-lg" 
                    style={{ backgroundImage: `url("${data.avatar}")` }}
                  ></div>
                  <button className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-background-light bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors">
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-slate-900">
                    {data.name}
                  </p>
                  <p className="text-base font-normal leading-normal text-slate-500">
                    {data.roleText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-px bg-slate-200 mt-4">
            {data.details.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-background-light px-4 py-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <p className="text-sm font-normal leading-normal text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-base font-medium leading-normal text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-slate-200/80 bg-background-light/80 p-4 backdrop-blur-sm">
        <button className="flex h-12 w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 text-base font-bold text-white hover:bg-primary/90 transition-colors shadow-sm">
          <span className="material-symbols-outlined">edit</span>
          <span className="truncate">Chỉnh sửa thông tin</span>
        </button>
      </footer>
    </div>
  );
};

export default Profile;