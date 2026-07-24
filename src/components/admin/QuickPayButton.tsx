'use client'

import { useState } from 'react'
import { Banknote, X } from 'lucide-react'
import { markAsPaid } from '@/app/actions/queue'

export default function QuickPayButton({ jobId, netPrice, isPaid }: { jobId: string, netPrice: number, isPaid: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePay = async (method: string) => {
    setLoading(true)
    await markAsPaid(jobId, method, netPrice)
    setLoading(false)
    setIsOpen(false)
  }

  if (isPaid) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded border border-transparent hover:border-emerald-200" 
        title="รับชำระเงิน"
      >
        <Banknote className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                รับชำระเงินด่วน
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              ยอดชำระสุทธิ: <br/>
              <span className="text-3xl font-bold text-emerald-600">฿{netPrice.toLocaleString()}</span>
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => handlePay('CASH')}
                disabled={loading}
                className="flex-1 py-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl font-medium flex items-center justify-center gap-2 border border-green-200 transition-colors disabled:opacity-50"
              >
                เงินสด
              </button>
              <button 
                onClick={() => handlePay('TRANSFER')}
                disabled={loading}
                className="flex-1 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium flex items-center justify-center gap-2 border border-blue-200 transition-colors disabled:opacity-50"
              >
                โอนเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
