'use client'

import { Image as ImageIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import html2canvas from "html2canvas"

export default function ExportImageButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const element = document.getElementById('print-area')
      if (!element) {
        console.error("Print area not found");
        return;
      }

      const canvas = await html2canvas(element, {
        // @ts-ignore - scale is a valid option in html2canvas but might be missing in @types
        scale: 2, 
        backgroundColor: '#050505',
        useCORS: true,
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('print-area')
          if (clonedElement) {
            clonedElement.classList.remove('hidden')
            clonedElement.classList.remove('print:block')
            clonedElement.style.display = 'block'
            clonedElement.style.width = '800px'
            clonedElement.style.padding = '20px'
            clonedElement.style.position = 'relative'
          }
        }
      })

      const image = canvas.toDataURL("image/png")
      
      const link = document.createElement('a')
      link.href = image
      link.download = `daily-report-${new Date().toISOString().split('T')[0]}.png`
      link.click()

    } catch (error) {
      console.error("Error generating image:", error)
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className="bg-[#E5B842] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(229,184,66,0.2)] disabled:opacity-50" 
      title="ดาวน์โหลดเป็นรูปภาพ"
    >
      {isExporting ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ImageIcon className="w-5 h-5" />
      )}
      {isExporting ? "กำลังประมวลผล..." : "ดาวน์โหลดรูปภาพ"}
    </button>
  )
}
