"use server";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/actions";
import LoginForm from "@/components/ui/login/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    const user = await getUserByEmail(session.user?.email as string);
    if (user?.role === "user") {
      redirect("/userBooks");
    }
    if (user?.role === "admin") {
      redirect("/adminBooks");
    }
  }

  return <LoginForm />;
}
