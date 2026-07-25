import prisma from "@/lib/prisma"
import { Shield, User as UserIcon, Plus } from "lucide-react"
import Link from "next/link"
import DeleteUserButton from "@/components/admin/DeleteUserButton"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">ผู้ใช้งานระบบ</h1>
          <p className="text-gray-400 mt-1 text-sm">จัดการสิทธิ์พนักงานและผู้ดูแลระบบ</p>
        </div>
        <Link 
          href="/admin/users/new" 
          className="bg-[#E5B842] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#FACC15] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(229,184,66,0.2)] hover:shadow-[0_0_20px_rgba(229,184,66,0.4)]"
        >
          <Plus className="w-5 h-5" /> เพิ่มผู้ใช้งาน
        </Link>
      </div>

      <div className="bg-[#111] rounded-3xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-[#E5B842] bg-[#0A0A0A] border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-medium">ชื่อ / Email</th>
                <th className="px-6 py-4 font-medium">ตำแหน่ง (Role)</th>
                <th className="px-6 py-4 font-medium">วันที่เข้าระบบ</th>
                <th className="px-6 py-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors text-gray-300">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#222] border border-gray-700 flex items-center justify-center text-[#E5B842]">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-200">{user.name || "ไม่มีชื่อ"}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max border
                      ${user.role === 'OWNER' 
                        ? 'bg-[#E5B842]/10 text-[#E5B842] border-[#E5B842]/30' 
                        : 'bg-gray-800 text-gray-300 border-gray-700'}
                    `}>
                      {user.role === 'OWNER' && <Shield className="w-3.5 h-3.5" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <DeleteUserButton userId={user.id} userName={user.name || ''} />
                    </div>
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

