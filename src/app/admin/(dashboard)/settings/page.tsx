import prisma from "@/lib/prisma"
import { updateSettings } from "@/app/actions/settings"
import { Settings2, Save, Store, Bell, CreditCard, Clock } from "lucide-react"

export default async function SettingsPage() {
  // @ts-ignore
  let settings = await prisma.setting.findUnique({
    where: { id: "global" }
  })

  if (!settings) {
    settings = {
      id: "default",
      updatedAt: new Date(),
      shopName: "YJ Cars Detailing",
      promptPayId: "",
      lineToken: "",
      openTime: "08:00",
      closeTime: "20:00"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">ตั้งค่าระบบ</h1>
        <p className="text-gray-500">จัดการข้อมูลร้านและการเชื่อมต่อระบบภายนอก</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        
        {/* Shop Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
            <Store className="w-5 h-5 text-yj-gold" />
            ข้อมูลร้าน
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้าน</label>
              <input type="text" name="shopName" defaultValue={settings.shopName} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
          </div>
        </div>

        {/* Shop Hours */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
            <Clock className="w-5 h-5 text-yj-gold" />
            เวลาเปิด-ปิดร้าน
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เวลาเปิดร้าน</label>
              <input type="time" name="openTime" defaultValue={settings.openTime} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เวลาปิดร้าน</label>
              <input type="time" name="closeTime" defaultValue={settings.closeTime} required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
            <CreditCard className="w-5 h-5 text-yj-gold" />
            การรับชำระเงิน (QR Code PromptPay)
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หมายเลขพร้อมเพย์ (เบอร์โทร หรือ บัตรประชาชน)</label>
              <input type="text" name="promptPayId" defaultValue={settings.promptPayId || ""} placeholder="เช่น 0812345678" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
              <p className="text-xs text-gray-500 mt-1">ใช้สำหรับสร้าง QR Code ชำระเงินในหน้าใบเสร็จ</p>
            </div>
          </div>
        </div>

        {/* Line Notify */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
            <Bell className="w-5 h-5 text-yj-gold" />
            แจ้งเตือนผ่าน Line Notify
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line Notify Token</label>
              <input type="password" name="lineToken" defaultValue={settings.lineToken || ""} placeholder="วาง Token จาก Line Notify" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
              <p className="text-xs text-gray-500 mt-1">ระบบจะส่งข้อความแจ้งเตือนเมื่อคิวรถล้างเสร็จ หรือมีการจองคิวเข้ามา</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-5 h-5" />
            บันทึกการตั้งค่า
          </button>
        </div>
      </form>
    </div>
  )
}
