import prisma from "@/lib/prisma"
import { Plus, Edit2, Camera, Receipt } from "lucide-react"
import Link from "next/link"
import QuickPayButton from "@/components/admin/QuickPayButton"
import QueueFilter from "@/components/admin/QueueFilter"

const STATUS_COLORS: Record<string, string> = {
  "WAITING": "bg-gray-100 text-gray-800",       // รอเข้ารับบริการ
  "RECEIVED": "bg-yellow-100 text-yellow-800",   // รับรถแล้ว
  "WASHING": "bg-blue-100 text-blue-800",        // กำลังล้าง
  "POLISHING": "bg-purple-100 text-purple-800",  // กำลังขัดสี
  "COATING": "bg-indigo-100 text-indigo-800",    // กำลังเคลือบ
  "CHECKING": "bg-orange-100 text-orange-800",   // รอตรวจสอบ
  "FINISHED": "bg-green-100 text-green-800",     // เสร็จแล้ว
  "DELIVERED": "bg-teal-100 text-teal-800",      // ส่งมอบรถแล้ว
  "CANCELLED": "bg-red-100 text-red-800",        // ยกเลิก
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

export default async function QueuePage({ searchParams }: { searchParams: Promise<{ start?: string, end?: string, paymentStatus?: string }> }) {
  const { start, end, paymentStatus } = await searchParams || {};
  
  let whereClause: any = {};
  
  if (start || end) {
    whereClause.date = {};
    if (start) {
      whereClause.date.gte = new Date(start + "T00:00:00");
    }
    if (end) {
      whereClause.date.lte = new Date(end + "T23:59:59");
    } else if (start) {
      whereClause.date.lte = new Date(start + "T23:59:59");
    }
  }

  let jobs = await prisma.jobQueue.findMany({
    where: whereClause,
    include: {
      customer: true,
      vehicle: true,
      services: {
        include: { service: true }
      },
      staff: true
    },
    orderBy: { queueNumber: 'desc' }
  })
  
  if (paymentStatus === 'PAID') {
    jobs = jobs.filter(job => job.amountPaid >= job.netPrice);
  } else if (paymentStatus === 'UNPAID') {
    jobs = jobs.filter(job => job.netPrice > job.amountPaid);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">ประวัติคิวรถ (ทั้งหมด)</h1>
          <p className="text-gray-500">แสดงรายการบิลและคิวที่เคยทำทั้งหมด</p>
        </div>
        <div className="flex items-center gap-4">
          <QueueFilter />
          <Link href="/admin/records/queue" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> เพิ่มคิวใหม่
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase sticky top-0">
              <tr>
                <th className="px-4 py-4 font-medium">เลขคิว</th>
                <th className="px-4 py-4 font-medium">เวลาเข้า</th>
                <th className="px-4 py-4 font-medium">ลูกค้า</th>
                <th className="px-4 py-4 font-medium">รถยนต์</th>
                <th className="px-4 py-4 font-medium">บริการที่เลือก</th>
                <th className="px-4 py-4 font-medium">ยอดสุทธิ (฿)</th>
                <th className="px-4 py-4 font-medium">สถานะชำระเงิน</th>
                <th className="px-4 py-4 font-medium">วันหมดประกัน</th>
                <th className="px-4 py-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    ยังไม่มีคิวล้างรถในวันนี้
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-bold text-lg text-yj-dark-blue">Q{job.queueNumber}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-500 mb-0.5">{new Date(job.timeIn).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}</div>
                      <div className="text-gray-800">{new Date(job.timeIn).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-800">{job.customer.name}</div>
                      <div className="text-xs text-gray-500">{job.customer.phone}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-800">{job.vehicle.licensePlate}</div>
                      <div className="text-xs text-gray-500">{job.vehicle.brand} {job.vehicle.model} ({job.vehicle.color})</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {job.services.map(s => (
                          <span key={s.id} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {s.service.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-green-600">{job.netPrice.toLocaleString()}</div>
                      {job.discount > 0 && <div className="text-xs text-red-500 line-through">{job.totalPrice.toLocaleString()}</div>}
                      <div className="mt-1 text-xs">
                        {job.amountPaid > 0 && (
                          <div className="text-gray-600">ชำระแล้ว: {job.amountPaid.toLocaleString()}</div>
                        )}
                        {(job.netPrice - job.amountPaid) > 0 && (
                          <div className="text-red-500 font-medium">ค้างจ่าย: {(job.netPrice - job.amountPaid).toLocaleString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {job.netPrice > job.amountPaid && job.amountPaid > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          ค้างจ่าย
                        </span>
                      ) : job.netPrice > job.amountPaid && job.amountPaid === 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          ยังไม่ชำระ
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          ชำระแล้ว
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {job.warrantyEnd ? new Date(job.warrantyEnd).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/queue/${job.id}/edit`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200" title="เปลี่ยนสถานะ/แก้ไข/ชำระเงิน">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <QuickPayButton jobId={job.id} netPrice={job.netPrice} isPaid={job.paymentStatus === 'PAID'} />
                        <button className="p-1.5 text-orange-500 hover:bg-orange-50 rounded border border-transparent hover:border-orange-200" title="แนบรูปภาพ">
                          <Camera className="w-4 h-4" />
                        </button>
                        <Link href={`/admin/queue/${job.id}/receipt`} className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-transparent hover:border-green-200 inline-block" title="พิมพ์ใบเสร็จ">
                          <Receipt className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
