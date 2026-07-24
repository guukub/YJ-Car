import DashboardFilter from "@/components/admin/DashboardFilter"
import { format } from "date-fns"

interface DashboardHeaderProps {
  periodStart: Date
  periodEnd: Date
}

export default function DashboardHeader({ periodStart, periodEnd }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">ภาพรวมระบบ (Dashboard)</h1>
        <p className="text-gray-400 mt-1">
          ข้อมูลสรุปช่วงวันที่ {format(periodStart, 'dd/MM/yyyy')} - {format(periodEnd, 'dd/MM/yyyy')}
        </p>
      </div>
      <DashboardFilter />
    </div>
  )
}
