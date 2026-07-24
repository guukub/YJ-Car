'use client'

import { useState, useRef, useEffect } from "react"
import { Car, User, Settings2, Save, Calendar, Image as ImageIcon, Plus, Trash2, Search, UserPlus, Phone, MessageCircle, Mail, Hash, MapPin, Gauge, Clock } from "lucide-react"
import { createQueue, fullUpdateQueueJob } from "@/app/actions/queue"
import { lookupCustomer, lookupVehicleByPlate, searchCustomers } from "@/app/actions/lookup"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { th } from "date-fns/locale"

type Service = {
  id: string
  name: string
  price: number
}

type CustomService = {
  name: string
  price: number
}

type QueueFormProps = {
  services: Service[]
  countToday: number
  initialData?: any
  staffs?: any[]
}

export default function QueueForm({ countToday, services, initialData, staffs }: QueueFormProps) {
  const initialAdjustedPrices: Record<string, number> = {}
  if (initialData?.services) {
    initialData.services.forEach((s: any) => {
      if (s.service?.category !== 'CUSTOM') {
        initialAdjustedPrices[s.serviceId] = s.priceAtTime;
      }
    })
  }
  
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.services?.filter((s:any) => s.service?.category !== 'CUSTOM').map((s:any) => s.serviceId) || [])
  const [adjustedPrices, setAdjustedPrices] = useState<Record<string, number>>(initialAdjustedPrices)
  const [customServices, setCustomServices] = useState<CustomService[]>(initialData?.services?.filter((s:any) => s.service?.category === 'CUSTOM').map((s:any) => ({ name: s.service.name, price: s.priceAtTime })) || [])
  const [customName, setCustomName] = useState("")
  const [customPrice, setCustomPrice] = useState("")
  const [warrantyDate, setWarrantyDate] = useState<Date | null>(initialData?.warrantyEnd ? new Date(initialData.warrantyEnd) : null)
  const [discount, setDiscount] = useState<number>(initialData?.discount || 0)
  
  const handleAdjustPrice = (id: string, value: string) => {
    setAdjustedPrices(prev => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }))
  }
  
  const handleServiceToggle = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const customerNameRef = useRef<HTMLInputElement>(null)
  const customerPhoneRef = useRef<HTMLInputElement>(null)
  const lineIdRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLTextAreaElement>(null)
  
  const licensePlateRef = useRef<HTMLInputElement>(null)
  const brandRef = useRef<HTMLInputElement>(null)
  const modelRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)
  const currentMileageRef = useRef<HTMLInputElement>(null)
  const chassisNoRef = useRef<HTMLInputElement>(null)
  
  const [isFetching, setIsFetching] = useState(false)
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState(initialData?.customer?.name || "")
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  useEffect(() => {
    if (initialData) {
      if (customerPhoneRef.current) customerPhoneRef.current.value = initialData.customer?.phone || '';
      if (lineIdRef.current) lineIdRef.current.value = initialData.customer?.lineId || '';
      if (emailRef.current) emailRef.current.value = initialData.customer?.email || '';
      if (addressRef.current) addressRef.current.value = initialData.customer?.address || '';
      
      if (licensePlateRef.current) licensePlateRef.current.value = initialData.vehicle?.licensePlate || '';
      if (brandRef.current) brandRef.current.value = initialData.vehicle?.brand || '';
      if (modelRef.current) modelRef.current.value = initialData.vehicle?.model || '';
      if (colorRef.current) colorRef.current.value = initialData.vehicle?.color || '';
      if (typeRef.current) typeRef.current.value = initialData.vehicle?.type || '';
      if (currentMileageRef.current) currentMileageRef.current.value = initialData.vehicle?.currentMileage || '';
      if (chassisNoRef.current) chassisNoRef.current.value = initialData.vehicle?.chassisNo || '';
    }
  }, [initialData])

  const handleSearch = async () => {
    if (searchQuery.length >= 2) {
      setIsFetching(true)
      const results = await searchCustomers(searchQuery)
      setSearchResults(results || [])
      setIsSearchModalOpen(true)
      setIsFetching(false)
    }
  }

  const selectCustomer = (customer: any) => {
    if (customerNameRef.current) customerNameRef.current.value = customer.name;
    if (customerPhoneRef.current) customerPhoneRef.current.value = customer.phone;
    if (lineIdRef.current) lineIdRef.current.value = customer.lineId || '';
    if (emailRef.current) emailRef.current.value = customer.email || '';
    if (addressRef.current) addressRef.current.value = customer.address || '';
    
    if (customer.vehicles && customer.vehicles.length > 0) {
      setCustomerVehicles(customer.vehicles)
      if (licensePlateRef.current && !licensePlateRef.current.value) {
        fillVehicle(customer.vehicles[0])
      }
    } else {
      setCustomerVehicles([])
    }
    
    setIsSearchModalOpen(false)
  }

  const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep this for backwards compatibility if needed, but we'll use handleSearch.
    const val = e.target.value.replace(/\D/g, '')
    e.target.value = val
    if (val.length >= 9) {
      setSearchQuery(val)
      setTimeout(handleSearch, 100)
    }
  }

  const fillVehicle = (v: any) => {
    if (licensePlateRef.current) licensePlateRef.current.value = v.licensePlate;
    if (brandRef.current) brandRef.current.value = v.brand;
    if (modelRef.current) modelRef.current.value = v.model;
    if (colorRef.current) colorRef.current.value = v.color;
    if (typeRef.current) typeRef.current.value = v.type;
    if (currentMileageRef.current) currentMileageRef.current.value = v.currentMileage || '';
    if (chassisNoRef.current) chassisNoRef.current.value = v.chassisNo || '';
  }

  const handleVehicleSearch = async () => {
    if (!licensePlateRef.current) return;
    const val = licensePlateRef.current.value
    if (val.length >= 2) {
      setIsFetching(true)
      const vehicle = await lookupVehicleByPlate(val)
      if (vehicle) {
        fillVehicle(vehicle)
      }
      setIsFetching(false)
    }
  }

  const handleAddCustomService = () => {
    if (customName && customPrice) {
      setCustomServices([...customServices, { name: customName, price: parseFloat(customPrice) }])
      setCustomName("")
      setCustomPrice("")
    }
  }

  const handleRemoveCustomService = (index: number) => {
    setCustomServices(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateCustomService = (index: number, field: 'name' | 'price', value: string) => {
    const newServices = [...customServices];
    if (field === 'price') {
      newServices[index].price = parseFloat(value) || 0;
    } else {
      newServices[index].name = value;
    }
    setCustomServices(newServices);
  }

  const totalStandardPrice = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + (adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price), 0)
    
  const totalCustomPrice = customServices.reduce((sum, s) => sum + s.price, 0)
  const totalPrice = totalStandardPrice + totalCustomPrice
  const netPrice = Math.max(0, totalPrice - discount)

  return (
    <form action={initialData ? fullUpdateQueueJob : createQueue} className="space-y-6">
      <input type="hidden" name="customServices" value={JSON.stringify(customServices)} />
      <input type="hidden" name="adjustedPrices" value={JSON.stringify(adjustedPrices)} />
      {initialData && <input type="hidden" name="jobId" value={initialData.id} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Section Redesign */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold text-lg">
              <User className="w-5 h-5" />
              ข้อมูลลูกค้า
            </div>

            <div className="space-y-6">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">ชื่อลูกค้า <span className="text-emerald-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      ref={customerNameRef}
                      type="text" 
                      name="customerName"
                      required
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSearch()
                        }
                      }}
                      placeholder="พิมพ์ชื่อลูกค้า เบอร์โทร หรือกดค้นหา" 
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <button type="button" onClick={handleSearch} className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm">
                    {isFetching ? <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                  </button>
                  <button type="button" className="px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-sm">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Customer Details Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      ref={customerPhoneRef}
                      type="tel" 
                      name="customerPhone" 
                      required
                      maxLength={10}
                      onChange={handlePhoneChange}
                      placeholder="08X-XXX-XXXX" 
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LINE @</label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input 
                      ref={lineIdRef}
                      type="text" 
                      name="lineId" 
                      placeholder="@lineid" 
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      ref={emailRef}
                      type="email" 
                      name="email" 
                      placeholder="email@example.com" 
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                <Car className="w-5 h-5" />
                ข้อมูลรถ
              </div>
              
            </div>
            
            <div className="space-y-6">
              {customerVehicles.length > 0 && (
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    onChange={(e) => {
                      const idx = parseInt(e.target.value)
                      if (!isNaN(idx)) fillVehicle(customerVehicles[idx])
                    }}
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-10 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm appearance-none bg-white font-medium text-gray-700"
                  >
                    <option value="">-- เลือกรถของลูกค้า --</option>
                    {customerVehicles.map((v, i) => (
                      <option key={i} value={i}>{v.brand} {v.model} {v.color} {v.licensePlate}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทรถ</label>
                  <select ref={typeRef} name="type" defaultValue={initialData?.vehicle?.type || "S"} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-white">
                     <option value="S">Size S (รถเก๋งเล็ก)</option>
                     <option value="M">Size M (รถเก๋งใหญ่)</option>
                     <option value="L">Size L (SUV เล็ก)</option>
                     <option value="XL">Size XL (SUV ใหญ่/กระบะ)</option>
                     <option value="XXL">Size XXL (รถตู้)</option>
                     <option value="MC">มอเตอร์ไซค์</option>
                     <option value="BB">บิ๊กไบค์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อรถ</label>
                  <input ref={brandRef} type="text" name="brand" placeholder="Toyota" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รุ่นรถ</label>
                  <input ref={modelRef} type="text" name="model" placeholder="Camry" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สีรถ</label>
                  <input ref={colorRef} type="text" name="color" placeholder="ขาว" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ทะเบียนรถ <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        ref={licensePlateRef} 
                        type="text" 
                        name="licensePlate" 
                        required 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleVehicleSearch()
                          }
                        }}
                        placeholder="กก-1234 กรุงเทพฯ" 
                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm uppercase" 
                      />
                    </div>
                    <button type="button" onClick={handleVehicleSearch} className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm">
                      {isFetching ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ไมล์ปัจจุบัน (กม.)</label>
                  <div className="relative">
                    <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      ref={currentMileageRef} 
                      type="text" 
                      name="currentMileage" 
                      placeholder="45,000" 
                      className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่ตัวถัง (Chassis No.)</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    ref={chassisNoRef} 
                    type="text" 
                    name="chassisNo" 
                    placeholder="เช่น JTMHX3JH50D000001" 
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm uppercase" 
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => alert('ข้อมูลรถจะถูกบันทึกอัตโนมัติเมื่อกด "บันทึกคิว"')}
                className="w-full py-3 border border-dashed border-blue-400 rounded-xl text-blue-600 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Car className="w-5 h-5" /> บันทึกรถนี้ไว้กับลูกค้า
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ (สำหรับออกเอกสาร)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  <textarea 
                    ref={addressRef} 
                    name="address" 
                    rows={2} 
                    placeholder="ที่อยู่ลูกค้า" 
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Service Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-yj-dark-blue font-bold text-lg">
              <Settings2 className="w-5 h-5 text-yj-gold" />
              เลือกบริการ (เลือกได้หลายรายการ)
            </div>
            
            {services.length === 0 ? (
              <div className="text-red-500 text-sm py-2">ยังไม่มีข้อมูลบริการในระบบ โปรดเพิ่มบริการก่อน</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {services.map(s => (
                  <label key={s.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${selectedServices.includes(s.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        name="serviceIds"
                        value={s.id}
                        checked={selectedServices.includes(s.id)}
                        onChange={() => handleServiceToggle(s.id)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-700">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-sm">฿</span>
                      <input 
                        type="number"
                        value={adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price}
                        onChange={(e) => handleAdjustPrice(s.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-16 text-right bg-transparent border-b border-transparent hover:border-gray-300 focus:border-yj-gold focus:outline-none text-gray-600 font-medium"
                      />
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {/* Custom Services */}
            <div className="mb-6 border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">เพิ่มบริการอื่นๆ (Custom Service)</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomService();
                    }
                  }}
                  placeholder="ชื่อบริการ เช่น ซ่อมเบาะ" 
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" 
                />
                <input 
                  type="number" 
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomService();
                    }
                  }}
                  placeholder="ราคา" 
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" 
                />
                <button 
                  type="button" 
                  onClick={handleAddCustomService}
                  className="bg-yj-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> เพิ่ม
                </button>
              </div>
              
              {customServices.length > 0 && (
                <div className="space-y-2 mt-3">
                  {customServices.map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:border-yj-gold focus-within:ring-1 focus-within:ring-yj-gold">
                      <input 
                        type="text" 
                        value={s.name}
                        onChange={(e) => handleUpdateCustomService(idx, 'name', e.target.value)}
                        className="font-medium bg-transparent border-none outline-none focus:ring-0 text-sm px-2 w-full"
                      />
                      <div className="flex items-center gap-2 pr-1">
                        <span className="text-gray-500 text-sm">฿</span>
                        <input 
                          type="number" 
                          value={s.price || ''}
                          onChange={(e) => handleUpdateCustomService(idx, 'price', e.target.value)}
                          className="text-yj-dark-blue font-medium bg-transparent border-none outline-none focus:ring-0 text-sm w-16 text-right"
                        />
                        <button type="button" onClick={() => handleRemoveCustomService(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded ml-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาประกัน (ถ้ามี)</label>
                <input type="text" name="warranty" defaultValue={initialData?.warranty || ""} placeholder="เช่น 1 ปี, 6 เดือน" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันหมดประกัน</label>
                <input type="hidden" name="warrantyEndText" value={warrantyDate ? `${String(warrantyDate.getDate()).padStart(2, '0')}/${String(warrantyDate.getMonth() + 1).padStart(2, '0')}/${warrantyDate.getFullYear() + 543}` : ""} />
                <DatePicker
                  selected={warrantyDate}
                  onChange={(date: Date | null) => setWarrantyDate(date)}
                  dateFormat="dd/MM/yyyy"
                  locale={th}
                  placeholderText="วว/ดด/ปปปป"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-yj-gold focus:border-yj-gold"
                  wrapperClassName="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุเพิ่มเติม</label>
                <textarea name="notes" rows={1} defaultValue={initialData?.notes || ""} placeholder="เช่น ระวังรอยขีดข่วน..." className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yj-gold focus:border-yj-gold"></textarea>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
              <input 
                type="checkbox" 
                id="isPromotion"
                name="isPromotion" 
                value="true"
                defaultChecked={initialData?.isPromotion || false}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="isPromotion" className="font-medium text-indigo-900 cursor-pointer select-none flex-1">
                รถคันนี้ใช้โปรโมชั่นพิเศษ (เพื่อนับสถิติการใช้โปรโมชั่นประจำวัน)
              </label>
            </div>
          </div>
          
          {/* File Uploads */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm opacity-50">
             <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold text-lg">
              <ImageIcon className="w-5 h-5" />
              อัปโหลดรูปภาพ (กำลังพัฒนา)
            </div>
            <p className="text-sm text-gray-500">รองรับการอัปโหลดรูปรถก่อนทำ รอยขีดข่วน ภายในรถ รูปหลังทำเสร็จ (เฟสถัดไป)</p>
          </div>
        </div>
        
        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg text-yj-dark-blue mb-4 border-b pb-2">สรุปรายการ</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>ราคารวม ({selectedServices.length + customServices.length} รายการ)</span>
                <span>฿{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>ส่วนลด</span>
                <div className="flex items-center gap-1 w-24">
                  <span>-฿</span>
                  <input 
                    type="number" 
                    name="discount" 
                    min="0" 
                    value={discount || ""}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full border-b border-gray-300 px-1 py-1 text-right focus:outline-none focus:border-yj-gold" 
                  />
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-yj-black border-t pt-3">
                <span>ยอดสุทธิ</span>
                <span className="text-green-600">฿{netPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
               <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4"/> วันที่เข้ารับบริการ</label>
               <input 
                 type="date" 
                 name="timeIn" 
                 defaultValue={initialData?.timeIn 
                    ? new Date(new Date(initialData.timeIn).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10) 
                    : new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)} 
                 className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-yj-gold focus:border-yj-gold" 
               />
            </div>

            {initialData && (
              <div className="mb-6 border-t pt-4 space-y-4">
                <h3 className="font-bold text-lg text-gray-800">การดำเนินการ</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">สถานะชำระเงิน</label>
                    <select name="paymentStatus" defaultValue={initialData.paymentStatus} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                      <option value="UNPAID">ยังไม่ชำระ (Unpaid)</option>
                      <option value="DEPOSIT">มัดจำแล้ว (Deposit)</option>
                      <option value="PAID">ชำระครบถ้วน (Paid)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ยอดเงินที่รับมาแล้ว</label>
                    <input type="number" name="amountPaid" defaultValue={initialData.amountPaid} step="0.01" min="0" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ช่องทางการชำระเงิน</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg flex-1 text-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-yj-gold">
                        <input type="radio" name="paymentMethod" value="CASH" defaultChecked={initialData.paymentMethod === 'CASH'} className="text-yj-gold focus:ring-yj-gold" />
                        <span className="font-medium text-gray-700">เงินสด</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg flex-1 text-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-yj-gold">
                        <input type="radio" name="paymentMethod" value="TRANSFER" defaultChecked={initialData.paymentMethod === 'TRANSFER'} className="text-yj-gold focus:ring-yj-gold" />
                        <span className="font-medium text-gray-700">โอนเงิน</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ช่างผู้รับผิดชอบ</label>
                    <select name="staffId" defaultValue={initialData.staffId || ""} className="w-full border border-gray-300 rounded-lg px-4 py-2">
                      <option value="">-- ไม่ระบุช่าง --</option>
                      {staffs?.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name || staff.email}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={selectedServices.length === 0 && customServices.length === 0} className="w-full bg-blue-600 text-white font-bold px-4 py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-5 h-5" />
              {initialData ? "บันทึกการแก้ไขคิว" : "บันทึกคิวล้างรถ"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-500" />
                ผลการค้นหา
              </h3>
              <button 
                type="button" 
                onClick={() => setIsSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>ไม่พบข้อมูลลูกค้าจากคำค้นหา <strong>"{searchQuery}"</strong></p>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (customerNameRef.current) customerNameRef.current.value = searchQuery;
                      setIsSearchModalOpen(false);
                    }}
                    className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                  >
                    ใช้ชื่อนี้เป็นลูกค้าใหม่
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((customer) => (
                    <div 
                      key={customer.id} 
                      onClick={() => selectCustomer(customer)}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 cursor-pointer transition-all group"
                    >
                      <div>
                        <div className="font-bold text-gray-800 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                          {customer.name}
                          {customer.totalSpent >= 10000 && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">VIP</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </span>
                          {customer.vehicles && customer.vehicles.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Car className="w-3 h-3" />
                              {customer.vehicles.length} คัน
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="px-4 py-2 bg-white text-emerald-600 rounded-lg text-sm font-medium border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors shadow-sm"
                      >
                        เลือก
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
