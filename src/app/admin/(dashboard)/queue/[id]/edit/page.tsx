import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import QueueForm from "@/components/admin/QueueForm"

export default async function EditQueuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const job = await prisma.jobQueue.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      services: {
        include: { service: true }
      }
    }
  })

  if (!job) notFound()
  
  const staffs = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "STAFF"] } }
  })
  
  const services = await prisma.service.findMany({
    where: { category: { not: "CUSTOM" } },
    orderBy: { category: 'asc' }
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/queue" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการข้อมูลและสถานะคิว: Q{job.queueNumber}</h1>
          <p className="text-gray-500">
            {job.customer.name} - {job.vehicle.licensePlate} ({job.vehicle.brand})
          </p>
        </div>
      </div>

      <QueueForm services={services} countToday={job.queueNumber} initialData={job} staffs={staffs} />
    </div>
  )
}
