import React from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CheckCircle2, Clock } from "lucide-react";

export interface DailyReportData {
  date: Date;
  endDate?: Date;
  dateDisplay: string;
  shopName: string;
  shopSettings: {
    openTime: string;
    closeTime: string;
    openHoursStr: string;
  };
  timestamp: string;
  revenue: {
    total: number;
    cash: number;
    transfer: number;
    unpaid: number;
    discount: number;
    promoCount: number;
  };
  cars: {
    total: number;
    sizeCounts: Record<string, number>;
  };
  expenses: {
    liquid: number;
    labor: number;
    equipment: number;
    other: number;
    total: number;
  };
  profit: {
    net: number;
  };
  stats: {
    avgPerCar: number;
    promoPercent: number;
    newCustomers: number;
    oldCustomers: number;
  };
  jobs: {
    id: string;
    index: number;
    time: string;
    customerName: string;
    licensePlate: string;
    type: string;
    typeCode: string;
    model: string;
    package: string;
    price: number;
    discount: number;
    paymentStatusText: string;
    paymentStatusType: "PAID" | "PARTIAL" | "UNPAID";
    serviceStatus: string;
    isPromotion?: boolean;
    paymentMethod?: string;
  }[];
}

interface Props {
  data: DailyReportData;
}

export default function DailySummaryPrintable({ data }: Props) {
  const PAGE_1_LIMIT = 12;
  const PAGE_N_LIMIT = 25;

  const pages: DailyReportData["jobs"][] = [];

  let remaining = [...data.jobs];
  if (remaining.length > 0) {
    pages.push(remaining.slice(0, PAGE_1_LIMIT));
    remaining = remaining.slice(PAGE_1_LIMIT);
  } else {
    pages.push([]);
  }

  while (remaining.length > 0) {
    pages.push(remaining.slice(0, PAGE_N_LIMIT));
    remaining = remaining.slice(PAGE_N_LIMIT);
  }

  const totalDiscountSum = data.jobs.reduce((sum, j) => sum + j.discount, 0);
  const totalPriceSum = data.jobs.reduce((sum, j) => sum + j.price, 0);

  return (
    <div
      id="print-area"
      className="hidden print:block bg-[#050505] text-white font-sans"
      style={{ fontSize: "11px" }}
    >
      {/* Global Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @page { size: A4; margin: 0; }
        @media print {
          /* Hide all other elements on the page */
          body * {
            visibility: hidden;
          }
          /* Show only the print area and its children */
          #print-area, #print-area * {
            visibility: visible;
          }
          /* Absolute position to break out of any container paddings/margins */
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            min-height: 100vh;
            background: #050505 !important;
            color: white !important;
            padding: 10mm;
            margin: 0;
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background: #050505 !important; 
            color: white !important;
          }
          .page-break { page-break-after: always; }
          .no-break { page-break-inside: avoid; }
        }
      `,
        }}
      />

      {pages.map((pageJobs, pageIndex) => (
        <div
          key={pageIndex}
          className={pageIndex < pages.length - 1 ? "page-break" : ""}
        >
          {/* HEADER PAGE 1 */}
          {pageIndex === 0 && (
            <div className="flex justify-between items-start mb-6 border-b border-[#E5B842]/30 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.png"
                  alt="YJ Cars Detailing Logo"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold mb-1 text-[#E5B842]">สรุปรายวัน</h1>
                  <h2 className="text-lg font-bold text-white">
                    ร้าน {data.shopName || "YJ Cars Detailing"}
                  </h2>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-xs text-[#E5B842] mb-2">
                  พิมพ์เมื่อ : {data.timestamp}
                </div>
                <div className="border border-[#E5B842] rounded-lg overflow-hidden flex bg-transparent w-48 shadow-[0_0_10px_rgba(229,184,66,0.2)]">
                  <div className="px-3 py-2 border-r border-[#E5B842] flex flex-col justify-center items-center text-[#E5B842]">
                    <span className="text-[10px]">วันที่</span>
                    <svg
                      className="w-5 h-5 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="px-3 py-2 text-center flex-1">
                    <div className="font-bold text-sm leading-tight text-white">
                      {data.endDate && data.date.getTime() !== data.endDate.getTime()
                        ? `${format(data.date, "dd MMM yy", { locale: th })} - ${format(data.endDate, "dd MMM yy", { locale: th })}`
                        : format(data.date, "dd MMMM yyyy", { locale: th })}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {data.endDate && data.date.getTime() !== data.endDate.getTime()
                        ? "(สรุปตามช่วงเวลา)"
                        : `(${format(data.date, "วันEEEE", { locale: th })})`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEADER PAGE N */}
          {pageIndex > 0 && (
            <div className="flex justify-between items-end mb-4 border-b border-[#E5B842]/30 pb-2">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="YJ Cars Detailing Logo"
                  className="w-8 h-8 object-contain rounded"
                />
                <span className="font-bold text-sm text-white">
                  ร้าน {data.shopName || "YJ Cars Detailing"}
                </span>
                <span className="font-bold text-sm ml-4 text-[#E5B842]">
                  สรุปรายวัน :{" "}
                  {data.endDate && data.date.getTime() !== data.endDate.getTime()
                    ? `${format(data.date, "dd MMM yy", { locale: th })} - ${format(data.endDate, "dd MMM yy", { locale: th })}`
                    : `${format(data.date, "dd MMMM yyyy", { locale: th })} (${format(data.date, "วันEEEE", { locale: th })})`}
                </span>
              </div>
              <div className="text-xs text-[#E5B842]">
                พิมพ์เมื่อ : {data.timestamp}
              </div>
            </div>
          )}

          {/* KPI CARDS (Only Page 1) */}
          {pageIndex === 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Row 1, Col 1: Net Revenue */}
              <div className="bg-[#0A0A0A] border border-[#E5B842] rounded-xl p-4 shadow-[0_0_15px_rgba(229,184,66,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#E5B842] text-sm">รายได้สุทธิ</span>
                  <div className="border border-[#E5B842] p-1.5 rounded text-[#E5B842]">
                    <DollarSignIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-4 text-[#E5B842]">
                  ฿{data.revenue.total.toLocaleString()}
                </div>
                <div className="space-y-2.5 text-xs text-white">
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-1.5 text-[#E5B842]">
                      <WalletIcon className="w-3 h-3" /> เงินสด
                    </span>
                    <span>
                      ฿ {data.revenue.cash.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-1.5 text-[#E5B842]">
                      <BankIcon className="w-3 h-3" /> โอน
                    </span>
                    <span>
                      ฿ {data.revenue.transfer.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-1.5 text-[#E5B842]">
                      <Clock className="w-3 h-3" /> ค้างชำระ
                    </span>
                    <span>
                      ฿ {data.revenue.unpaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-1.5 text-[#E5B842]">
                      <TagIcon className="w-3 h-3" /> ส่วนลด
                    </span>
                    <span>
                      ฿ {data.revenue.discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="flex items-center gap-1.5 text-[#E5B842]">
                      <GiftIcon className="w-3 h-3" /> โปรโมชั่น
                    </span>
                    <span>
                      {data.revenue.promoCount} รายการ
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 1, Col 2: Cars */}
              <div className="bg-[#0A0A0A] border border-[#E5B842] rounded-xl p-4 flex flex-col shadow-[0_0_15px_rgba(229,184,66,0.1)]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-[#E5B842] text-sm">
                      รถเข้ารับบริการ
                    </span>
                    <div className="text-3xl font-bold text-[#E5B842] mt-1">
                      {data.cars.total}{" "}
                      <span className="text-sm font-normal text-white">
                        คัน
                      </span>
                    </div>
                    <div className="text-[10px] text-[#E5B842] mt-1">
                      ใช้โปรโมชั่น: {data.revenue.promoCount} คัน
                    </div>
                  </div>
                  <div className="border border-[#E5B842] p-1.5 rounded text-[#E5B842]">
                    <CarIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-auto">
                  <table className="w-full text-[10px] text-white">
                    <thead className="border-b border-[#E5B842]/30 text-[#E5B842]">
                      <tr>
                        <td className="py-1">ขนาดรถ</td>
                        <td className="text-center">คัน</td>
                        <td className="text-right">%</td>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {["S", "M", "L", "XL", "XXL", "MC", "BB"].map((sz) => {
                        const count = data.cars.sizeCounts[sz] || 0;
                        const pct =
                          data.cars.total > 0
                            ? ((count / data.cars.total) * 100).toFixed(2)
                            : "0.00";
                        const sizeNames: Record<string, string> = {
                          S: "รถเก๋งเล็ก",
                          M: "รถเก๋งใหญ่",
                          L: "SUV เล็ก",
                          XL: "SUV/กระบะ",
                          XXL: "รถตู้",
                          MC: "มอเตอร์ไซค์",
                          BB: "บิ๊กไบค์",
                        };
                        return (
                          <tr key={sz}>
                            <td className="py-1">{sizeNames[sz]}</td>
                            <td className="text-center">{count}</td>
                            <td className="text-right">{pct}%</td>
                          </tr>
                        );
                      })}
                      <tr className="font-bold text-[#E5B842] border-t border-[#E5B842]/50">
                        <td className="py-1">รวม</td>
                        <td className="text-center">{data.cars.total}</td>
                        <td className="text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Row 2, Col 1: Expenses */}
              <div className="bg-[#0A0A0A] border border-[#E5B842] rounded-xl p-4 flex flex-col shadow-[0_0_15px_rgba(229,184,66,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-[#E5B842] text-sm">ค่าใช้จ่าย</span>
                  <div className="border border-[#E5B842] p-1.5 rounded text-[#E5B842]">
                    <FileTextIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-3 text-xs text-white flex-1">
                  <div className="flex justify-between">
                    <span>น้ำยา</span>
                    <span>฿ {data.expenses.liquid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าแรง</span>
                    <span>฿ {data.expenses.labor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อุปกรณ์</span>
                    <span>฿ {data.expenses.equipment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อื่นๆ</span>
                    <span>฿ {data.expenses.other.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between font-bold text-[#E5B842]">
                  <span>รวมค่าใช้จ่าย</span>
                  <span>฿ {data.expenses.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Row 2, Col 2: Net Profit */}
              <div className="bg-[#0A0A0A] border border-[#E5B842] rounded-xl p-4 flex flex-col shadow-[0_0_15px_rgba(229,184,66,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-bold text-[#E5B842] text-sm">กำไรสุทธิ</span>
                  <div className="border border-[#E5B842] p-1.5 rounded text-[#E5B842]">
                    <TrendingUpIcon className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-3 text-xs flex-1">
                  <div className="flex justify-between">
                    <span className="text-white">รายได้สุทธิ</span>
                    <span className="text-white">
                      ฿ {data.revenue.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">หัก ค่าใช้จ่าย</span>
                    <span className="text-red-500">
                      -฿ {data.expenses.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-end">
                  <span className="font-bold text-[#E5B842] text-sm">
                    กำไรสุทธิวันนี้
                  </span>
                  <span className="font-bold text-[#E5B842] text-3xl">
                    ฿ {data.profit.net.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TABLE SECTION */}
          <div className="mt-4">
            {pageIndex === 0 && (
              <h3 className="font-bold text-[#E5B842] mb-3 flex items-center gap-2 text-sm">
                <CarIcon className="w-4 h-4" /> รายการรถวันนี้ (ทั้งหมด{" "}
                {data.jobs.length} รายการ)
              </h3>
            )}
            <table className="w-full text-[10px] text-center border-collapse">
              <thead>
                <tr className="text-[#E5B842] border-y border-[#E5B842]/50 bg-[#111]">
                  <th className="py-2.5 px-1 font-normal">ลำดับ</th>
                  <th className="py-2.5 px-2 font-normal">เวลา</th>
                  <th className="py-2.5 px-2 font-normal text-left">ลูกค้า</th>
                  <th className="py-2.5 px-2 font-normal">ทะเบียน</th>
                  <th className="py-2.5 px-2 font-normal">ประเภทรถ</th>
                  <th className="py-2.5 px-2 font-normal">รุ่นรถ</th>
                  <th className="py-2.5 px-2 font-normal text-left">แพ็กเกจ</th>
                  <th className="py-2.5 px-2 font-normal text-right">
                    ราคา
                  </th>
                  <th className="py-2.5 px-2 font-normal text-right">
                    ส่วนลด
                  </th>
                  <th className="py-2.5 px-2 font-normal">ชำระเงิน</th>
                </tr>
              </thead>
              <tbody>
                {pageJobs.map((job, idx) => (
                  <tr
                    key={job.id}
                    className="border-b border-gray-800/50"
                  >
                    <td className="py-2 px-1 text-gray-400">
                      {job.index}
                    </td>
                    <td className="py-2 px-2 text-white">
                      {job.time}
                    </td>
                    <td className="py-2 px-2 text-left text-white">
                      {job.customerName}
                    </td>
                    <td className="py-2 px-2 text-white">
                      {job.licensePlate}
                    </td>
                    <td className="py-2 px-2 text-gray-300">
                      {job.type}
                    </td>
                    <td className="py-2 px-2 text-gray-300">
                      {job.model}
                    </td>
                    <td className="py-2 px-2 text-left text-gray-300">
                      <div className="flex items-center gap-1">
                        <span>{job.package}</span>
                        {job.isPromotion && (
                          <span className="text-[8px] font-bold text-[#E5B842]">
                            (โปรโมชั่น)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right text-white">
                      {job.price.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right text-white">
                      {job.discount.toLocaleString()}
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-medium border ${job.paymentStatusType === "PAID" ? (job.paymentMethod === "CASH" ? "text-green-500 border-green-500" : "text-[#E5B842] border-[#E5B842]") : job.paymentStatusType === "PARTIAL" ? "text-blue-500 border-blue-500" : "text-red-500 border-red-500"}`}
                      >
                        {job.paymentStatusText}
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Grand Totals Row at the end of the last page */}
                {pageIndex === pages.length - 1 && (
                  <tr className="font-bold text-[#E5B842] border-y border-[#E5B842]/50 bg-[#111]">
                    <td
                      colSpan={7}
                      className="py-2.5 px-4 text-left"
                    >
                      รวมทั้งหมด {data.jobs.length} รายการ
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {totalPriceSum.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      {totalDiscountSum.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      -
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGE FOOTER & SIGNATURES (Only on last page) */}
          {pageIndex === pages.length - 1 && (
            <div className="mt-8 grid grid-cols-4 gap-6 text-[10px]">
              {/* Hours */}
              <div className="border border-[#E5B842] rounded-lg p-3 bg-transparent">
                <div className="font-bold flex items-center gap-1.5 mb-2 text-[#E5B842]">
                  <Clock className="w-3.5 h-3.5" /> ช่วงเวลาเปิด-ปิดร้าน
                </div>
                <div className="flex justify-between mb-1.5 text-white">
                  <span>เปิดร้าน</span>
                  <span className="font-bold">{data.shopSettings?.openTime || "08:00"}</span>
                </div>
                <div className="flex justify-between mb-1.5 text-white">
                  <span>ปิดร้าน</span>
                  <span className="font-bold">{data.shopSettings?.closeTime || "20:00"}</span>
                </div>
                <div className="flex justify-between mt-2.5 pt-1.5 border-t border-gray-800 text-white">
                  <span className="text-[#E5B842]">เวลาเปิดทำการ</span>
                  <span className="font-bold text-[#E5B842]">{data.shopSettings?.openHoursStr || "12 ชม."}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="border-l border-gray-800 pl-4 col-span-1">
                <div className="font-bold mb-1 text-[#E5B842]">หมายเหตุ</div>
                <div className="text-gray-300 leading-relaxed">
                  - โปรโมชั่น : ล้างภายนอก + ดูดฝุ่น<br />
                  ภายใน<br />
                  <span className="text-gray-500">(สำหรับรถขนาด S)</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="col-span-2 flex justify-around items-end pt-4">
                <div className="text-center text-[#E5B842]">
                  <div className="font-bold mb-8">ผู้จัดการร้าน</div>
                  <div>
                    (......................................................)
                  </div>
                  <div className="mt-1 text-white">
                    วันที่ {format(data.date, "dd/MM/yyyy")}
                  </div>
                </div>
                <div className="text-center text-[#E5B842]">
                  <div className="font-bold mb-8">ผู้ตรวจสอบ</div>
                  <div>
                    (......................................................)
                  </div>
                  <div className="mt-1 text-white">
                    วันที่ {format(data.date, "dd/MM/yyyy")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Counter Footer */}
          <div className="text-right text-[9px] text-[#E5B842]/50 mt-4">
            หน้า {pageIndex + 1} / {pages.length}
          </div>
        </div>
      ))}
    </div>
  );
}

// Icon Helpers to keep code clean
const DollarSignIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const WalletIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const BankIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const TagIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const GiftIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);
const CarIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
const FileTextIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const TrendingUpIcon = (p: any) => (
  <svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
