import { createUser } from "@/app/actions/users"
import { Shield, Save, User as UserIcon } from "lucide-react"

export default function NewUserPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">เพิ่มผู้ใช้งานใหม่</h1>
        <p className="text-gray-400 mt-1 text-sm">สร้างบัญชีสำหรับผู้ดูแลระบบหรือพนักงาน</p>
      </div>

      <form action={createUser} className="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-4 text-gray-200 font-bold text-lg">
          <UserIcon className="w-5 h-5 text-[#E5B842]" />
          ข้อมูลผู้ใช้งาน
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อ-นามสกุล *</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="กรอกชื่อ-นามสกุล" 
              className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">อีเมล (Email) *</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="example@email.com" 
              className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">รหัสผ่าน (Password) *</label>
            <input 
              type="password" 
              name="password" 
              required 
              placeholder="ตั้งรหัสผ่าน" 
              className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ตำแหน่ง (Role) *</label>
            <select 
              name="role" 
              required 
              className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors" 
              style={{ colorScheme: 'dark' }}
            >
              <option value="STAFF">พนักงาน (STAFF)</option>
              <option value="OWNER">ผู้ดูแลระบบ (OWNER)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[#222]">
          <button 
            type="submit" 
            className="bg-[#E5B842] text-[#0A0A0A] font-bold px-8 py-3 rounded-xl hover:bg-[#FACC15] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(229,184,66,0.2)] hover:shadow-[0_0_20px_rgba(229,184,66,0.4)]"
          >
            <Save className="w-5 h-5" />
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
