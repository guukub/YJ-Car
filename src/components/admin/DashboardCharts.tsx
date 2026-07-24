'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E5B842" stopOpacity={1}/>
              <stop offset="95%" stopColor="#E5B842" stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={1}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(value) => `฿${value}`} />
          <Tooltip 
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', color: '#ccc', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
          />
          <Bar dataKey="revenue" name="รายได้ (บาท)" fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} barSize={25} />
          <Bar dataKey="expense" name="รายจ่าย (บาท)" fill="url(#colorExpense)" radius={[4, 4, 0, 0]} barSize={25} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
