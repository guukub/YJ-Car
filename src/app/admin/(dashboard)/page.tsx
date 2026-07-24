import prisma from "@/lib/prisma"
import { Car, Clock, CheckCircle2, TrendingUp, TrendingDown, DollarSign, ListOrdered, ChevronRight, Activity } from "lucide-react"
import Link from "next/link"
import { RevenueChart } from "@/components/admin/DashboardCharts"
import DashboardFilter from "@/components/admin/DashboardFilter"
import { startOfDay, startOfMonth, endOfMonth, subDays, format } from 'date-fns'
import { th } from 'date-fns/locale'

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ start?: string, end?: string }> }) {
  const { start, end } = await searchParams || {}
  const now = new Date()
  
  let periodStart = startOfMonth(now)
  let periodEnd = endOfMonth(now)
  
  if (start) {
    periodStart = new Date(start + "T00:00:00")
  }
  if (end) {
    periodEnd = new Date(end + "T23:59:59")
  } else if (start) {
    periodEnd = new Date(start + "T23:59:59")
  }

  // 1. Fetch Period Jobs
  const periodJobs = await prisma.jobQueue.findMany({
    where: { date: { gte: periodStart, lte: periodEnd } },
    include: { vehicle: true, services: { include: { service: true } } }
  })

  const typeCounts = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0, 'MC': 0, 'BB': 0, 'Other': 0 }
  periodJobs.forEach(job => {
    const type = job.vehicle?.type || 'Other'
    if (['S', 'M', 'L', 'XL', 'XXL', 'MC', 'BB'].includes(type)) {
      typeCounts[type as keyof typeof typeCounts]++
    } else {
      typeCounts.Other++
    }
  })

  const periodRevenue = periodJobs.reduce((acc, job) => acc + job.netPrice, 0)
  const promotionCount = periodJobs.filter(j => j.isPromotion).length

  let periodTransfer = 0;
  let periodCash = 0;
  let periodUnpaid = 0;

  periodJobs.forEach(job => {
    if (job.paymentMethod === 'TRANSFER') {
      periodTransfer += job.amountPaid;
    } else {
      periodCash += job.amountPaid;
    }
    periodUnpaid += Math.max(0, job.netPrice - job.amountPaid);
  });

  // 2. Fetch Period Expenses
  const periodExpenses = await prisma.expense.findMany({
    where: { date: { gte: periodStart, lte: periodEnd } }
  })
  const periodExpenseTotal = periodExpenses.reduce((acc, exp) => acc + exp.amount, 0)
  
  const netProfit = periodRevenue - periodExpenseTotal

  // 3. Prepare Chart Data (Last 7 Days - Always fixed relative to 'now')
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const dayStart = startOfDay(d);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayJobs = await prisma.jobQueue.findMany({
        where: { date: { gte: dayStart, lte: dayEnd } }
    })
    const dayRevenue = dayJobs.reduce((acc, job) => acc + job.netPrice, 0)
    
    const dayExps = await prisma.expense.findMany({
        where: { date: { gte: dayStart, lte: dayEnd } }
    })
    const dayExpense = dayExps.reduce((acc, exp) => acc + exp.amount, 0)

    chartData.push({
      name: format(d, 'EEE', { locale: th }),
      revenue: dayRevenue,
      expense: dayExpense
    })
  }

  // 4. Popular Services (Period)
  const popularServicesData = await prisma.jobService.groupBy({
    by: ['serviceId'],
    where: {
      job: { date: { gte: periodStart, lte: periodEnd } }
    },
    _count: { serviceId: true },
    orderBy: { _count: { serviceId: 'desc' } },
    take: 5
  })
  
  // Fetch names
  const serviceIds = popularServicesData.map(s => s.serviceId)
  const servicesDetails = await prisma.service.findMany({ where: { id: { in: serviceIds } } })
  const popularServices = popularServicesData.map(ps => ({
    name: servicesDetails.find(s => s.id === ps.serviceId)?.name || 'Unknown',
    count: ps._count.serviceId
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">ภาพรวมระบบ (Dashboard)</h1>
          <p className="text-gray-400 mt-1">ข้อมูลสรุปช่วงวันที่ {format(periodStart, 'dd/MM/yyyy')} - {format(periodEnd, 'dd/MM/yyyy')}</p>
        </div>
        <DashboardFilter />
      </div>

      {/* Primary KPI Cards */}
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
              <h3 className="text-3xl font-bold text-[#E5B842]">{periodJobs.length} <span className="text-base font-normal text-gray-400">คัน</span></h3>
              {promotionCount > 0 && (
                <p className="text-sm text-[#E5B842] font-medium mt-1">ในโปรโมชั่น: {promotionCount} คัน</p>
              )}
            </div>
            <div className="bg-[#0A0A0A] border border-gray-800 p-2.5 rounded-xl text-[#E5B842]">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-800 flex items-center justify-between gap-1 text-xs font-medium">
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">S</span><span className="text-[#E5B842]">{typeCounts.S}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">M</span><span className="text-[#E5B842]">{typeCounts.M}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">L</span><span className="text-[#E5B842]">{typeCounts.L}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">XL</span><span className="text-[#E5B842]">{typeCounts.XL}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">XXL</span><span className="text-[#E5B842]">{typeCounts.XXL}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">MC</span><span className="text-[#E5B842]">{typeCounts.MC}</span></div>
            <div className="flex flex-col items-center gap-1"><span className="text-gray-500">BB</span><span className="text-[#E5B842]">{typeCounts.BB}</span></div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-[#E5B842] mb-2">กราฟรายได้และค่าใช้จ่าย (7 วันล่าสุด)</h2>
          <div className="flex justify-center gap-6 text-sm mb-4">
            <span className="flex items-center gap-2 text-gray-300">
              <div className="w-3 h-3 rounded-full bg-[#E5B842]"></div>รายได้
            </span>
            <span className="flex items-center gap-2 text-gray-300">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>ค่าใช้จ่าย
            </span>
          </div>
          <RevenueChart data={chartData} />
        </div>

        {/* Popular Services */}
        <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6 text-[#E5B842] font-bold text-lg">
            <ListOrdered className="w-5 h-5" />
            บริการยอดนิยม
          </div>
          <div className="space-y-6">
            {popularServices.length === 0 ? (
              <p className="text-center text-gray-500 py-4">ยังไม่มีข้อมูลการใช้บริการ</p>
            ) : (
              popularServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center group cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full border border-[#E5B842] text-[#E5B842] flex items-center justify-center font-bold text-sm bg-[#0A0A0A]">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{service.name}</span>
                  </div>
                  <span className="text-[#E5B842] font-bold">{service.count} <span className="text-sm font-normal text-gray-400">ครั้ง</span></span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
