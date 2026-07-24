import { Crown, Car, Phone, FileText, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { clearCustomerBalance } from "@/app/actions/customers"

interface ProcessedCustomer {
  id: string
  name: string
  phone: string | null
  totalSpent: number
  totalPaid: number
  totalOutstanding: number
  lastVisit: string
  lastVisitDate: Date | null
  _count: { jobs: number }
  vehicles: { id: string; licensePlate: string }[]
}

interface CustomerTableProps {
  processedCustomers: ProcessedCustomer[]
  vipThreshold: number
}

export default function CustomerTable({ processedCustomers, vipThreshold }: CustomerTableProps) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-[#E5B842] bg-[#050505] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-medium">ลูกค้า</th>
              <th className="px-6 py-4 font-medium text-center">เบอร์โทร</th>
              <th className="px-6 py-4 font-medium text-center">จำนวนบิล</th>
              <th className="px-6 py-4 font-medium text-center">ยอดซื้อรวม</th>
              <th className="px-6 py-4 font-medium text-center">ชำระแล้ว</th>
              <th className="px-6 py-4 font-medium text-center">ค้างชำระ</th>
              <th className="px-6 py-4 font-medium text-center">เข้ามาล่าสุด</th>
              <th className="px-6 py-4 font-medium text-center">สถานะ</th>
              <th className="px-6 py-4 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {processedCustomers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  ไม่พบข้อมูลลูกค้าที่ค้นหา
                </td>
              </tr>
            ) : (
              processedCustomers.map((customer) => {
                const isVip = customer.totalSpent >= vipThreshold;
                return (
                  <tr key={customer.id} className="hover:bg-[#111] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 border
                          ${isVip ? 'bg-[#1a1500] text-[#E5B842] border-[#E5B842]/30' : 'bg-gray-800 text-gray-300 border-gray-700'}
                        `}>
                          {customer.name.substring(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-200 text-base">{customer.name}</span>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                             <span className="text-[10px] bg-[#1a1500] text-[#E5B842] px-2 py-0.5 rounded border border-[#E5B842]/30 font-medium">
                                ลูกค้า
                             </span>
                             {isVip && (
                                <span className="text-[10px] bg-yellow-900/30 text-[#E5B842] px-2 py-0.5 rounded border border-yellow-700/30 font-medium flex items-center gap-1">
                                   <Crown className="w-3 h-3" /> VIP
                                </span>
                             )}
                             <span className="text-[10px] bg-[#111] text-gray-300 px-2 py-0.5 rounded border border-gray-700 font-medium">
                                {customer._count.jobs} บิล
                             </span>
                             {customer.vehicles.map(v => (
                                <span key={v.id} className="text-[10px] bg-[#111] text-gray-300 px-2 py-0.5 rounded border border-gray-700 font-medium flex items-center gap-1">
                                   <Car className="w-3 h-3 text-gray-500" />
                                   {v.licensePlate}
                                </span>
                             ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-2 text-gray-400">
                        {customer.phone ? (
                          <>
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </>
                        ) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="inline-flex items-center justify-center gap-1.5 bg-[#1a1500] text-[#E5B842] px-3 py-1.5 rounded-lg font-bold text-xs border border-[#E5B842]/30">
                          <FileText className="w-3.5 h-3.5" />
                          {customer._count.jobs}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-white">
                      ฿{customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-green-500">
                      ฿{customer.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {customer.totalOutstanding > 0 ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="font-bold text-red-500">
                            ฿{customer.totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <form action={clearCustomerBalance.bind(null, customer.id)}>
                            <button type="submit" className="text-[10px] font-normal bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors">
                              เคลียร์ยอดค้าง
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="font-bold text-red-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-400 text-xs">
                      {customer.lastVisit}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="inline-flex items-center gap-1.5 text-xs text-green-500 border border-green-500/20 px-3 py-1 rounded-full bg-green-500/10 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> ปกติ
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link href={`/admin/customers/${customer.id}`} className="inline-flex p-2 border border-[#E5B842] text-[#E5B842] hover:bg-[#E5B842]/10 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                       </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
