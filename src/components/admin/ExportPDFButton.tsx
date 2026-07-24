'use client'

import { Download } from "lucide-react"

export default function ExportPDFButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-[#E5B842] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(229,184,66,0.2)]" 
      title="ส่งออก PDF"
    >
      <Download className="w-5 h-5" /> ส่งออก PDF
    </button>
  )
}
