import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { User, Phone, Car, Clock, Calendar, CheckCircle2 } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  "WAITING": "bg-gray-100 text-gray-800",
  "RECEIVED": "bg-yellow-100 text-yellow-800",
  "WASHING": "bg-blue-100 text-blue-800",
  "POLISHING": "bg-purple-100 text-purple-800",
  "COATING": "bg-indigo-100 text-indigo-800",
  "CHECKING": "bg-orange-100 text-orange-800",
  "FINISHED": "bg-green-100 text-green-800",
  "DELIVERED": "bg-teal-100 text-teal-800",
  "CANCELLED": "bg-red-100 text-red-800",
}

const STATUS_LABELS: Record<string, string> = {
  "WAITING": "รอเข้ารับบริการ",
  "RECEIVED": "รับรถแล้ว",
  "WASHING": "กำลังล้าง",
  "POLISHING": "กำลังขัดสี",
  "COATING": "กำลังเคลือบ",
  "CHECKING": "รอตรวจสอบ",
  "FINISHED": "เสร็จแล้ว",
  "DELIVERED": "ส่งมอบรถแล้ว",
  "CANCELLED": "ยกเลิก",
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: true,
      jobs: {
        include: {
          vehicle: true,
          services: { include: { service: true } }
        },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!customer) notFound()

  const totalSpent = customer.jobs.reduce((acc, job) => acc + job.netPrice, 0)
  const totalPaid = customer.jobs.reduce((sum, job) => {
    if (job.paymentStatus === 'PAID') return sum + job.netPrice;
    return sum + (job.amountPaid || 0);
  }, 0);
  const totalOutstanding = Math.max(0, totalSpent - totalPaid);
  const visitCount = customer.jobs.length

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-yj-black">ข้อมูลลูกค้า</h1>
          <p className="text-gray-500">ประวัติการใช้บริการและข้อมูลรถ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-1 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-yj-black">{customer.name}</h2>
              <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
                <Phone className="w-4 h-4" /> {customer.phone}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">ยอดใช้จ่ายสะสม</p>
              <p className="font-bold text-gray-800 text-lg">฿{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">จำนวนครั้งที่เข้าใช้</p>
              <p className="font-bold text-yj-dark-blue text-lg">{visitCount} ครั้ง</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">ชำระแล้ว</p>
              <p className="font-bold text-green-600 text-lg">฿{totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">ค้างชำระ</p>
              <p className="font-bold text-red-500 text-lg">฿{totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" /> รถที่ลงทะเบียน
            </h3>
            <div className="space-y-3">
              {customer.vehicles.map(v => (
                <div key={v.id} className="p-3 border border-gray-100 rounded-xl">
                  <p className="font-bold text-yj-black text-lg">{v.licensePlate}</p>
                  <p className="text-sm text-gray-500">{v.brand} {v.model} - สี{v.color}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm md:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-yj-dark-blue flex items-center gap-2">
              <Clock className="w-5 h-5 text-yj-gold" /> ประวัติการใช้บริการ
            </h2>
          </div>
          <div className="p-0 overflow-y-auto max-h-[600px]">
             {customer.jobs.length === 0 ? (
                <div className="p-8 text-center text-gray-400">ยังไม่มีประวัติการใช้บริการ</div>
             ) : (
                <div className="divide-y divide-gray-100">
                  {customer.jobs.map(job => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                            Q{job.queueNumber}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> 
                            {new Date(job.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] || STATUS_COLORS["WAITING"]}`}>
                          {STATUS_LABELS[job.status] || job.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="font-semibold text-yj-black text-sm">รถยนต์: </span>
                        <span className="text-gray-600 text-sm">{job.vehicle.licensePlate} ({job.vehicle.brand})</span>
                      </div>

                      <div className="mb-4">
                        <span className="font-semibold text-yj-black text-sm block mb-1">บริการที่ทำ:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {job.services.map(s => (
                            <li key={s.id}>{s.service.name} <span className="text-gray-400 ml-1">(฿{s.priceAtTime.toLocaleString()})</span></li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-500 italic">{job.notes || "-"}</div>
                        <div className="font-bold text-green-600">
                          ยอดสุทธิ ฿{job.netPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
