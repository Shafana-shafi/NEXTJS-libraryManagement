import { useState } from "react";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/ui/register/registerForm";
import { register } from "@/repositories/user.repository";
import { RegisteredMemberInterface } from "@/models/member.model";
import { getTranslations } from "next-intl/server";

export default async function RegisterPage() {
  const t = await getTranslations("RegisterForm");

  const translations = {
    createAccount: t("createAccount"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    emailAddress: t("emailAddress"),
    password: t("password"),
    register: t("register"),
    alreadyHaveAccount: t("alreadyHaveAccount"),
    signIn: t("signIn"),
    showPassword: t("showPassword"),
    hidePassword: t("hidePassword"),
    firstNameRequired: t("firstNameRequired"),
    lastNameRequired: t("lastNameRequired"),
    emailRequired: t("emailRequired"),
    emailInvalid: t("emailInvalid"),
    passwordRequired: t("passwordRequired"),
    passwordLength: t("passwordLength"),
    registrationSuccess: t("registrationSuccess"),
    registrationError: t("registrationError"),
  };

  async function handleRegister(data: RegisteredMemberInterface) {
    "use server";

    const result = await register(data);
    if (result.success) {
      redirect("/login");
    } else {
      return {
        success: false,
        message: result.message || "Registration failed. Please try again.",
      };
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6 text-rose-800">
        {translations.createAccount}
      </h1>
      <RegisterForm onSubmit={handleRegister} translations={translations} />
    </div>
  );
}
