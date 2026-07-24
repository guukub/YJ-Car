import { createCustomerManually } from "@/app/actions/customers"
import { Users, Car, Save } from "lucide-react"

export default function AddCustomerPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">เพิ่มข้อมูลลูกค้า</h1>
        <p className="text-gray-500">บันทึกประวัติลูกค้าและรถยนต์เข้าสู่ระบบ (โดยยังไม่ต้องเปิดบิล)</p>
      </div>

      <form action={createCustomerManually} className="space-y-6">
        
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-yj-dark-blue font-bold text-lg mb-2">
            <Users className="w-5 h-5 text-yj-gold" />
            ข้อมูลส่วนตัวลูกค้า
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล *</label>
              <input type="text" name="name" required placeholder="เช่น สมชาย ใจดี" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ *</label>
              <input type="tel" name="phone" required placeholder="เช่น 0812345678" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-yj-dark-blue font-bold text-lg mb-2">
             <Car className="w-5 h-5 text-yj-gold" />
             ข้อมูลรถยนต์ (เลือกระบุได้)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ</label>
              <input type="text" name="licensePlate" placeholder="เช่น กข 1234 กทม" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อ (Brand)</label>
              <input type="text" name="brand" placeholder="เช่น Honda" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รุ่น (Model)</label>
              <input type="text" name="model" placeholder="เช่น Civic" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สีรถ</label>
              <input type="text" name="color" placeholder="เช่น ขาว" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            บันทึกข้อมูลลูกค้า
          </button>
        </div>
      </form>
    </div>
  )
}
