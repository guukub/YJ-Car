import prisma from "@/lib/prisma"
import { Search, ChevronDown } from "lucide-react"
import { startOfMonth, formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import CustomerHeader from "@/components/admin/customers/CustomerHeader"
import CustomerKPICards from "@/components/admin/customers/CustomerKPICards"
import CustomerTable from "@/components/admin/customers/CustomerTable"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const q = params.q || "";

  // 1. Fetch Customers with aggregations
  const customers = await prisma.customer.findMany({
    where: q ? {
      OR: [
        { name: { contains: q } },
        { phone: { contains: q } },
        { vehicles: { some: { licensePlate: { contains: q } } } }
      ]
    } : undefined,
    include: {
      vehicles: true,
      jobs: {
        select: {
          netPrice: true,
          date: true,
          paymentStatus: true,
          amountPaid: true,
        }
      },
      _count: {
        select: { jobs: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // 2. Compute KPI Metrics
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  
  let totalRevenue = 0
  let totalCustomers = customers.length
  let newCustomersThisMonth = 0
  let vipCustomers = 0
  
  const VIP_THRESHOLD = 5000 // กำหนดยอดใช้จ่าย VIP

  const processedCustomers = customers.map(customer => {
    // Total spent by this customer
    const totalSpent = customer.jobs.reduce((sum, job) => sum + job.netPrice, 0)
    const totalPaid = customer.jobs.reduce((sum, job) => {
      if ((job.amountPaid || 0) > 0) return sum + job.amountPaid;
      if (job.paymentStatus === 'PAID') return sum + job.netPrice;
      return sum;
    }, 0);
    const totalOutstanding = Math.max(0, totalSpent - totalPaid);
    totalRevenue += totalSpent
    
    if (customer.createdAt >= currentMonthStart) {
      newCustomersThisMonth++
    }
    
    if (totalSpent >= VIP_THRESHOLD) {
      vipCustomers++
    }

    // Last visit
    let lastVisit = "ยังไม่เคยใช้บริการ"
    let lastVisitDate = null
    if (customer.jobs.length > 0) {
      const dates = customer.jobs.map(j => new Date(j.date).getTime())
      const maxDate = new Date(Math.max(...dates))
      lastVisitDate = maxDate
      lastVisit = formatDistanceToNow(maxDate, { addSuffix: true, locale: th })
    }

    return {
      ...customer,
      totalSpent,
      totalPaid,
      totalOutstanding,
      lastVisit,
      lastVisitDate
    }
  })

  return (
    <div className="space-y-6 pb-12">
      <CustomerHeader totalCustomers={totalCustomers} />

      <CustomerKPICards
        totalRevenue={totalRevenue}
        totalCustomers={totalCustomers}
        vipCustomers={vipCustomers}
        newCustomersThisMonth={newCustomersThisMonth}
        vipThreshold={VIP_THRESHOLD}
      />

      {/* Filters and Search */}
      <div className="bg-[#0A0A0A] rounded-xl border border-gray-800 shadow-sm p-4">
        <form method="GET" className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              name="q"
              defaultValue={q}
              placeholder="ค้นหาชื่อ, เบอร์โทรศัพท์..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:border-[#E5B842] focus:ring-1 focus:ring-[#E5B842] text-sm bg-[#111] text-gray-200 placeholder-gray-500 transition-colors"
            />
            <button type="submit" className="hidden">Search</button>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative">
               <select className="appearance-none border border-[#E5B842] rounded-lg pl-4 pr-10 py-2 text-sm text-[#E5B842] bg-transparent focus:outline-none cursor-pointer">
                  <option className="bg-[#111] text-white">ประเภท: ทั้งหมด</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5B842] pointer-events-none" />
             </div>
             <div className="relative">
               <select className="appearance-none border border-[#E5B842] rounded-lg pl-4 pr-10 py-2 text-sm text-[#E5B842] bg-transparent focus:outline-none cursor-pointer">
                  <option className="bg-[#111] text-white">สถานะ: ทั้งหมด</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5B842] pointer-events-none" />
             </div>
          </div>
        </form>
      </div>

      <CustomerTable processedCustomers={processedCustomers} vipThreshold={VIP_THRESHOLD} />
    </div>
  )
}
