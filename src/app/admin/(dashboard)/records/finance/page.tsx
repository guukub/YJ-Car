import prisma from "@/lib/prisma"
import { createExpense } from "@/app/actions/finance"
import { DollarSign, Save, ListOrdered, Calendar } from "lucide-react"
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default async function FinancePage() {
  const recentExpenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' },
    take: 50
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#E5B842]">บันทึกรายรับ - ค่าใช้จ่าย</h1>
        <p className="text-gray-500">จัดการข้อมูลค่าใช้จ่ายต่างๆ ในร้าน (รายรับจะถูกบันทึกอัตโนมัติจากระบบคิวล้างรถ)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Form */}
        <div className="lg:col-span-1">
          <form action={createExpense} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
              <DollarSign className="w-5 h-5 text-yj-gold" />
              เพิ่มรายการค่าใช้จ่าย
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ค่าใช้จ่าย *</label>
                <select name="category" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold bg-white">
                  <option value="WATER">ค่าน้ำประปา</option>
                  <option value="ELECTRICITY">ค่าไฟฟ้า</option>
                  <option value="CHEMICALS">ค่าน้ำยา/อุปกรณ์สิ้นเปลือง</option>
                  <option value="SALARY">ค่าแรงพนักงาน</option>
                  <option value="MAINTENANCE">ค่าซ่อมบำรุง/สถานที่</option>
                  <option value="MARKETING">ค่าโฆษณา/การตลาด</option>
                  <option value="OTHER">ค่าใช้จ่ายอื่นๆ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนเงิน (฿) *</label>
                <input type="number" name="amount" required min="1" placeholder="0" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ทำรายการ *</label>
                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea name="description" rows={3} placeholder="เช่น ค่าคอมมิชชั่นพนักงาน..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold"></textarea>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              บันทึกค่าใช้จ่าย
            </button>
          </form>
        </div>

        {/* Expense History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-yj-gold" />
              <h2 className="text-lg font-bold text-yj-dark-blue">ประวัติค่าใช้จ่ายล่าสุด</h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 bg-gray-50 uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-4 font-medium">วันที่</th>
                    <th className="px-4 py-4 font-medium">หมวดหมู่</th>
                    <th className="px-4 py-4 font-medium">รายละเอียด</th>
                    <th className="px-4 py-4 font-medium text-right">จำนวนเงิน (฿)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        ยังไม่มีการบันทึกค่าใช้จ่าย
                      </td>
                    </tr>
                  ) : (
                    recentExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-gray-600">
                          {format(new Date(expense.date), 'dd MMM yyyy', { locale: th })}
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-gray-800">{expense.description || "-"}</div>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-red-500">
                          - {expense.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
