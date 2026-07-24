'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCustomerManually(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const licensePlate = formData.get("licensePlate") as string
  const brand = formData.get("brand") as string
  const model = formData.get("model") as string
  const color = formData.get("color") as string

  if (!name || !phone) {
    throw new Error("Name and Phone are required")
  }

  // Find or create customer
  const customer = await prisma.customer.upsert({
    where: { phone },
    update: { name },
    create: { name, phone }
  })

  // Add vehicle if provided
  if (licensePlate && brand) {
    await prisma.vehicle.upsert({
      where: { licensePlate },
      update: { customerId: customer.id, brand, model: model || "", color: color || "", type: "Other" },
      create: { licensePlate, customerId: customer.id, brand, model: model || "", color: color || "", type: "Other" }
    })
  }

  revalidatePath("/admin/customers")
  redirect("/admin/customers")
}

export async function clearCustomerBalance(customerId: string) {
  const allJobs = await prisma.jobQueue.findMany({
    where: {
      customerId
    }
  });

  const jobsToUpdate = allJobs.filter(job => 
    job.paymentStatus !== "PAID" || (job.amountPaid || 0) < job.netPrice
  );

  // Use transaction to update all jobs
  const updates = jobsToUpdate.map(job => 
    prisma.jobQueue.update({
      where: { id: job.id },
      data: {
        paymentStatus: "PAID",
        amountPaid: job.netPrice
      }
    })
  );

  if (updates.length > 0) {
    await prisma.$transaction(updates);
  }

  revalidatePath("/admin/customers");
}
