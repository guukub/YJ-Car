import { createService } from "@/app/actions/services"
import { Package, Save } from "lucide-react"

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">เพิ่มบริการใหม่</h1>
      </div>

      <form action={createService} className="bg-[#111] p-6 rounded-3xl border border-gray-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-4 text-gray-200 font-bold text-lg">
          <Package className="w-5 h-5 text-[#E5B842]" />
          ข้อมูลบริการ
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ชื่อบริการ *</label>
            <input type="text" name="name" required placeholder="เช่น ล้างสีดูดฝุ่น" className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">หมวดหมู่ *</label>
            <select name="category" required className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors" style={{ colorScheme: 'dark' }}>
              <option value="WASH">ล้างรถ (Wash)</option>
              <option value="COATING">เคลือบเงา/เคลือบแก้ว (Coating)</option>
              <option value="POLISH">ขัดสี (Polish)</option>
              <option value="INTERIOR">ภายใน (Interior)</option>
              <option value="OTHER">อื่นๆ (Other)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ราคา (฿) *</label>
            <input type="number" name="price" required min="0" placeholder="0" className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">รายละเอียด</label>
            <textarea name="description" rows={3} placeholder="คำอธิบายบริการเพิ่มเติม" className="w-full bg-[#0A0A0A] border border-[#222] text-gray-200 rounded-lg px-4 py-2 focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none transition-colors placeholder:text-gray-600"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[#222]">
          <button type="submit" className="bg-[#E5B842] text-[#0A0A0A] font-bold px-8 py-3 rounded-xl hover:bg-[#FACC15] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(229,184,66,0.2)] hover:shadow-[0_0_20px_rgba(229,184,66,0.4)]">
            <Save className="w-5 h-5" />
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
