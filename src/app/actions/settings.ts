'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateSettings(formData: FormData) {
  const promptPayId = formData.get("promptPayId") as string
  const lineToken = formData.get("lineToken") as string
  const shopName = formData.get("shopName") as string
  const openTime = formData.get("openTime") as string || "08:00"
  const closeTime = formData.get("closeTime") as string || "20:00"

  // @ts-ignore - Setting model might not be typed yet due to lock
  await prisma.setting.upsert({
    where: { id: "global" },
    update: {
      promptPayId,
      lineToken,
      shopName,
      openTime,
      closeTime
    },
    create: {
      id: "global",
      promptPayId,
      lineToken,
      shopName,
      openTime,
      closeTime
    }
  })

  revalidatePath("/admin/settings")
  revalidatePath("/admin/queue")
}
