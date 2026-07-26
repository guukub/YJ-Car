'use client'

import { Image as ImageIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { toPng } from "html-to-image"

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

      // Temporarily make the element visible but off-screen
      const originalPosition = element.style.position
      const originalLeft = element.style.left
      const originalDisplay = element.style.display
      const originalWidth = element.style.width
      const originalPadding = element.style.padding

      element.classList.remove('hidden')
      element.classList.remove('print:block')
      element.style.position = 'absolute'
      element.style.left = '-9999px'
      element.style.display = 'block'
      element.style.width = '800px'
      element.style.padding = '20px'

      // wait a tiny bit for DOM to apply changes
      await new Promise(resolve => setTimeout(resolve, 100))

      const dataUrl = await toPng(element, { 
        backgroundColor: '#050505',
        pixelRatio: 2, // equivalent to scale: 2
      })

      // Restore original state
      element.style.position = originalPosition
      element.style.left = originalLeft
      element.style.display = originalDisplay
      element.style.width = originalWidth
      element.style.padding = originalPadding
      element.classList.add('hidden')
      element.classList.add('print:block')

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `daily-report-${new Date().toISOString().split('T')[0]}.png`
      link.click()

    } catch (error) {
      console.error("Error generating image:", error)
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดรูปภาพ ลองอีกครั้ง")
      
      // Attempt to restore state in case of error
      const element = document.getElementById('print-area')
      if (element) {
        element.classList.add('hidden')
        element.classList.add('print:block')
      }
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
