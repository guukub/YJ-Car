import prisma from "@/lib/prisma"
import { Car, Clock, CheckCircle2, TrendingUp, TrendingDown, DollarSign, ListOrdered, ChevronRight, Activity } from "lucide-react"
import Link from "next/link"
import { RevenueChart } from "@/components/admin/DashboardCharts"
import DashboardFilter from "@/components/admin/DashboardFilter"
import DashboardHeader from "@/components/admin/dashboard/DashboardHeader"
import DashboardKPICards from "@/components/admin/dashboard/DashboardKPICards"
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
      <DashboardHeader periodStart={periodStart} periodEnd={periodEnd} />

      <DashboardKPICards
        periodRevenue={periodRevenue}
        periodTransfer={periodTransfer}
        periodCash={periodCash}
        periodUnpaid={periodUnpaid}
        periodJobsCount={periodJobs.length}
        promotionCount={promotionCount}
        typeCounts={typeCounts}
        netProfit={netProfit}
        periodExpenseTotal={periodExpenseTotal}
      />

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
