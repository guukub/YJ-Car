import prisma from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit2 } from "lucide-react"
import { deleteService } from "@/app/actions/services"
import DeleteServiceButton from "@/components/admin/DeleteServiceButton"

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">บริการ / แพ็กเกจ</h1>
          <p className="text-gray-500">จัดการข้อมูลบริการและราคา</p>
        </div>
        <Link href="/admin/services/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> เพิ่มบริการใหม่
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อบริการ</th>
                <th className="px-6 py-4 font-medium">หมวดหมู่</th>
                <th className="px-6 py-4 font-medium">ราคา (฿)</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    ยังไม่มีข้อมูลบริการ
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-yj-black">
                      {service.name}
                      {service.description && <p className="text-xs text-gray-500 font-normal mt-1">{service.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{service.category}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{service.price.toLocaleString()}</td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <Link href={`/admin/services/${service.id}/edit`} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="แก้ไข">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <DeleteServiceButton id={service.id} />
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
