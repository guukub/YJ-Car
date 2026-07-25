"use client"

import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions/users"
import { useState } from "react"

export default function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirm(`คุณต้องการลบผู้ใช้งาน ${userName || 'นี้'} ใช่หรือไม่?`)) {
      setIsDeleting(true)
      try {
        await deleteUser(userId)
      } catch (error: any) {
        alert(error.message || "เกิดข้อผิดพลาดในการลบผู้ใช้งาน")
        setIsDeleting(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 rounded-lg transition-colors border ${
        isDeleting
          ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
          : "text-red-500 border-transparent hover:border-red-500/30 hover:bg-red-500/10"
      }`}
      title="ลบผู้ใช้งาน"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
