import prisma from "./prisma"

export async function sendLineNotify(message: string) {
  try {
    // @ts-ignore
    const settings = await prisma.setting.findUnique({ where: { id: "global" } })
    const token = settings?.lineToken

    if (!token) {
      console.log("Line Notify token not configured, skipping notification.")
      return false
    }

    const response = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`
      },
      body: new URLSearchParams({
        message
      })
    })

    if (!response.ok) {
      console.error("Failed to send Line Notify:", await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Line Notify Error:", error)
    return false
  }
}
