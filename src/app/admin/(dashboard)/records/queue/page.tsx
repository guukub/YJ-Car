import prisma from "@/lib/prisma"
import QueueForm from "@/components/admin/QueueForm"

export default async function AddQueuePage() {
  const services = await prisma.service.findMany({
    orderBy: { category: 'asc' }
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const countToday = await prisma.job.count({
    where: {
      date: {
        gte: today
      }
    }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">เพิ่มคิวล้างรถใหม่</h1>
        <p className="text-gray-500">บันทึกข้อมูลลูกค้า รถ และบริการที่ต้องการ</p>
      </div>

      <QueueForm services={services} countToday={countToday} />
    </div>
  )
}
