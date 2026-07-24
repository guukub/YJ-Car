'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createQueue(formData: FormData) {
  const customerName = formData.get("customerName") as string
  const customerPhone = formData.get("customerPhone") as string
  const lineId = formData.get("lineId") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  
  const licensePlate = formData.get("licensePlate") as string
  const vehicleType = formData.get("vehicleType") as string || formData.get("type") as string
  const brand = formData.get("brand") as string
  const model = formData.get("model") as string
  const color = formData.get("color") as string
  const currentMileage = formData.get("currentMileage") as string
  const chassisNo = formData.get("chassisNo") as string
  const notes = formData.get("notes") as string
  const timeInStr = formData.get("timeIn") as string
  const appointmentAtStr = formData.get("appointmentAt") as string
  const paymentMethod = formData.get("paymentMethod") as string || null
  const isPromotion = formData.get("isPromotion") === "true"
  
  // Extract multiple services
  const serviceIds = formData.getAll("serviceIds") as string[]
  const customServicesStr = formData.get("customServices") as string
  const customServices: { name: string, price: number }[] = customServicesStr ? JSON.parse(customServicesStr) : []
  
  const adjustedPricesStr = formData.get("adjustedPrices") as string
  const adjustedPrices: Record<string, number> = adjustedPricesStr ? JSON.parse(adjustedPricesStr) : {}
  
  const discount = parseFloat((formData.get("discount") as string) || "0")

  if (!customerName || !customerPhone || !licensePlate || (serviceIds.length === 0 && customServices.length === 0)) {
    throw new Error("Missing required fields")
  }

  // Fetch actual prices for security (never trust client input for prices)
  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } }
  })

  let totalPrice = services.reduce((acc, s) => {
    const finalPrice = adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price
    return acc + finalPrice
  }, 0)
  totalPrice += customServices.reduce((acc, s) => acc + s.price, 0)
  const netPrice = totalPrice - discount

  // Transaction to ensure atomicity
  await prisma.$transaction(async (tx) => {
    // 1. Find or create Customer
    let customer = await tx.customer.findUnique({
      where: { phone: customerPhone }
    })

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          lineId: lineId || null,
          email: email || null,
          address: address || null,
        }
      })
    } else {
        // Update customer details if they have changed or are being added
        await tx.customer.update({
            where: { id: customer.id },
            data: { 
              name: customerName,
              lineId: lineId || customer.lineId,
              email: email || customer.email,
              address: address || customer.address
            }
        })
    }

    // 2. Find or create Vehicle
    let vehicle = await tx.vehicle.findUnique({
      where: { licensePlate }
    })

    if (!vehicle) {
      vehicle = await tx.vehicle.create({
        data: {
          licensePlate,
          brand: brand || "Unknown",
          model: model || "Unknown",
          color: color || "Unknown",
          type: vehicleType || "S",
          currentMileage: currentMileage || null,
          chassisNo: chassisNo || null,
          customerId: customer.id
        }
      })
    } else {
      // Update vehicle details if provided
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: {
          brand: brand || vehicle.brand,
          model: model || vehicle.model,
          color: color || vehicle.color,
          type: vehicleType || vehicle.type,
          currentMileage: currentMileage || vehicle.currentMileage,
          chassisNo: chassisNo || vehicle.chassisNo,
        }
      })
    }

    // 3. Get next queue number for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const countToday = await tx.jobQueue.count({
      where: {
        date: { gte: today }
      }
    })
    
    const queueNumber = countToday + 1
    
    const appointmentAt = appointmentAtStr ? new Date(appointmentAtStr) : null;
    const warranty = formData.get("warranty") as string || null
    const warrantyEndStr = formData.get("warrantyEndText") as string
    let warrantyEnd = null;
    if (warrantyEndStr) {
      const parts = warrantyEndStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const yearAD = parseInt(parts[2], 10) - 543; // Convert พ.ศ. to ค.ศ.
        warrantyEnd = new Date(yearAD, month, day);
      }
    }

    // 4. Handle Custom Services
    const createdCustomServices = []
    for (const custom of customServices) {
      const newService = await tx.service.create({
        data: {
          name: custom.name,
          price: custom.price,
          category: "CUSTOM" // Mark as custom one-off service
        }
      })
      createdCustomServices.push(newService)
    }

    // Combine standard and custom services for Job creation
    const allJobServices = [
      ...services.map(s => ({ serviceId: s.id, priceAtTime: adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price })),
      ...createdCustomServices.map(s => ({ serviceId: s.id, priceAtTime: s.price }))
    ]

    const timeIn = timeInStr ? new Date(timeInStr) : new Date();

    // 5. Create JobQueue
    const job = await tx.jobQueue.create({
      data: {
        queueNumber,
        date: timeIn, // Use the same date as timeIn so they match
        timeIn,
        appointmentAt,
        status: "WAITING",
        notes,
        warranty,
        warrantyEnd,
        customerId: customer.id,
        vehicleId: vehicle.id,
        totalPrice,
        discount,
        netPrice,
        paymentMethod,
        isPromotion,
        services: {
          create: allJobServices
        }
      }
    })
  })

  revalidatePath("/admin")
  revalidatePath("/admin/queue")
  redirect("/admin")
}

export async function updateQueueJob(formData: FormData) {
  const jobId = formData.get("jobId") as string
  const status = formData.get("status") as string
  const paymentStatus = formData.get("paymentStatus") as string
  const amountPaid = parseFloat(formData.get("amountPaid") as string) || 0
  const staffId = formData.get("staffId") as string
  const warranty = formData.get("warranty") as string || null
  const warrantyEndStr = formData.get("warrantyEndText") as string
  const notes = formData.get("notes") as string || undefined

  if (!jobId) {
    throw new Error("Missing jobId")
  }

  let warrantyEnd = undefined;
  if (warrantyEndStr) {
    const parts = warrantyEndStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const yearAD = parseInt(parts[2], 10) - 543;
      warrantyEnd = new Date(yearAD, month, day);
    }
  } else if (formData.has("warrantyEndText")) {
    warrantyEnd = null;
  }

  const updateData: any = {
    status,
    paymentStatus,
    amountPaid,
  }

  if (staffId !== undefined) {
    updateData.staffId = staffId || null
  }
  if (warranty !== undefined) {
    updateData.warranty = warranty
  }
  if (warrantyEnd !== undefined) {
    updateData.warrantyEnd = warrantyEnd
  }
  if (notes !== undefined) {
    updateData.notes = notes
  }

  await prisma.jobQueue.update({
    where: { id: jobId },
    data: updateData
  })

  revalidatePath("/admin/queue")
  revalidatePath(`/admin/queue/${jobId}/receipt`)
  redirect("/admin/queue")
}

export async function fullUpdateQueueJob(formData: FormData) {
  const jobId = formData.get("jobId") as string
  if (!jobId) throw new Error("Missing jobId")

  const customerName = formData.get("customerName") as string
  const customerPhone = formData.get("customerPhone") as string
  const lineId = formData.get("lineId") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string
  
  const licensePlate = formData.get("licensePlate") as string
  const vehicleType = formData.get("vehicleType") as string || formData.get("type") as string
  const brand = formData.get("brand") as string
  const model = formData.get("model") as string
  const color = formData.get("color") as string
  const currentMileage = formData.get("currentMileage") as string
  const chassisNo = formData.get("chassisNo") as string
  const notes = formData.get("notes") as string
  const timeInStr = formData.get("timeIn") as string
  const appointmentAtStr = formData.get("appointmentAt") as string
  
  const status = formData.get("status") as string
  const paymentStatus = formData.get("paymentStatus") as string || "UNPAID"
  const amountPaid = parseFloat(formData.get("amountPaid") as string) || 0
  const paymentMethod = formData.get("paymentMethod") as string || null
  const staffId = formData.get("staffId") as string
  const isPromotion = formData.get("isPromotion") === "true"
  
  const serviceIds = formData.getAll("serviceIds") as string[]
  const customServicesStr = formData.get("customServices") as string
  const customServices: { name: string, price: number }[] = customServicesStr ? JSON.parse(customServicesStr) : []
  
  const adjustedPricesStr = formData.get("adjustedPrices") as string
  const adjustedPrices: Record<string, number> = adjustedPricesStr ? JSON.parse(adjustedPricesStr) : {}
  
  const discount = parseFloat((formData.get("discount") as string) || "0")

  if (!customerName || !customerPhone || !licensePlate || (serviceIds.length === 0 && customServices.length === 0)) {
    throw new Error("Missing required fields")
  }

  const services = await prisma.service.findMany({
    where: { id: { in: serviceIds } }
  })

  let totalPrice = services.reduce((acc, s) => {
    const finalPrice = adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price
    return acc + finalPrice
  }, 0)
  totalPrice += customServices.reduce((acc, s) => acc + s.price, 0)
  const netPrice = totalPrice - discount

  await prisma.$transaction(async (tx) => {
    // 1. Find or create Customer
    let customer = await tx.customer.findUnique({
      where: { phone: customerPhone }
    })

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          lineId: lineId || null,
          email: email || null,
          address: address || null,
        }
      })
    } else {
      await tx.customer.update({
        where: { id: customer.id },
        data: { 
          name: customerName,
          lineId: lineId || customer.lineId,
          email: email || customer.email,
          address: address || customer.address
        }
      })
    }

    // 2. Find or create Vehicle
    let vehicle = await tx.vehicle.findUnique({
      where: { licensePlate }
    })

    if (!vehicle) {
      vehicle = await tx.vehicle.create({
        data: {
          licensePlate,
          brand: brand || "Unknown",
          model: model || "Unknown",
          color: color || "Unknown",
          type: vehicleType || "S",
          currentMileage: currentMileage || null,
          chassisNo: chassisNo || null,
          customerId: customer.id
        }
      })
    } else {
      await tx.vehicle.update({
        where: { id: vehicle.id },
        data: {
          brand: brand || vehicle.brand,
          model: model || vehicle.model,
          color: color || vehicle.color,
          type: vehicleType || vehicle.type,
          currentMileage: currentMileage || vehicle.currentMileage,
          chassisNo: chassisNo || vehicle.chassisNo,
        }
      })
    }

    const appointmentAt = appointmentAtStr ? new Date(appointmentAtStr) : null;
    const warranty = formData.get("warranty") as string || null
    const warrantyEndStr = formData.get("warrantyEndText") as string
    let warrantyEnd = null;
    if (warrantyEndStr) {
      const parts = warrantyEndStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const yearAD = parseInt(parts[2], 10) - 543;
        warrantyEnd = new Date(yearAD, month, day);
      }
    } else if (formData.has("warrantyEndText") && formData.get("warrantyEndText") === "") {
        warrantyEnd = null;
    }

    // Handle Custom Services
    const createdCustomServices = []
    for (const custom of customServices) {
      const newService = await tx.service.create({
        data: {
          name: custom.name,
          price: custom.price,
          category: "CUSTOM"
        }
      })
      createdCustomServices.push(newService)
    }

    const allJobServices = [
      ...services.map(s => ({ serviceId: s.id, priceAtTime: adjustedPrices[s.id] !== undefined ? adjustedPrices[s.id] : s.price })),
      ...createdCustomServices.map(s => ({ serviceId: s.id, priceAtTime: s.price }))
    ]

    // Delete existing JobServices
    await tx.jobService.deleteMany({
      where: { jobId }
    })

    const timeIn = timeInStr ? new Date(timeInStr) : undefined;
    
    // Update JobQueue
    await tx.jobQueue.update({
      where: { id: jobId },
      data: {
        ...(timeIn ? { timeIn, date: timeIn } : {}),
        ...(status ? { status } : {}),
        appointmentAt,
        notes,
        warranty,
        warrantyEnd: warrantyEnd !== null ? warrantyEnd : null,
        customer: { connect: { id: customer.id } },
        vehicle: { connect: { id: vehicle.id } },
        totalPrice,
        discount,
        netPrice,
        paymentStatus,
        amountPaid,
        paymentMethod,
        staff: staffId ? { connect: { id: staffId } } : { disconnect: true },
        isPromotion,
        services: {
          create: allJobServices
        }
      }
    })
  })

  revalidatePath("/admin")
  revalidatePath("/admin/queue")
  revalidatePath(`/admin/queue/${jobId}/receipt`)
  redirect("/admin/queue")
}

export async function markAsPaid(jobId: string, method: string, amount: number) {
  await prisma.jobQueue.update({
    where: { id: jobId },
    data: {
      paymentStatus: "PAID",
      paymentMethod: method,
      amountPaid: amount
    }
  })
  
  revalidatePath("/admin/queue")
  revalidatePath("/admin")
}
