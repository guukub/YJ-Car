import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import PromptPayQR from "@/components/admin/PromptPayQR"
import PrintButton from "@/components/admin/PrintButton"
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Phone, Mail, MessageCircle } from "lucide-react"
import { bahttext } from 'bahttext'

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const job = await prisma.jobQueue.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      services: { include: { service: true } }
    }
  })

  if (!job) notFound()

  // @ts-ignore
  const settings = await prisma.setting.findUnique({ where: { id: "global" } })
  const shopName = settings?.shopName || "YJ Cars Detailing"
  const promptPayId = settings?.promptPayId

  const formatThaiDate = (date: Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  }

  const documentNo = `INV-${new Date(job.date).getFullYear()}-${job.queueNumber.toString().padStart(4, '0')}`
  const formattedDate = formatThaiDate(new Date(job.date))
  const totalAmount = job.totalPrice
  const discount = job.discount
  const netAmount = job.netPrice
  const netAmountText = bahttext(netAmount)

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0 flex justify-center text-gray-800">
      
      <div className="w-full max-w-[850px] relative">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="flex justify-end mb-6 print:hidden">
           <PrintButton />
        </div>

        {/* The Receipt Paper (A4 Style) */}
        <div className="bg-white shadow-xl print:shadow-none min-h-[297mm] p-10 text-sm font-sans">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6 border-b-2 border-yj-gold pb-6">
            <div>
              {/* Logo Image */}
              <img src="/logo.png" alt={shopName} className="h-16 w-auto object-contain" />
              {/* Fallback Text Logo (Hidden by default, shown if image fails to load) */}
              <div className="hidden font-black text-3xl italic text-yj-black tracking-tighter" style={{ textShadow: "2px 2px 0px #F5D142" }}>
                {shopName.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-black text-yj-black uppercase tracking-wider">ใบเสร็จรับเงิน</h1>
              <p className="text-gray-500 text-xs mt-1">(ต้นฉบับ)</p>
            </div>
          </div>

          {/* Info Blocks */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-yj-gold"></div>
              <p className="text-yj-black font-bold mb-1">ผู้ขาย</p>
              <p className="font-bold text-sm text-gray-900">{shopName}</p>
              <p className="text-gray-600">ที่อยู่: (กรุณาตั้งค่าที่อยู่ร้านในระบบ)</p>
              <p className="text-gray-600">เลขที่ผู้เสียภาษี: 0105555555555 (สำนักงานใหญ่)</p>
              <div className="flex items-center gap-4 mt-2 pt-2 text-gray-600">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-yj-gold"/> {promptPayId || "-"}</span>
                <span className="flex items-center gap-1 font-bold"><MessageCircle className="w-3 h-3 text-yj-gold"/> @{shopName.toLowerCase().replace(/\s/g, '')}</span>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1 h-full bg-yj-black"></div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 text-gray-500">เลขที่เอกสาร</div>
                <div className="col-span-2 text-right text-yj-black font-bold">{documentNo}</div>
                
                <div className="col-span-1 text-gray-500">วันที่ออก</div>
                <div className="col-span-2 text-right text-gray-900 font-medium">{formattedDate}</div>
                
                {job.warranty ? (
                  <>
                    <div className="col-span-1 text-gray-500">รับประกัน</div>
                    <div className="col-span-2 text-right text-yj-gold font-bold">{job.warranty}</div>
                    
                    {job.warrantyEnd && (
                      <>
                        <div className="col-span-1 text-gray-500">วันหมดประกัน</div>
                        <div className="col-span-2 text-right text-red-500 font-bold">{formatThaiDate(new Date(job.warrantyEnd))}</div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="col-span-1 text-gray-500">อ้างอิง</div>
                    <div className="col-span-2 text-right text-gray-900">-</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Customer */}
            <div className="flex gap-2">
              <span className="text-yj-black font-bold">ลูกค้า:</span>
              <div>
                <p className="font-bold text-yj-black text-sm mb-2">{job.customer.name}</p>
                <div className="space-y-1 text-gray-500">
                  <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-yj-gold"/> {job.customer.phone || "-"}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3 h-3 text-yj-gold"/> -</p>
                  <p className="flex items-center gap-2"><MessageCircle className="w-3 h-3 text-yj-gold"/> -</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div>
              <div className="grid grid-cols-5 gap-2 text-gray-600 mb-1">
                <div className="col-span-2 text-right text-yj-black font-bold">ทะเบียนรถ :</div>
                <div className="col-span-3 font-bold text-gray-900">{job.vehicle.licensePlate}</div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-gray-600 mb-1">
                <div className="col-span-2 text-right text-yj-black font-bold mt-1">ยี่ห้อ/รุ่น :</div>
                <div className="col-span-3 font-bold text-gray-900 leading-tight">
                  {job.vehicle.licensePlate} <br/>
                  {job.vehicle.brand} {job.vehicle.model}
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2 text-gray-600">
                <div className="col-span-2 text-right text-yj-black font-bold">สีรถ :</div>
                <div className="col-span-3 font-bold text-gray-900">{job.vehicle.color}</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <table className="w-full text-xs text-gray-800">
              <thead className="bg-yj-black text-yj-gold border-b-2 border-yj-gold">
                <tr>
                  <th className="py-3 px-3 text-left font-bold tracking-wider">คำอธิบาย</th>
                  <th className="py-3 px-3 text-center font-bold tracking-wider w-16">จำนวน</th>
                  <th className="py-3 px-3 text-right font-bold tracking-wider w-24">ราคา</th>
                  <th className="py-3 px-3 text-center font-bold tracking-wider w-20">ส่วนลด</th>
                  <th className="py-3 px-3 text-center font-bold tracking-wider w-16">VAT</th>
                  <th className="py-3 px-3 text-right font-bold tracking-wider w-28">มูลค่าก่อนภาษี</th>
                </tr>
              </thead>
              <tbody className="border-b-2 border-yj-black divide-y divide-gray-200 min-h-[150px]">
                {job.services.map((s, index) => (
                  <tr key={index}>
                    <td className="py-4 px-3 font-medium text-gray-900">{index + 1}. {s.service.name}</td>
                    <td className="py-4 px-3 text-center">1.00</td>
                    <td className="py-4 px-3 text-right">{s.priceAtTime.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-3 text-center">-</td>
                    <td className="py-4 px-3 text-center">0%</td>
                    <td className="py-4 px-3 text-right font-medium">{s.priceAtTime.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                  </tr>
                ))}
                {/* Empty rows to fill space if needed */}
                {job.services.length < 3 && Array.from({length: 3 - job.services.length}).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="py-4 px-3 text-transparent">-</td>
                    <td className="py-4 px-3"></td>
                    <td className="py-4 px-3"></td>
                    <td className="py-4 px-3"></td>
                    <td className="py-4 px-3"></td>
                    <td className="py-4 px-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-8">
            <div className="flex flex-col justify-end pb-1">
              <p className="text-gray-500 mb-1 font-medium">จำนวนเงินทั้งสิ้น (ตัวอักษร)</p>
              <p className="font-bold text-gray-900 text-sm bg-gray-100 border border-gray-200 py-2 px-3 rounded w-fit">({netAmountText})</p>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 text-gray-600">
                <span>มูลค่าที่คำนวณภาษี 0%</span>
                <span className="text-right">{totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} บาท</span>
              </div>
              
              {job.discount > 0 && (
                <div className="grid grid-cols-2 text-red-600">
                  <span>ส่วนลด</span>
                  <span className="text-right">- {job.discount.toLocaleString('en-US', {minimumFractionDigits: 2})} บาท</span>
                </div>
              )}
              <div className="grid grid-cols-2 text-gray-600">
                <span>ภาษีมูลค่าเพิ่ม 0%</span>
                <span className="text-right">0.00 บาท</span>
              </div>
              <div className="grid grid-cols-2 text-yj-black font-black bg-gray-100 border-y border-yj-black py-2 my-1">
                <span className="pl-2">จำนวนเงินทั้งสิ้น</span>
                <span className="text-right text-base pr-2">{netAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
              </div>
              
              {/* Payment Status specific rows */}
              {(job.paymentStatus === "DEPOSIT" || job.paymentStatus === "PAID") && (
                <div className="grid grid-cols-2 text-green-700 font-medium pt-1">
                  <span>ชำระแล้ว (มัดจำ/เต็มจำนวน)</span>
                  <span className="text-right">- {job.amountPaid.toLocaleString('en-US', {minimumFractionDigits: 2})} บาท</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 text-gray-600 pt-1">
                <span>จำนวนเงินที่ถูกหัก ณ ที่จ่าย</span>
                <span className="text-right">0.00 บาท</span>
              </div>
              <div className="grid grid-cols-2 text-yj-black font-black text-sm pt-2 border-t border-gray-300 mt-2">
                <span>ยอดค้างชำระ (ยอดที่ต้องจ่าย)</span>
                <span className="text-right text-red-600">
                  {job.paymentStatus === "PAID" 
                    ? "0.00" 
                    : (netAmount - job.amountPaid).toLocaleString('en-US', {minimumFractionDigits: 2})} บาท
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-yj-black rounded-lg p-3 text-xs flex justify-between items-center mb-10 border border-yj-black text-white shadow-md">
            <div className="flex items-center gap-4">
              <span className="font-bold flex items-center gap-2"><span className="w-1.5 h-4 bg-yj-gold inline-block"></span> สถานะเอกสาร:</span>
              <span className="text-gray-300">วันที่ออก: <span className="text-white font-medium">{formattedDate}</span></span>
              <span className="text-gray-300">
                สถานะ: 
                {job.paymentStatus === "UNPAID" && <span className="text-red-400 font-bold ml-1">ยังไม่ชำระเงิน</span>}
                {job.paymentStatus === "DEPOSIT" && <span className="text-orange-400 font-bold ml-1">มัดจำแล้ว</span>}
                {job.paymentStatus === "PAID" && <span className="text-green-400 font-bold ml-1">ชำระเงินครบถ้วน</span>}
              </span>
            </div>
            <div className="font-bold text-yj-gold tracking-wide">
              รับชำระแล้ว: {job.amountPaid.toLocaleString('en-US', {minimumFractionDigits: 2})} บาท
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-auto">
            <h3 className="font-bold text-yj-black text-sm mb-8 flex items-center gap-1 border-b border-gray-200 pb-2">
               <CheckCircleIcon className="w-4 h-4 text-yj-gold" /> การรับรองเอกสาร
            </h3>
            
            <div className="grid grid-cols-3 gap-8 text-center text-xs text-gray-500 font-medium">
              <div>
                <div className="h-12 border-b-2 border-dashed border-gray-300 mb-2"></div>
                <p>ลูกค้า (Customer)</p>
              </div>
              <div>
                <div className="h-12 border-b-2 border-dashed border-gray-300 mb-2 flex items-end justify-center pb-1">
                  {/* Signature Mock */}
                  <span className="font-signature text-xl text-yj-black opacity-80" style={{ fontFamily: "cursive" }}>YJ Admin</span>
                </div>
                <p>ผู้รับเงิน (Cashier)</p>
              </div>
              <div>
                <div className="h-12 border-b-2 border-dashed border-gray-300 mb-2"></div>
                <p>ช่างผู้รับผิดชอบ (Staff)</p>
              </div>
            </div>
          </div>
          
          {/* Print QR if PromptPay exists */}
          {promptPayId && (
            <div className="mt-8 text-center print:hidden border-t-2 border-dashed border-gray-200 pt-8">
               <p className="text-yj-black font-bold text-sm mb-2">สแกนชำระเงิน (PromptPay)</p>
               <div className="inline-block border-2 border-yj-gold p-2 rounded-xl bg-white shadow-lg">
                 <PromptPayQR amount={netAmount} promptPayId={promptPayId} />
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
}
