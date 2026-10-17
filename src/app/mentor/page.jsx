import { getSessionUser } from "@/lib/auth-utils"
import { getUserSubscription } from "@/lib/subscriptions"
import { redirect } from "next/navigation"
import MentorClient from "./MentorClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "AI Mentor | WebDev Mentor AI",
  description: "Interactive AI coding companion and full-stack engineering mentor."
}

export default async function MentorPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { hasActiveSubscription } = await getUserSubscription(user.id);
  if (!hasActiveSubscription) {
    redirect("/pricing?feature=mentor");
  }

  return <MentorClient />;
}
