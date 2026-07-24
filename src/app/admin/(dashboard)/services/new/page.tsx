import { createService } from "@/app/actions/services"
import { Package, Save } from "lucide-react"

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-yj-black">เพิ่มบริการใหม่</h1>
      </div>

      <form action={createService} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
          <Package className="w-5 h-5 text-yj-gold" />
          ข้อมูลบริการ
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริการ *</label>
            <input type="text" name="name" required placeholder="เช่น ล้างสีดูดฝุ่น" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
            <select name="category" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold bg-white">
              <option value="WASH">ล้างรถ (Wash)</option>
              <option value="COATING">เคลือบเงา/เคลือบแก้ว (Coating)</option>
              <option value="POLISH">ขัดสี (Polish)</option>
              <option value="INTERIOR">ภายใน (Interior)</option>
              <option value="OTHER">อื่นๆ (Other)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (฿) *</label>
            <input type="number" name="price" required min="0" placeholder="0" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea name="description" rows={3} placeholder="คำอธิบายบริการเพิ่มเติม" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
