'use client'

import { Printer } from "lucide-react"

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-transparent border border-[#E5B842] text-[#E5B842] px-5 py-2.5 rounded-xl font-bold hover:bg-[#E5B842]/10 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(229,184,66,0.1)]"
    >
      <Printer className="w-5 h-5" /> พิมพ์รายงาน
    </button>
  )
}
