"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns"

function QueueFilterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentStart = searchParams.get('start') || ''
  const currentEnd = searchParams.get('end') || ''
  const currentStatus = searchParams.get('paymentStatus') || 'ALL'

  const [startDate, setStartDate] = useState(currentStart)
  const [endDate, setEndDate] = useState(currentEnd)
  const [status, setStatus] = useState(currentStatus)

  useEffect(() => {
    setStartDate(currentStart)
    setEndDate(currentEnd)
    setStatus(currentStatus)
  }, [currentStart, currentEnd, currentStatus])

  const applyFilter = (s: string, e: string, st: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (s) params.set('start', s)
    else params.delete('start')
    
    if (e) params.set('end', e)
    else params.delete('end')
    
    if (st && st !== 'ALL') params.set('paymentStatus', st)
    else params.delete('paymentStatus')
    
    router.push(`?${params.toString()}`)
  }

  const handleDateChange = (type: 'start' | 'end', val: string) => {
    if (type === 'start') {
      setStartDate(val)
      applyFilter(val, endDate, status)
    } else {
      setEndDate(val)
      applyFilter(startDate, val, status)
    }
  }

  const handleStatusChange = (val: string) => {
    setStatus(val)
    applyFilter(startDate, endDate, val)
  }

  const clearDateFilter = () => {
    setStartDate('')
    setEndDate('')
    applyFilter('', '', status)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 w-fit">
      
      {/* Payment Status Dropdown */}
      <div className="flex items-center gap-2 px-2 border-r border-gray-200">
        <select 
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
        >
          <option value="ALL">ทุกสถานะการชำระเงิน</option>
          <option value="PAID">ชำระแล้ว</option>
          <option value="UNPAID">ค้างชำระ / รอชำระ</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2 px-2">
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => handleDateChange('start', e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
        />
        <span className="text-gray-400">-</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
        />
        {(startDate || endDate) && (
          <button 
            onClick={clearDateFilter}
            className="ml-2 text-xs text-red-500 hover:text-red-700 underline"
          >
            ล้างวันที่
          </button>
        )}
      </div>

    </div>
  )
}

export default function QueueFilter() {
  return (
    <Suspense fallback={<div className="h-12 w-96 bg-gray-100 animate-pulse rounded-2xl"></div>}>
      <QueueFilterContent />
    </Suspense>
  )
}
