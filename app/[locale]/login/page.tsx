"use server";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/actions";
import LoginForm from "@/components/ui/login/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    if (session.user?.role === "user") {
      redirect("/userBooks");
    }
    if (session.user?.role === "admin") {
      redirect("/adminBooks");
    }
  }

  return <LoginForm />;
}
