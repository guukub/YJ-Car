'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createExpense(formData: FormData) {
  const category = formData.get("category") as string
  const amount = parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string

  if (!category || isNaN(amount) || !dateStr) {
    throw new Error("Missing required fields")
  }

  await prisma.expense.create({
    data: {
      category,
      amount,
      description,
      date: new Date(dateStr)
    }
  })

  revalidatePath("/admin")
  revalidatePath("/admin/records/finance")
}
