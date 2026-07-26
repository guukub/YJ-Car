import prisma from "@/lib/prisma";
import {
  Download,
  Printer,
  Calendar,
  DollarSign,
  Car,
  Wallet,
  FileText,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import PrintButton from "@/components/admin/PrintButton";
import ExportImageButton from "@/components/admin/ExportImageButton";
import DailyReportFilter from "@/components/admin/DailyReportFilter";
import DailySummaryPrintable, {
  DailyReportData,
} from "@/components/admin/DailySummaryPrintable";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; startDate?: string; endDate?: string }>;
}) {
  const params = (await searchParams) || {};

  // 1. Setup Date Filter
  let filterDate = new Date();
  let endDate = new Date();

  if (params.startDate && params.endDate) {
    filterDate = new Date(params.startDate + "T00:00:00");
    endDate = new Date(params.endDate + "T00:00:00");
  } else if (params.date) {
    filterDate = new Date(params.date + "T00:00:00");
    endDate = new Date(params.date + "T00:00:00");
  } else {
    filterDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  }

  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  let dateDisplay = format(filterDate, "วันEEEEที่ d MMMM yyyy", { locale: th });
  if (filterDate.getTime() !== endDate.getTime()) {
    dateDisplay = `${format(filterDate, "d MMM yy", { locale: th })} - ${format(endDate, "d MMM yy", { locale: th })}`;
  }


  // 2. Fetch Jobs
  const jobs = await prisma.jobQueue.findMany({
    where: {
      date: {
        gte: filterDate,
        lte: endOfDay,
      },
      status: { not: "CANCELLED" },
    },
    include: {
      vehicle: true,
      customer: true,
      services: {
        include: { service: true },
      },
    },
    orderBy: { timeIn: "desc" },
  });

  // 3. Fetch Expenses
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: filterDate,
        lte: endOfDay,
      },
    },
  });

  // 3.5 Fetch Settings
  // @ts-ignore
  const settings = await prisma.setting.findUnique({ where: { id: "global" } });
  const shopName = settings?.shopName || "YJ Cars Detailing";
  const openTime = settings?.openTime || "08:00";
  const closeTime = settings?.closeTime || "20:00";

  let openHoursStr = "12 ชม.";
  try {
    const [openH, openM] = openTime.split(":").map(Number);
    const [closeH, closeM] = closeTime.split(":").map(Number);
    let diff = (closeH + closeM/60) - (openH + openM/60);
    if (diff < 0) diff += 24;
    
    // Format to 1 decimal place if not integer
    openHoursStr = `${Number.isInteger(diff) ? diff : diff.toFixed(1)} ชม.`;
  } catch (e) {
    // ignore
  }

  // 4. Calculations

  // Revenue & Payment Breakdown
  let totalRevenue = 0;
  let totalCash = 0;
  let totalTransfer = 0;
  let totalUnpaid = 0;
  let totalDiscount = 0;
  let totalPromoCount = 0;

  // Car sizes count
  const sizeCounts: Record<string, number> = {
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    MC: 0,
    BB: 0,
    Other: 0,
  };

  // Customer Stats
  let newCustomers = 0;
  let oldCustomers = 0;
  const processedCustomers = new Set<string>();

  jobs.forEach((job) => {
    totalRevenue += job.netPrice;
    totalDiscount += job.discount;

    if (job.isPromotion) {
      totalPromoCount++;
    }

    const unpaidAmt = job.netPrice - job.amountPaid;
    if (unpaidAmt > 0) {
      totalUnpaid += unpaidAmt;
    }

    if (job.amountPaid > 0) {
      if (job.paymentMethod === "TRANSFER") {
        totalTransfer += job.amountPaid;
      } else {
        totalCash += job.amountPaid;
      }
    }

    const type = job.vehicle?.type || "Other";
    if (sizeCounts[type] !== undefined) {
      sizeCounts[type]++;
    } else {
      sizeCounts["Other"] = (sizeCounts["Other"] || 0) + 1;
    }

    if (job.customer && !processedCustomers.has(job.customer.id)) {
      processedCustomers.add(job.customer.id);
      const custCreated = new Date(job.customer.createdAt);
      if (custCreated >= filterDate && custCreated <= endOfDay) {
        newCustomers++;
      } else {
        oldCustomers++;
      }
    }
  });

  // Expenses Breakdown
  let expLiquid = 0;
  let expLabor = 0;
  let expEquip = 0;
  let expOther = 0;
  let totalExpense = 0;

  expenses.forEach((exp) => {
    totalExpense += exp.amount;
    if (exp.category.includes("น้ำยา")) {
      expLiquid += exp.amount;
    } else if (
      exp.category.includes("แรง") ||
      exp.category.includes("พนักงาน")
    ) {
      expLabor += exp.amount;
    } else if (exp.category.includes("อุปกรณ์")) {
      expEquip += exp.amount;
    } else {
      expOther += exp.amount;
    }
  });

  const netProfit = totalRevenue - totalExpense;
  const avgPerCar = jobs.length > 0 ? totalRevenue / jobs.length : 0;
  const promoPercent =
    jobs.length > 0 ? Math.round((totalPromoCount / jobs.length) * 100) : 0;

  // Format data for Printable
  const printableJobs = jobs.map((job, idx) => {
    const isPaid = job.amountPaid >= job.netPrice;
    const packageStr = job.services.map((s) => s.service.name).join(", ");

    let paymentText = "ค้างชำระ";
    if (isPaid) {
      paymentText = job.paymentMethod === "TRANSFER" ? "โอน" : "เงินสด";
    }

    return {
      id: job.id,
      index: idx + 1,
      time: format(new Date(job.timeIn), "HH:mm"),
      customerName: job.customer.name,
      licensePlate: job.vehicle.licensePlate,
      type: `รถ${job.vehicle.type === "MC" ? "มอเตอร์ไซค์" : "ยนต์"} (${job.vehicle.type})`,
      typeCode: job.vehicle.type,
      model: `${job.vehicle.brand} ${job.vehicle.model}`,
      package: packageStr,
      price: job.netPrice,
      discount: job.discount,
      paymentStatusText: paymentText,
      paymentStatusType: (isPaid ? "PAID" : "UNPAID") as
        "PAID" | "PARTIAL" | "UNPAID",
      serviceStatus:
        job.status === "FINISHED" || job.status === "DELIVERED"
          ? "เสร็จสิ้น"
          : "กำลังดำเนินการ",
      isPromotion: job.isPromotion,
    };
  });

  const reportData: DailyReportData = {
    date: filterDate,
    endDate: endOfDay,
    dateDisplay,
    shopName,
    timestamp: format(new Date(), "dd/MM/yyyy HH:mm น.", { locale: th }),
    revenue: {
      total: totalRevenue,
      cash: totalCash,
      transfer: totalTransfer,
      unpaid: totalUnpaid,
      discount: totalDiscount,
      promoCount: totalPromoCount,
    },
    cars: {
      total: jobs.length,
      sizeCounts,
    },
    expenses: {
      liquid: expLiquid,
      labor: expLabor,
      equipment: expEquip,
      other: expOther,
      total: totalExpense,
    },
    profit: {
      net: netProfit,
    },
    stats: {
      avgPerCar,
      promoPercent,
      newCustomers,
      oldCustomers,
    },
    shopSettings: {
      openTime,
      closeTime,
      openHoursStr
    },
    jobs: printableJobs,
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-12 bg-[#050505] -m-4 md:-m-6 p-4 md:p-6 min-h-[calc(100vh-80px)]">
      {/* Printable Area (Hidden on screen) */}
      <DailySummaryPrintable data={reportData} />

      <div className="border border-[#E5B842]/30 rounded-2xl md:rounded-3xl p-4 md:p-6 bg-[#0A0A0A] space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-[#E5B842] flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              สรุปรายวัน
            </h1>
            <p className="text-gray-400 mt-2 text-sm">{dateDisplay}</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="w-full md:w-auto">
              <DailyReportFilter />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end md:ml-auto border-t md:border-t-0 border-[#222] pt-4 md:pt-0 mt-2 md:mt-0">
              <PrintButton />
              <ExportImageButton />
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COL: Net Revenue (Large) and Net Profit (Small) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Card 1: Net Revenue */}
            <div className="bg-[#111] border border-[#E5B842] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_0_15px_rgba(229,184,66,0.1)] flex flex-col relative overflow-hidden flex-1">
              <div className="absolute top-6 right-6 p-2 rounded-full border border-[#E5B842] text-[#E5B842] shadow-[0_0_15px_rgba(229,184,66,0.5)]">
                <span className="font-bold text-xl px-1">฿</span>
              </div>
              {/* Optional glowing sweep effect could be added with a pseudo-element if needed, but simple shadow works */}
              <h3 className="text-lg font-medium text-[#E5B842]">รายได้สุทธิ</h3>
              <div className="text-4xl font-bold mt-2 text-[#E5B842]">
                <span className="text-2xl mr-1">฿</span>
                {totalRevenue.toLocaleString()}
              </div>

              <div className="mt-8 space-y-3 text-sm flex-1">
                <div className="flex justify-between items-center pb-2 text-gray-300">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Wallet className="w-4 h-4 text-[#E5B842]" /> เงินสด
                  </div>
                  <div className="font-medium">฿{totalCash.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center pb-2 text-gray-300">
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="w-4 h-4 flex items-center justify-center text-[#E5B842] text-xs border border-[#E5B842] rounded-sm">
                      🏦
                    </span>{" "}
                    โอน
                  </div>
                  <div className="font-medium">
                    ฿{totalTransfer.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-2 text-gray-300">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-4 h-4 text-[#E5B842]" /> ค้างชำระ
                  </div>
                  <div className="font-medium">฿{totalUnpaid.toLocaleString()}</div>
                </div>
                <div className="flex justify-between items-center pb-2 text-gray-300">
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="w-4 h-4 flex items-center justify-center text-[#E5B842]">
                      🏷️
                    </span>{" "}
                    ส่วนลด
                  </div>
                  <div className="font-medium">
                    ฿{totalDiscount.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#222] text-gray-300">
                  <div className="flex items-center gap-3 text-gray-400 pt-2">
                    <span className="w-4 h-4 flex items-center justify-center text-[#E5B842]">
                      🎁
                    </span>{" "}
                    โปรโมชั่น
                  </div>
                  <div className="font-medium pt-2 text-[#E5B842]">{totalPromoCount} รายการ</div>
                </div>
              </div>
            </div>

            {/* Card 5: Net Profit (Bottom Left) */}
            <div className="bg-[#111] border border-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#E5B842] font-bold">กำไรสุทธิ</h3>
                <div className="border border-[#E5B842] p-1.5 rounded-lg text-[#E5B842] shadow-[0_0_10px_rgba(229,184,66,0.3)]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>รายได้</span>
                  <span className="text-green-500 font-bold">
                    ฿{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>ค่าใช้จ่าย</span>
                  <span className="text-red-500 font-bold">
                    ฿{totalExpense.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="border-t border-[#222] pt-4 flex justify-between items-end mt-auto">
                <span className="text-[#E5B842] font-bold text-lg">กำไรสุทธิ</span>
                <span className="text-3xl font-bold text-green-500">
                  <span className="text-xl">฿</span>
                  {netProfit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE & RIGHT COLS */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[400px]">
              {/* Card 2: Cars Serviced */}
              <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-gray-300 font-bold mb-2">รถเข้ารับบริการ</h3>
                    <div className="text-4xl font-bold text-[#E5B842]">
                      {jobs.length}{" "}
                      <span className="text-base font-normal text-gray-400">คัน</span>
                    </div>
                    <p className="text-blue-400 text-sm font-medium mt-2">
                      ใช้โปรโมชั่น: {totalPromoCount} คัน
                    </p>
                  </div>
                  <div className="border border-[#E5B842] p-2 rounded-full text-[#E5B842] shadow-[0_0_10px_rgba(229,184,66,0.2)]">
                    <Car className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">รถเก๋งเล็ก</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["S"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">รถเก๋งใหญ่</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["M"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">SUV เล็ก</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["L"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">SUV/กระบะ</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["XL"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">รถตู้</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["XXL"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">มอเตอร์ไซค์</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["MC"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">บิ๊กไบค์</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["BB"]}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border border-[#222] rounded-lg p-2 hover:border-[#E5B842]/50 transition-colors">
                      <span className="text-[10px] text-gray-400 mb-1">อื่นๆ</span>
                      <span className="font-bold text-[#E5B842] text-sm">{sizeCounts["Other"]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Expenses */}
              <div className="bg-[#111] border border-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-gray-300 font-bold">ค่าใช้จ่าย</h3>
                  <div className="border border-[#E5B842] p-1.5 rounded-lg text-[#E5B842] shadow-[0_0_10px_rgba(229,184,66,0.2)]">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-4 flex-1 mt-4">
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>น้ำยา</span>
                    <span className="font-medium text-gray-300">
                      ฿{expLiquid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>ค่าซอง</span>
                    <span className="font-medium text-gray-300">
                      ฿{expLabor.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>อุปกรณ์</span>
                    <span className="font-medium text-gray-300">
                      ฿{expEquip.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>อื่นๆ</span>
                    <span className="font-medium text-gray-300">
                      ฿{expOther.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#222] flex justify-between items-center">
                  <span className="font-bold text-[#E5B842]">รวม</span>
                  <span className="font-bold text-[#E5B842] text-2xl">
                    <span className="text-xl">฿</span>{totalExpense.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Table: Today's Cars */}
            <div className="bg-[#111] border border-gray-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm flex-1 flex flex-col min-h-[300px]">
              <h3 className="text-[#E5B842] font-bold mb-4 flex items-center gap-2">
                <div className="border border-[#E5B842] p-1 rounded-full text-[#E5B842] text-xs w-5 h-5 flex items-center justify-center shadow-[0_0_5px_rgba(229,184,66,0.3)]">+</div> รายการวันนี้
              </h3>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-[#0A0A0A] text-[#E5B842] border border-[#222]">
                      <th className="px-4 py-2 font-medium rounded-l-lg text-center">ลำดับ</th>
                      <th className="px-4 py-2 font-medium">ลูกค้า</th>
                      <th className="px-4 py-2 font-medium">ทะเบียน</th>
                      <th className="px-4 py-2 font-medium">ประเภทรถ</th>
                      <th className="px-4 py-2 font-medium">รุ่นรถ</th>
                      <th className="px-4 py-2 font-medium text-center">โปรโมชั่น</th>
                      <th className="px-4 py-2 font-medium text-right">ราคา</th>
                      <th className="px-4 py-2 font-medium text-right">ส่วนลด</th>
                      <th className="px-4 py-2 rounded-r-lg font-medium text-center">
                        ชำระเงิน
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {jobs.map((job, index) => {
                      const isPaid = job.amountPaid >= job.netPrice;

                      return (
                        <tr
                          key={job.id}
                          className="hover:bg-[#1a1a1a] transition-colors text-gray-300"
                        >
                          <td className="px-4 py-3 text-center text-gray-400">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {job.customer.name}
                          </td>
                          <td className="px-4 py-3 text-[#E5B842] font-medium">
                            {job.vehicle.licensePlate}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {{
                              S: "รถเก๋งเล็ก",
                              M: "รถเก๋งใหญ่",
                              L: "SUV เล็ก",
                              XL: "SUV/กระบะ",
                              XXL: "รถตู้",
                              MC: "มอเตอร์ไซค์",
                              BB: "บิ๊กไบค์"
                            }[job.vehicle.type as string] || job.vehicle.type}
                          </td>
                          <td className="px-4 py-3 text-gray-400">
                            {job.vehicle.brand} {job.vehicle.model}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {job.isPromotion ? (
                              <span className="px-2 py-0.5 bg-[#E5B842]/20 text-[#E5B842] text-[10px] rounded-full border border-[#E5B842]/30">มี</span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            {job.netPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            {job.discount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {isPaid ? (
                              <span
                                className={`text-xs font-medium ${job.paymentMethod === "TRANSFER" ? "text-blue-400" : "text-green-400"}`}
                              >
                                {job.paymentMethod === "TRANSFER" ? "โอน" : "เงินสด"}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-red-500">
                                ค้างชำระ
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {jobs.length === 0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-4"
                        >
                          <div className="border border-[#E5B842] text-[#E5B842] w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(229,184,66,0.1)]">
                             <FileText className="w-6 h-6" />
                          </div>
                          ไม่มีรายการในวันนี้
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Settings Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 print:hidden">
          <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-gray-800">
            <div className="w-12 h-12 rounded-full border border-green-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.2)] text-green-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-400 font-medium text-sm">เปิดร้าน</div>
              <div className="text-2xl font-bold text-green-500">{openTime}</div>
            </div>
          </div>
          <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-gray-800">
            <div className="w-12 h-12 rounded-full border border-[#E5B842]/50 flex items-center justify-center shadow-[0_0_10px_rgba(229,184,66,0.2)] text-[#E5B842]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-gray-400 font-medium text-sm">ปิดร้าน</div>
              <div className="text-2xl font-bold text-[#E5B842]">{closeTime}</div>
            </div>
          </div>
          <div className="bg-[#111] rounded-2xl p-4 flex items-center gap-4 border border-gray-800">
            <div className="w-12 h-12 rounded-full border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)] text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>
            </div>
            <div>
              <div className="text-blue-500 font-medium text-sm">เวลาทำการรวม</div>
              <div className="text-2xl font-bold text-blue-500">{openHoursStr}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
