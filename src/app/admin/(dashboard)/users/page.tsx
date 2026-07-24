import prisma from "@/lib/prisma"
import { Shield, User as UserIcon } from "lucide-react"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">ผู้ใช้งานระบบ</h1>
          <p className="text-gray-500">จัดการสิทธิ์พนักงานและผู้ดูแลระบบ</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อ / Email</th>
                <th className="px-6 py-4 font-medium">ตำแหน่ง (Role)</th>
                <th className="px-6 py-4 font-medium">วันที่เข้าระบบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-yj-black">{user.name || "ไม่มีชื่อ"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max
                      ${user.role === 'OWNER' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                    `}>
                      {user.role === 'OWNER' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
