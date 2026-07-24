import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-yj-dark-blue text-yj-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-yj-gold font-bold text-2xl tracking-tighter">YJ</span>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-yj-gray-200">Car Protection Studio</span>
              <span className="text-xl font-bold leading-none tracking-tight">CARS DETAILING</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-yj-gold transition-colors">หน้าหลัก</Link>
            <Link href="/services" className="hover:text-yj-gold transition-colors">บริการ</Link>
            <Link href="/packages" className="hover:text-yj-gold transition-colors">แพ็กเกจ</Link>
            <Link href="/reviews" className="hover:text-yj-gold transition-colors">รีวิว</Link>
            <Link href="/about" className="hover:text-yj-gold transition-colors">เกี่ยวกับเรา</Link>
            <Link href="/contact" className="hover:text-yj-gold transition-colors">ติดต่อเรา</Link>
            
            <Link href="/booking" className="bg-yj-gold text-yj-black font-bold px-6 py-2 rounded-full hover:bg-yellow-300 transition-colors shadow-[0_0_15px_rgba(250,204,21,0.4)]">
              จองคิวล้างรถ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
