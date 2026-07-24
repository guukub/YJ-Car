"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { format } from "date-fns"

function DailyFilterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const startDateParam = searchParams.get('startDate') || searchParams.get('date')
  const endDateParam = searchParams.get('endDate') || searchParams.get('date')
  
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    if (startDateParam) {
      setStartDate(startDateParam)
    } else {
      setStartDate(format(new Date(), 'yyyy-MM-dd'))
    }
    
    if (endDateParam) {
      setEndDate(endDateParam)
    } else {
      setEndDate(format(new Date(), 'yyyy-MM-dd'))
    }
  }, [startDateParam, endDateParam])

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('date')
    if (startDate && endDate) {
      params.set('startDate', startDate)
      params.set('endDate', endDate)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center gap-2">
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 bg-[#111] border border-[#222] rounded-xl text-gray-300 hover:border-[#E5B842]/50 focus:ring-1 focus:ring-[#E5B842] outline-none transition-colors shadow-sm font-medium"
          style={{ colorScheme: 'dark' }}
        />
        <span className="text-gray-500 font-medium">-</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 bg-[#111] border border-[#222] rounded-xl text-gray-300 hover:border-[#E5B842]/50 focus:ring-1 focus:ring-[#E5B842] outline-none transition-colors shadow-sm font-medium"
          style={{ colorScheme: 'dark' }}
        />
      </div>

      <button 
        onClick={handleApply}
        className="px-4 py-2 bg-transparent border border-[#E5B842] text-[#E5B842] rounded-xl hover:bg-[#E5B842]/10 transition-colors shadow-[0_0_10px_rgba(229,184,66,0.1)] font-medium flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        ค้นหา
      </button>
    </div>
  )
}

export default function DailyReportFilter() {
  return (
    <Suspense fallback={<div className="h-10 w-64 bg-gray-100 animate-pulse rounded-xl"></div>}>
      <DailyFilterContent />
    </Suspense>
  )
}

