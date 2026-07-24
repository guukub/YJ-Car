'use client'

import { Trash2 } from "lucide-react"
import { useTransition } from "react"
import { deleteJobQueue } from "@/app/actions/queue"

export default function DeleteQueueButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคิวนี้? ข้อมูลจะถูกลบอย่างถาวร")) {
      startTransition(() => {
        deleteJobQueue(jobId)
      })
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`p-1.5 rounded border border-transparent transition-colors ${
        isPending 
          ? "text-gray-400 bg-gray-50" 
          : "text-red-500 hover:bg-red-50 hover:border-red-200"
      }`}
      title="ลบคิว"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
