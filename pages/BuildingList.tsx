
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuildingList: React.FC = () => {
  const navigate = useNavigate();

  const buildings = [
    {
      id: 'A1',
      name: 'Tòa A1',
      info: 'Số phòng: 50 | Vị trí: Gần cổng chính',
    },
    {
      id: 'A2',
      name: 'Tòa A2',
      info: 'Số phòng: 60 | Vị trí: Cạnh tòa A1',
    },
    {
      id: 'B1',
      name: 'Tòa B1',
      info: 'Số phòng: 45 | Vị trí: Khu B, đối diện sân bóng',
    },
    {
      id: 'G6',
      name: 'Tòa G6',
      info: 'Số phòng: 100 | Vị trí: Khu nhà G, gần thư viện',
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans group/design-root overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-16 items-center border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-start">
          <button 
            onClick={() => navigate('/services')}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-slate-900">Danh sách tòa nhà</h1>
        <div className="flex h-12 w-12 items-center justify-end">
          {/* Empty div for alignment balance as requested */}
        </div>
      </div>

      <main className="flex-1 pb-28">
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="flex w-full items-center rounded-xl bg-white p-2 shadow-sm border border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center text-slate-500">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="flex-1 border-none bg-transparent px-2 text-base text-slate-900 placeholder-slate-400 focus:ring-0" 
              placeholder="Tìm kiếm theo tên tòa nhà..." 
              type="text"
            />
          </div>
        </div>

        {/* Building List */}
        <div className="flex flex-col gap-3 px-4">
          {buildings.map((building) => (
            <div 
              key={building.id}
              onClick={() => navigate(`/buildings/${building.id}`)}
              className="flex min-h-[88px] cursor-pointer items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md border border-slate-100"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-3xl">apartment</span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-base font-bold leading-normal text-slate-900 line-clamp-1">
                  {building.name}
                </p>
                <p className="text-sm font-normal leading-normal text-slate-500 line-clamp-2">
                  {building.info}
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex size-7 items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BuildingList;
