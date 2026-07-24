'use client'

import { QRCodeCanvas } from 'qrcode.react'
// @ts-ignore
import generatePayload from 'promptpay-qr'

export default function PromptPayQR({ amount, promptPayId }: { amount: number, promptPayId: string }) {
  if (!promptPayId) return null;

  const payload = generatePayload(promptPayId, { amount })

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/PromptPay-logo.png/1200px-PromptPay-logo.png" alt="PromptPay" className="h-6 mb-4" />
      <QRCodeCanvas value={payload} size={150} />
      <p className="mt-4 font-bold text-lg text-yj-dark-blue">฿{amount.toLocaleString()}</p>
      <p className="text-xs text-gray-500 text-center mt-1">สแกนเพื่อชำระเงิน<br/>(ชำระเงินแล้วกรุณาแนบสลิป)</p>
    </div>
  )
}
