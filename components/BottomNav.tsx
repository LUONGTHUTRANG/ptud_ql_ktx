import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  path: string;
  active: boolean;
  onClick: (path: string) => void;
}

interface BottomNavProps {
  role?: 'student' | 'manager';
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active, onClick }) => (
  <button 
    onClick={() => onClick(path)}
    className={`flex flex-col items-center gap-1 text-center transition-colors ${active ? 'text-primary' : 'text-on-surface-light hover:text-slate-600'}`}
  >
    <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ role = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const studentNavItems = [
    { icon: 'home', label: 'Trang chủ', path: '/home' },
    { icon: 'grid_view', label: 'Dịch vụ', path: '/services' },
    { icon: 'notifications', label: 'Thông báo', path: '/notifications' },
    { icon: 'person', label: 'Tài khoản', path: '/account' },
  ];

  const managerNavItems = [
    { icon: 'home', label: 'Trang chủ', path: '/manager-home' },
    { icon: 'groups', label: 'Sinh viên', path: '/students' },
    { icon: 'bed', label: 'Phòng', path: '/rooms' },
    { icon: 'settings', label: 'Cài đặt', path: '/settings' },
  ];

  const navItems = role === 'manager' ? managerNavItems : studentNavItems;

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border-light bg-background-light/90 backdrop-blur-sm max-w-md mx-auto">
      <div className="grid grid-cols-4 px-4 pt-3 pb-5">
        {navItems.map((item) => (
          <NavItem 
            key={item.path}
            icon={item.icon} 
            label={item.label} 
            path={item.path}
            active={location.pathname === item.path}
            onClick={handleNavClick}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;