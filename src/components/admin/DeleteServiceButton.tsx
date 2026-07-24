'use client'

import { Trash2 } from "lucide-react"
import { deleteService } from "@/app/actions/services"

export default function DeleteServiceButton({ id }: { id: string }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (confirm('ยืนยันการลบบริการนี้หรือไม่?')) {
      await deleteService(id)
    }
  }

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="p-1 text-red-500 hover:bg-red-50 rounded" title="ลบ">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  )
}
