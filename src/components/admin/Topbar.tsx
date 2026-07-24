import { Menu, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-[#0A0A0A] border-b border-gray-900 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-gray-500 hover:text-[#E5B842] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-200">Admin</p>
            <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
          </div>
          <div className="w-10 h-10 bg-[#111] border border-[#E5B842]/30 rounded-full flex items-center justify-center text-[#E5B842]">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
