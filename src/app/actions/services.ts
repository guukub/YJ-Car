'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createService(formData: FormData) {
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const price = parseFloat(formData.get("price") as string)
  const description = formData.get("description") as string

  await prisma.service.create({
    data: { name, category, price, description }
  })

  revalidatePath("/admin/services")
  redirect("/admin/services")
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id }
  })
  revalidatePath("/admin/services")
}

export async function updateService(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const price = parseFloat(formData.get("price") as string)
  const description = formData.get("description") as string

  if (!id) throw new Error("Missing ID")

  await prisma.service.update({
    where: { id },
    data: { name, category, price, description }
  })

  revalidatePath("/admin/services")
  redirect("/admin/services")
}
