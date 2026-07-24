import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      email: 'admin',
      name: 'Admin',
      password: hashedPassword,
      role: 'OWNER',
    },
  })

  // Create default services
  const services = [
    { name: 'ล้างสีดูดฝุ่น (Size S-M)', price: 250, category: 'WASH' },
    { name: 'ล้างสีดูดฝุ่น (Size L-XL)', price: 350, category: 'WASH' },
    { name: 'เคลือบแก้ว 9H', price: 1499, category: 'COATING' },
    { name: 'ขัดสี ลบรอย', price: 2500, category: 'POLISH' },
    { name: 'ซักเบาะ พรม', price: 1200, category: 'INTERIOR' },
  ]

  for (const s of services) {
    await prisma.service.create({
      data: s
    })
  }

  console.log({ admin, services })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
