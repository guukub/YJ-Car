import { Users, Plus, Download } from "lucide-react"
import Link from "next/link"

export default function CustomerHeader({ totalCustomers }: { totalCustomers: number }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#E5B842]" />
          <h1 className="text-2xl font-bold text-[#E5B842]">ลูกค้า / คู่ค้า</h1>
        </div>
        <p className="text-gray-400 text-sm mt-1 ml-9">จัดการและดูข้อมูลลูกค้าของคุณ • {totalCustomers} รายการ</p>
      </div>
      <div className="flex gap-3">
        <Link href="/admin/records/customer" className="bg-transparent border border-[#E5B842] text-[#E5B842] px-4 py-2 rounded-lg font-medium hover:bg-[#E5B842]/10 transition-colors flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> เพิ่มลูกค้า/คู่ค้า
        </Link>
        <button className="bg-transparent border border-[#E5B842] text-[#E5B842] px-4 py-2 rounded-lg font-medium hover:bg-[#E5B842]/10 transition-colors flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
    </div>
  )
}
