export default function Footer() {
  return (
    <footer className="bg-yj-black text-yj-gray-200 py-12 border-t border-yj-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex-shrink-0 flex items-center gap-2 mb-4">
              <span className="text-yj-gold font-bold text-2xl tracking-tighter">YJ</span>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-yj-gray-200">Car Protection Studio</span>
                <span className="text-xl font-bold leading-none tracking-tight">CARS DETAILING</span>
              </div>
            </div>
            <p className="text-sm text-yj-gray-400">
              ดูแลรถคุณ เหมือนรถเราเอง บริการล้างรถ เคลือบแก้ว ขัดสี ด้วยมาตรฐานระดับมืออาชีพ
            </p>
          </div>
          <div>
            <h3 className="text-yj-gold font-semibold mb-4">บริการของเรา</h3>
            <ul className="space-y-2 text-sm text-yj-gray-400">
              <li>ล้างรถมาตรฐาน</li>
              <li>เคลือบแก้ว 9H</li>
              <li>ขัดสี ฟื้นฟูสภาพ</li>
              <li>บริการพิเศษ (Premium Detailing)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-yj-gold font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-sm text-yj-gray-400">
              <li>123 ถนนเพชรเกษม กรุงเทพฯ 10160</li>
              <li>โทร: 081-234-5678</li>
              <li>Line: @yjcars</li>
              <li>Facebook: YJ Cars Detailing</li>
            </ul>
          </div>
          <div>
            <h3 className="text-yj-gold font-semibold mb-4">เวลาทำการ</h3>
            <ul className="space-y-2 text-sm text-yj-gray-400">
              <li>จันทร์ - ศุกร์: 09:00 - 18:00</li>
              <li>เสาร์ - อาทิตย์: 08:30 - 19:00</li>
              <li>หยุดทุกวันพุธ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-yj-gray-800 mt-8 pt-8 text-center text-sm text-yj-gray-400">
          © {new Date().getFullYear()} YJ Cars Detailing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
