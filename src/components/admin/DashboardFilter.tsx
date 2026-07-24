"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, format } from "date-fns"

function FilterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentStart = searchParams.get('start') || ''
  const currentEnd = searchParams.get('end') || ''

  const [activePreset, setActivePreset] = useState<string>('')
  
  const [startDate, setStartDate] = useState(currentStart)
  const [endDate, setEndDate] = useState(currentEnd)

  useEffect(() => {
    // Try to match preset based on dates
    const now = new Date()
    const thisMonthStart = format(startOfMonth(now), 'yyyy-MM-dd')
    const thisMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd')
    
    const lastMonth = subMonths(now, 1)
    const lastMonthStart = format(startOfMonth(lastMonth), 'yyyy-MM-dd')
    const lastMonthEnd = format(endOfMonth(lastMonth), 'yyyy-MM-dd')
    
    const threeMonthsAgo = subMonths(now, 3)
    const threeMonthsStart = format(startOfMonth(threeMonthsAgo), 'yyyy-MM-dd')
    const threeMonthsEnd = format(endOfMonth(now), 'yyyy-MM-dd')
    
    const thisYearStart = format(startOfYear(now), 'yyyy-MM-dd')
    const thisYearEnd = format(endOfYear(now), 'yyyy-MM-dd')

    if (!currentStart && !currentEnd) {
      setActivePreset('this-month') // Default
    } else if (currentStart === thisMonthStart && currentEnd === thisMonthEnd) {
      setActivePreset('this-month')
    } else if (currentStart === lastMonthStart && currentEnd === lastMonthEnd) {
      setActivePreset('last-month')
    } else if (currentStart === threeMonthsStart && currentEnd === threeMonthsEnd) {
      setActivePreset('3-months')
    } else if (currentStart === thisYearStart && currentEnd === thisYearEnd) {
      setActivePreset('this-year')
    } else {
      setActivePreset('custom')
    }
    
    setStartDate(currentStart)
    setEndDate(currentEnd)
  }, [currentStart, currentEnd])

  const applyFilter = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (start) params.set('start', start)
    else params.delete('start')
    
    if (end) params.set('end', end)
    else params.delete('end')
    
    router.push(`?${params.toString()}`)
  }

  const handlePreset = (preset: string) => {
    const now = new Date()
    let s = '', e = ''
    
    switch (preset) {
      case 'this-month':
        s = format(startOfMonth(now), 'yyyy-MM-dd')
        e = format(endOfMonth(now), 'yyyy-MM-dd')
        break
      case 'last-month':
        const lastMonth = subMonths(now, 1)
        s = format(startOfMonth(lastMonth), 'yyyy-MM-dd')
        e = format(endOfMonth(lastMonth), 'yyyy-MM-dd')
        break
      case '3-months':
        const threeMonthsAgo = subMonths(now, 3)
        s = format(startOfMonth(threeMonthsAgo), 'yyyy-MM-dd')
        e = format(endOfMonth(now), 'yyyy-MM-dd')
        break
      case 'this-year':
        s = format(startOfYear(now), 'yyyy-MM-dd')
        e = format(endOfYear(now), 'yyyy-MM-dd')
        break
    }
    
    applyFilter(s, e)
  }

  const handleDateChange = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setStartDate(val)
      if (val && endDate) applyFilter(val, endDate)
    } else {
      setEndDate(val)
      if (startDate && val) applyFilter(startDate, val)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 w-fit">
      <div className="flex bg-[#111] p-1 rounded-xl border border-gray-900 shadow-inner">
        <button 
          onClick={() => handlePreset('this-month')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activePreset === 'this-month' ? 'bg-[#0A0A0A] text-[#E5B842] border border-[#E5B842]/50 shadow-[0_0_10px_rgba(229,184,66,0.1)]' : 'text-gray-400 hover:text-gray-300 border border-transparent'}`}
        >
          เดือนนี้
        </button>
        <button 
          onClick={() => handlePreset('last-month')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activePreset === 'last-month' ? 'bg-[#0A0A0A] text-[#E5B842] border border-[#E5B842]/50 shadow-[0_0_10px_rgba(229,184,66,0.1)]' : 'text-gray-400 hover:text-gray-300 border border-transparent'}`}
        >
          เดือนที่แล้ว
        </button>
        <button 
          onClick={() => handlePreset('3-months')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activePreset === '3-months' ? 'bg-[#0A0A0A] text-[#E5B842] border border-[#E5B842]/50 shadow-[0_0_10px_rgba(229,184,66,0.1)]' : 'text-gray-400 hover:text-gray-300 border border-transparent'}`}
        >
          3 เดือน
        </button>
        <button 
          onClick={() => handlePreset('this-year')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activePreset === 'this-year' ? 'bg-[#0A0A0A] text-[#E5B842] border border-[#E5B842]/50 shadow-[0_0_10px_rgba(229,184,66,0.1)]' : 'text-gray-400 hover:text-gray-300 border border-transparent'}`}
        >
          ปีนี้
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="border border-gray-800 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none bg-[#111] text-gray-300"
          style={{ colorScheme: 'dark' }}
        />
        <span className="text-gray-500">-</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="border border-gray-800 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-[#E5B842] focus:border-[#E5B842] outline-none bg-[#111] text-gray-300"
          style={{ colorScheme: 'dark' }}
        />
      </div>
    </div>
  )
}

export default function DashboardFilter() {
  return (
    <Suspense fallback={<div className="h-12 w-96 bg-gray-100 animate-pulse rounded-2xl"></div>}>
      <FilterContent />
    </Suspense>
  )
}
