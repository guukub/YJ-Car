import { Wallet, Users, Crown, UserPlus } from "lucide-react"

interface CustomerKPICardsProps {
  totalRevenue: number
  totalCustomers: number
  vipCustomers: number
  newCustomersThisMonth: number
  vipThreshold: number
}

export default function CustomerKPICards({
  totalRevenue,
  totalCustomers,
  vipCustomers,
  newCustomersThisMonth,
  vipThreshold,
}: CustomerKPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Revenue */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0a150f] to-[#050a05] border border-[#1a3a22] rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-[#112a1a] p-3 rounded-xl border border-[#1a3a22]">
            <Wallet className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-green-500/80 font-medium text-sm mb-1">ยอดขายจากลูกค้า</p>
            <h3 className="text-3xl font-bold text-[#E5B842] tracking-tight">฿{totalRevenue.toLocaleString()}</h3>
            <p className="text-gray-400 text-xs mt-2">ลูกค้า {totalCustomers} ราย</p>
          </div>
        </div>
        {/* Decorative Sparkline */}
        <div className="absolute bottom-4 right-4 w-24 h-12">
          <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
            <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 0" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="100" cy="0" r="3" fill="#22c55e" />
            <path d="M0 40 L20 30 L40 35 L60 15 L80 20 L100 0 L100 40 L0 40 Z" fill="url(#gradient-green-cust)" opacity="0.2" />
            <defs>
              <linearGradient id="gradient-green-cust" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Total Customers */}
      <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
            <Users className="w-5 h-5 text-[#E5B842]" />
          </div>
          <p className="text-gray-300 font-medium text-sm">ลูกค้า</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{totalCustomers.toLocaleString()}</h3>
          <p className="text-gray-500 text-xs mt-1">ลูกค้าทั้งหมด</p>
        </div>
      </div>

      {/* VIP Customers */}
      <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
            <Crown className="w-5 h-5 text-[#E5B842]" />
          </div>
          <p className="text-gray-300 font-medium text-sm">ลูกค้า VIP</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{vipCustomers.toLocaleString()}</h3>
          <p className="text-gray-500 text-xs mt-1">ยอดซื้อ ≥ {vipThreshold.toLocaleString()}</p>
        </div>
      </div>

      {/* New Customers */}
      <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-900/20 p-2.5 rounded-full border border-yellow-800/30">
            <UserPlus className="w-5 h-5 text-[#E5B842]" />
          </div>
          <p className="text-gray-300 font-medium text-sm">ลูกค้าใหม่ (เดือนนี้)</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white tracking-tight">{newCustomersThisMonth.toLocaleString()}</h3>
          <p className="text-gray-500 text-xs mt-1">ลูกค้าใหม่ (เดือนนี้)</p>
        </div>
      </div>
    </div>
  )
}
