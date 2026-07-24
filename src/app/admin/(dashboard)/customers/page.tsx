import prisma from "@/lib/prisma"
import { Search, Plus, Download, Users, Crown, UserPlus, Phone, Wallet, Car, ChevronDown, MoreHorizontal, FileText } from "lucide-react"
import Link from "next/link"
import { startOfMonth, formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { clearCustomerBalance } from "@/app/actions/customers"

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a150f] to-[#050a05] border border-[#1a3a22] rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-[#112a1a] p-3 rounded-xl border border-[#1a3a22]">
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-green-500/80 font-medium text-sm mb-1">ยอดขายจากลูกค้า</p>
              <h3 className="text-3xl font-bold text-[#E5B842] tracking-tight">฿{totalRevenue.toLocaleString()}</h3>
              <p className="text-gray-400 text-xs mt-2">ลูกค้า {totalCustomers} ราย</p>
            </div>
          </div>
          {/* Decorative Sparkline */}
          <div className="absolute bottom-4 right-4 w-24 h-12">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 0" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="100" cy="0" r="3" fill="#22c55e" />
              <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 0 L100 40 L0 40 Z" fill="url(#gradient-green-cust)" opacity="0.2" />
              <defs>
                <linearGradient id="gradient-green-cust" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
              <Users className="w-5 h-5 text-[#E5B842]" />
            </div>
            <p className="text-gray-300 font-medium text-sm">ลูกค้า</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">{totalCustomers.toLocaleString()}</h3>
            <p className="text-gray-500 text-xs mt-1">ลูกค้าทั้งหมด</p>
          </div>
        </div>

        {/* VIP Customers */}
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
              <Crown className="w-5 h-5 text-[#E5B842]" />
            </div>
            <p className="text-gray-300 font-medium text-sm">ลูกค้า VIP</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">{vipCustomers.toLocaleString()}</h3>
            <p className="text-gray-500 text-xs mt-1">ยอดซื้อ ≥ {VIP_THRESHOLD.toLocaleString()}</p>
          </div>
        </div>

        {/* New Customers */}
        <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
              <UserPlus className="w-5 h-5 text-[#E5B842]" />
            </div>
            <p className="text-gray-300 font-medium text-sm">ลูกค้าใหม่ (เดือนนี้)</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white tracking-tight">{newCustomersThisMonth.toLocaleString()}</h3>
            <p className="text-gray-500 text-xs mt-1">ลูกค้าใหม่ (เดือนนี้)</p>
          </div>
        </div>
      </div>

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

      {/* Data Table */}
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
                  const isVip = customer.totalSpent >= VIP_THRESHOLD;
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
    </div>
  )
}
