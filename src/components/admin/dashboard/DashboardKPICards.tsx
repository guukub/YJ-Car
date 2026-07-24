import { DollarSign, Car, TrendingUp, TrendingDown, ChevronRight } from "lucide-react"
import Link from "next/link"

interface DashboardKPICardsProps {
  periodRevenue: number
  periodTransfer: number
  periodCash: number
  periodUnpaid: number
  periodJobsCount: number
  promotionCount: number
  typeCounts: Record<string, number>
  netProfit: number
  periodExpenseTotal: number
}

export default function DashboardKPICards({
  periodRevenue,
  periodTransfer,
  periodCash,
  periodUnpaid,
  periodJobsCount,
  promotionCount,
  typeCounts,
  netProfit,
  periodExpenseTotal,
}: DashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="bg-[#111] border border-[#E5B842] rounded-2xl p-6 shadow-[0_0_15px_rgba(229,184,66,0.1)]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#E5B842] font-medium mb-1">รายได้รวม</p>
            <h3 className="text-3xl font-bold text-[#E5B842]">฿{periodRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-[#0A0A0A] border border-gray-800 p-2.5 rounded-xl">
            <DollarSign className="w-5 h-5 text-[#E5B842]" />
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-[#E5B842]/30 grid grid-cols-3 gap-2 text-sm">
          <div>
            <div className="text-[#E5B842] text-xs">โอน</div>
            <div className="font-semibold text-[#E5B842]">฿{periodTransfer.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[#E5B842] text-xs">เงินสด</div>
            <div className="font-semibold text-[#E5B842]">฿{periodCash.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[#E5B842] text-xs">ค้างจ่าย</div>
            <div className="font-semibold text-[#E5B842]">฿{periodUnpaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Cars Today */}
      <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 font-medium mb-1">รถเข้ารับบริการ</p>
            <h3 className="text-3xl font-bold text-[#E5B842]">
              {periodJobsCount} <span className="text-base font-normal text-gray-400">คัน</span>
            </h3>
            {promotionCount > 0 && (
              <p className="text-sm text-[#E5B842] font-medium mt-1">ในโปรโมชั่น: {promotionCount} คัน</p>
            )}
          </div>
          <div className="bg-[#0A0A0A] border border-gray-800 p-2.5 rounded-xl text-[#E5B842]">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between gap-1 text-xs font-medium">
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">S</span><span className="text-[#E5B842]">{typeCounts.S || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">M</span><span className="text-[#E5B842]">{typeCounts.M || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">L</span><span className="text-[#E5B842]">{typeCounts.L || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">XL</span><span className="text-[#E5B842]">{typeCounts.XL || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">XXL</span><span className="text-[#E5B842]">{typeCounts.XXL || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">MC</span><span className="text-[#E5B842]">{typeCounts.MC || 0}</span></div>
          <div className="flex flex-col items-center gap-1"><span className="text-gray-500">BB</span><span className="text-[#E5B842]">{typeCounts.BB || 0}</span></div>
        </div>
      </div>

      {/* Profit */}
      <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 font-medium mb-1">กำไรสุทธิ</p>
            <h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-[#E5B842]' : 'text-red-500'}`}>
              {netProfit >= 0 ? '+' : '-'}฿{Math.abs(netProfit).toLocaleString()}
            </h3>
          </div>
          <div className="bg-[#0A0A0A] border border-gray-800 p-2.5 rounded-xl">
            {netProfit >= 0 ? <TrendingUp className="w-5 h-5 text-[#E5B842]" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
          </div>
        </div>
        <div className="mt-8 flex justify-between text-sm">
          <span className="text-gray-400">รายได้ ฿{periodRevenue.toLocaleString()}</span>
          <span className="text-red-500">รายจ่าย ฿{periodExpenseTotal.toLocaleString()}</span>
        </div>
      </div>

      {/* Expenses Today */}
      <div className="bg-[#111] rounded-2xl p-6 border border-gray-800 shadow-sm flex flex-col">
        <div className="flex justify-between items-start flex-1">
          <div>
            <p className="text-gray-400 font-medium mb-1">ค่าใช้จ่ายรวม</p>
            <h3 className="text-3xl font-bold text-red-500">฿{periodExpenseTotal.toLocaleString()}</h3>
          </div>
          <div className="bg-[#0A0A0A] border border-gray-800 p-2.5 rounded-xl">
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
        </div>
        <Link href="/admin/records/finance" className="mt-auto pt-4 text-sm text-[#E5B842] hover:text-yellow-500 font-medium flex items-center gap-1 transition-colors">
          บันทึกค่าใช้จ่าย <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
