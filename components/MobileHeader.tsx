import React from 'react';
import { Menu } from 'lucide-react';

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 text-white flex items-center justify-end px-6 z-40 shadow-lg border-b border-white/5">
      <button 
        onClick={onToggleSidebar}
        className="p-2 bg-white/10 rounded-lg active:scale-95 transition-transform hover:bg-white/20"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileHeader;