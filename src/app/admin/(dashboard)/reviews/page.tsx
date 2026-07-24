import { Star, CheckCircle, XCircle, MessageSquare } from "lucide-react"

export default function ReviewsPage() {
  // ข้อมูลจำลองสำหรับรีวิว
  const reviews = [
    {
      id: 1,
      customerName: "สมชาย ใจดี",
      serviceName: "ล้างสีดูดฝุ่น + เคลือบสี",
      rating: 5,
      comment: "ล้างรถสะอาดมากครับ พนักงานบริการดีเยี่ยม ประทับใจมาก จะกลับมาใช้บริการอีกแน่นอน",
      date: "2026-07-20",
      status: "APPROVED",
    },
    {
      id: 2,
      customerName: "คุณวิภา",
      serviceName: "เคลือบแก้วเซรามิก",
      rating: 4,
      comment: "รถเงางามมาก แต่คิวรอนานไปนิดนึงค่ะ โดยรวมถือว่าคุ้มราคา",
      date: "2026-07-18",
      status: "APPROVED",
    },
    {
      id: 3,
      customerName: "นิรนาม",
      serviceName: "ล้างห้องเครื่อง",
      rating: 1,
      comment: "รีวิวสแปม โฆษณาเว็บพนัน...",
      date: "2026-07-15",
      status: "HIDDEN",
    },
    {
      id: 4,
      customerName: "อานนท์",
      serviceName: "ขัดเคลือบสี",
      rating: 5,
      comment: "รอยขนแมวหายเกลี้ยงเลยครับ ช่างเก่งมาก",
      date: "2026-07-10",
      status: "PENDING",
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#E5B842]">จัดการรีวิวลูกค้า</h1>
          <p className="text-gray-500">ตรวจสอบและอนุมัติรีวิวเพื่อแสดงบนหน้าเว็บไซต์</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">ลูกค้า / บริการ</th>
                <th className="px-6 py-4 font-medium">คะแนน</th>
                <th className="px-6 py-4 font-medium min-w-[300px]">ความคิดเห็น</th>
                <th className="px-6 py-4 font-medium">วันที่</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-yj-black">{review.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">{review.serviceName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-600 line-clamp-2">"{review.comment}"</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(review.date).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4">
                    {review.status === 'APPROVED' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">แสดงผล</span>}
                    {review.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">รอตรวจสอบ</span>}
                    {review.status === 'HIDDEN' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">ซ่อน</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="อนุมัติ">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ซ่อน/ลบ">
                        <XCircle className="w-5 h-5" />
                      </button>
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
