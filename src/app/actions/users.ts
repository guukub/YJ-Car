"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string

  if (!name || !email || !password || !role) {
    throw new Error("Missing required fields")
  }

  // Check if email exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("Email already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role
    }
  })

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function deleteUser(id: string) {
  if (!id) throw new Error("Missing user id")

  // Optional: Prevent deleting the last OWNER or currently logged in user
  // This would require checking the session, but for now we do a simple delete.
  
  // Count owners to prevent deleting the last owner
  const user = await prisma.user.findUnique({ where: { id } })
  if (user?.role === "OWNER") {
    const ownerCount = await prisma.user.count({ where: { role: "OWNER" } })
    if (ownerCount <= 1) {
      throw new Error("Cannot delete the last OWNER account")
    }
  }

  await prisma.user.delete({
    where: { id }
  })

  revalidatePath("/admin/users")
}
