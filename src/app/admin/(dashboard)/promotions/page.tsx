import { Tag, Plus, Edit2, Trash2 } from "lucide-react"

export default function PromotionsPage() {
  // ข้อมูลจำลองสำหรับโปรโมชั่น
  const promotions = [
    {
      id: 1,
      name: "โปรโมชั่นล้างรถช่วงหน้าฝน",
      description: "ส่วนลดพิเศษ 10% สำหรับแพ็กเกจล้างสีดูดฝุ่นเคลือบเงา",
      discountAmount: 10,
      discountType: "PERCENT",
      startDate: "2026-07-01",
      endDate: "2026-08-31",
      isActive: true,
    },
    {
      id: 2,
      name: "แถมฟรี อบโอโซนดับกลิ่น",
      description: "เมื่อใช้บริการขัดเคลือบสีชุดใหญ่ แถมฟรีอบโอโซนมูลค่า 500 บาท",
      discountAmount: 500,
      discountType: "FIXED",
      startDate: "2026-07-15",
      endDate: "2026-07-31",
      isActive: true,
    },
    {
      id: 3,
      name: "ส่วนลดลูกค้าใหม่",
      description: "ลดทันที 50 บาท สำหรับลูกค้าที่มาใช้บริการครั้งแรก",
      discountAmount: 50,
      discountType: "FIXED",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      isActive: false,
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">โปรโมชั่นและส่วนลด</h1>
          <p className="text-gray-500">จัดการแคมเปญโปรโมชั่นสำหรับลูกค้า</p>
        </div>
        <button className="bg-yj-gold text-yj-dark-blue font-bold px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> เพิ่มโปรโมชั่น
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อโปรโมชั่น / รายละเอียด</th>
                <th className="px-6 py-4 font-medium">ส่วนลด</th>
                <th className="px-6 py-4 font-medium">ระยะเวลา</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0 mt-1">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-yj-black text-base">{promo.name}</div>
                        <div className="text-gray-500 mt-1">{promo.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-500 text-lg">
                      {promo.discountType === 'PERCENT' ? `${promo.discountAmount}%` : `฿${promo.discountAmount}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>เริ่ม: {new Date(promo.startDate).toLocaleDateString('th-TH')}</div>
                    <div>สิ้นสุด: {new Date(promo.endDate).toLocaleDateString('th-TH')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {promo.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
