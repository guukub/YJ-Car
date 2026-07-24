"use client"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { th } from "date-fns/locale"

export default function ClientDatePicker({ defaultValue, name }: { defaultValue: Date | null, name: string }) {
  const [date, setDate] = useState<Date | null>(defaultValue)

  return (
    <>
      <input type="hidden" name={name} value={date ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear() + 543}` : ""} />
      <DatePicker
        selected={date}
        onChange={(d: Date | null) => setDate(d)}
        dateFormat="dd/MM/yyyy"
        locale={th}
        placeholderText="วว/ดด/ปปปป"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        wrapperClassName="w-full"
      />
    </>
  )
}
