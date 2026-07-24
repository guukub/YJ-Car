"use server"

import prisma from "@/lib/prisma"

export async function lookupCustomer(query: string) {
  if (!query || query.length < 3) return null;
  const customer = await prisma.customer.findFirst({
    where: { 
      OR: [
        { phone: { contains: query } },
        { name: { contains: query } }
      ]
    },
    include: {
      vehicles: true
    }
  })
  return customer;
}

export async function lookupVehicleByPlate(licensePlate: string) {
  if (!licensePlate) return null;
  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate },
    include: {
      customer: true
    }
  })
  return vehicle;
}

export async function searchCustomers(query: string) {
  if (!query) return [];
  return await prisma.customer.findMany({
    where: { 
      OR: [
        { phone: { contains: query } },
        { name: { contains: query } }
      ]
    },
    include: {
      vehicles: true
    },
    take: 20
  })
}