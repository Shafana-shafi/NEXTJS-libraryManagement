import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/ui/register/registerForm";
import { register } from "@/repositories/user.repository";
import { RegisteredMemberInterface } from "@/models/member.model";
import { useState } from "react";

export default async function RegisterPage() {
  async function handleRegister(data: RegisteredMemberInterface) {
    "use server";

    // Validate form data
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      if (!data.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!data.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!data.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(data.email))
        newErrors.email = "Email is invalid";
      if (!data.password) newErrors.password = "Password is required";
      else if (data.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      return newErrors;
    };

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    let redirectPath;
    try {
      const result = await register(data);
      redirectPath = "/login";
      console.log("thank you");
    } catch (error) {
      redirectPath = `/`;
    } finally {
      if (redirectPath) redirect(redirectPath);
    }
  }

  const session = await getServerSession();
  if (session) {
    redirect("/userBooks");
  }

  return <RegisterForm onSubmit={handleRegister} />;
}
