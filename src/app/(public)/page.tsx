import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Star, MapPin, Phone, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center bg-yj-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=2070"
            alt="Luxury black car detailing"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-yj-black via-yj-black/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-yj-white leading-tight mb-4">
              ดูแลรถคุณ<br/>
              <span className="text-yj-gold">เหมือนรถเราเอง</span>
            </h1>
            <p className="text-lg md:text-xl text-yj-gray-200 mb-8">
              บริการล้างรถ เคลือบแก้ว ขัดสี ฟื้นฟูสภาพรถยนต์ ด้วยผลิตภัณฑ์พรีเมียมและมาตรฐานระดับมืออาชีพ
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/booking" 
                className="bg-yj-gold text-yj-black font-bold px-8 py-4 rounded-full text-center hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
              >
                จองคิวล้างรถออนไลน์
              </Link>
              <Link 
                href="/services" 
                className="bg-transparent border-2 border-yj-white text-yj-white font-bold px-8 py-4 rounded-full text-center hover:bg-yj-white/10 transition-all"
              >
                ดูบริการทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "ล้างรถมาตรฐาน", desc: "สะอาด ใส ทุกคัน", icon: "🚗" },
            { title: "เคลือบแก้ว / Wax", desc: "ปกป้องสีรถ", icon: "✨" },
            { title: "ขัดสี - ฟื้นฟูสภาพ", desc: "รถเงาเหมือนใหม่", icon: "🎯" },
            { title: "บริการพิเศษ", desc: "Interior / Ozone", icon: "🌟" }
          ].map((service, i) => (
            <div key={i} className="bg-yj-dark-blue p-6 rounded-2xl shadow-xl border border-yj-gray-800 hover:border-yj-gold transition-colors group cursor-pointer">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-yj-white font-bold text-xl mb-1">{service.title}</h3>
              <p className="text-yj-gray-400 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 bg-yj-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-yj-black mb-2">แพ็กเกจยอดนิยม</h2>
              <div className="w-16 h-1 bg-yj-gold"></div>
            </div>
            <Link href="/packages" className="text-yj-dark-blue font-semibold hover:text-yj-gold transition-colors flex items-center gap-1">
              ดูทั้งหมด <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "ล้างรถมาตรฐาน", desc: "ล้างภายนอก + ภายใน", price: "250", img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=600" },
              { title: "เคลือบแก้ว 9H", desc: "ปกป้องสีรถ 6-12 เดือน", price: "1,499", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600" },
              { title: "ขัดสี + เคลือบแก้ว", desc: "ฟื้นฟูสภาพสีรถ", price: "2,500", img: "https://images.unsplash.com/photo-1587353995543-85f2eb79ebfa?auto=format&fit=crop&q=80&w=600" },
              { title: "Premium Full Service", desc: "ดูแลครบจบในแพ็กเดียว", price: "3,500", img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600" },
            ].map((pkg, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-48 relative">
                  <Image src={pkg.img} alt={pkg.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-xl text-yj-black mb-1">{pkg.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{pkg.desc}</p>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold text-yj-black mb-4">฿ {pkg.price}</p>
                    <Link href="/booking" className="block w-full py-2 text-center rounded-lg border border-yj-gray-200 text-yj-black font-semibold hover:bg-yj-gold hover:border-yj-gold transition-colors">
                      เลือกแพ็กเกจ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-yj-black mb-2">รีวิวจากลูกค้า</h2>
            <div className="w-16 h-1 bg-yj-gold"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex gap-1 text-yj-gold mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-4 text-sm italic">
                  "บริการดีมากครับ รถเงาเหมือนใหม่เลย พนักงานให้คำแนะนำดีมาก ประทับใจสุดๆ จะกลับมาใช้บริการอีกแน่นอนครับ"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    C{i+1}
                  </div>
                  <div>
                    <p className="font-semibold text-yj-black text-sm">ลูกค้าท่านที่ {i+1}</p>
                    <p className="text-xs text-gray-400">ใช้บริการเคลือบแก้ว 9H</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section className="py-16 bg-yj-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-yj-black mb-6">ติดต่อเรา</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yj-gray-100 rounded-full flex items-center justify-center text-yj-dark-blue shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yj-black">ที่ตั้งร้าน</h4>
                    <p className="text-gray-600">123 ถนนเพชรเกษม แขวงบางหว้า<br/>เขตภาษีเจริญ กรุงเทพฯ 10160</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yj-gray-100 rounded-full flex items-center justify-center text-yj-dark-blue shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-yj-black">เบอร์โทรศัพท์</h4>
                    <p className="text-gray-600">081-234-5678</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <a href="#" className="flex items-center gap-2 bg-[#00B900] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    <MessageCircle className="w-5 h-5" /> LINE Official
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                </div>
              </div>
            </div>
            <div className="h-80 bg-gray-200 rounded-2xl overflow-hidden relative border border-gray-200 shadow-inner flex items-center justify-center">
               <span className="text-gray-500 font-semibold">[ แผนที่ Google Maps Placeholder ]</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
