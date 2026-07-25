'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CalendarDays, 
  FileEdit,
  Users,
  MessageSquare,
  Package,
  Tag,
  FileText,
  Settings,
  UserCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { name: 'แดชบอร์ด', icon: Home, path: '/admin' },
  { name: 'คิวล้างรถ', icon: CalendarDays, path: '/admin/queue' },
  { 
    name: 'บันทึกข้อมูล', 
    icon: FileEdit, 
    path: '#',
    subItems: [
      { name: 'คิวล้างรถ', path: '/admin/records/queue' },
      { name: 'รายได้ - ค่าใช้จ่าย', path: '/admin/records/finance' },
      { name: 'ลูกค้า', path: '/admin/records/customer' },
    ]
  },
  { name: 'ลูกค้า', icon: Users, path: '/admin/customers' },
  { name: 'รีวิว', icon: MessageSquare, path: '/admin/reviews' },
  { name: 'บริการ / แพ็กเกจ', icon: Package, path: '/admin/services' },
  { name: 'โปรโมชั่น', icon: Tag, path: '/admin/promotions' },
  { name: 'รายงาน', icon: FileText, path: '/admin/reports' },
  { name: 'ตั้งค่า', icon: Settings, path: '/admin/settings' },
  { name: 'ผู้ใช้งาน', icon: UserCircle, path: '/admin/users' },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('บันทึกข้อมูล');

  return (
    <aside className="w-[280px] bg-[#0A0A0A] h-screen text-gray-300 flex flex-col shrink-0 sticky top-0 overflow-y-auto border-r border-gray-900">
      {/* Logo Section */}
      <div className="p-6 flex flex-col items-center justify-center mb-2 mt-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative flex items-center justify-center">
            <Shield className="w-12 h-12 text-[#E5B842]" strokeWidth={1} />
            <span className="absolute text-[#E5B842] font-serif font-bold text-lg mt-1 tracking-tighter">YJ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white leading-none tracking-widest uppercase" style={{ textShadow: "0 2px 10px rgba(229,184,66,0.3)" }}>YJ CARS</span>
            <span className="text-[#E5B842] text-sm tracking-[0.2em] font-semibold italic mt-1">DETAILING</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
          const hasSub = !!item.subItems;
          const isSubOpen = openSubmenu === item.name;

          return (
            <div key={item.name} className="relative">
              {/* Separator Line */}
              {index > 0 && <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent my-1"></div>}

              {hasSub ? (
                <button
                  onClick={() => setOpenSubmenu(isSubOpen ? null : item.name)}
                  className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive || isSubOpen ? 'bg-black text-[#E5B842]' : 'hover:bg-white/5 text-[#E5B842]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="font-medium tracking-wide">{item.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 opacity-70 ${isSubOpen ? 'rotate-180 text-[#E5B842]' : ''}`} />
                </button>
              ) : (
                <Link
                  href={item.path}
                  onClick={() => onClose?.()}
                  className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#111] text-[#E5B842] border border-[#E5B842]/50 shadow-[0_0_15px_rgba(229,184,66,0.15)]' 
                      : 'hover:bg-white/5 text-[#E5B842] border border-transparent'
                  }`}
                >
                  {/* Left Active Glow */}
                  {isActive && (
                    <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-[#E5B842] rounded-r-full shadow-[0_0_8px_#E5B842]"></div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'opacity-100' : 'opacity-90 group-hover:scale-110'}`} />
                    <span className={`font-medium tracking-wide ${isActive ? 'text-[#E5B842]' : 'text-gray-300 group-hover:text-[#E5B842] transition-colors'}`}>{item.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}

              {/* Sub Items */}
              {hasSub && (
                <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-6 pl-4 border-l-2 border-[#E5B842]/30 space-y-1 relative">
                    {/* Active sub menu glow line */}
                    {isSubOpen && (
                       <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#E5B842] to-transparent shadow-[0_0_8px_#E5B842]"></div>
                    )}
                    
                    {item.subItems?.map((sub) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          onClick={() => onClose?.()}
                          className={`group flex items-center justify-between pr-4 py-2.5 rounded-lg transition-all duration-200 ${
                            isSubActive 
                              ? 'text-[#E5B842] bg-white/5' 
                              : 'text-gray-400 hover:text-[#E5B842] hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ml-2 ${isSubActive ? 'bg-[#E5B842] shadow-[0_0_5px_#E5B842]' : 'bg-gray-600 group-hover:bg-[#E5B842]'}`}></div>
                            <span className="text-sm tracking-wide">{sub.name}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${isSubActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 mt-auto mb-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>
        <Link
          href="/api/auth/signout"
          className="group relative flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
        >
          <div className="flex items-center gap-4">
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide">ออกจากระบบ</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
