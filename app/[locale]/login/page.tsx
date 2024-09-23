import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getUserByEmail } from "@/lib/actions";
import LoginForm from "@/components/ui/login/LoginForm";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const session = await getServerSession();
  const t = await getTranslations("LoginForm");

  if (session) {
    if (session.user?.role === "user") {
      redirect("/userBooks");
    }
    if (session.user?.role === "admin") {
      redirect("/adminBooks");
    }
  }

  const translations = {
    signInToAccount: t("signInToAccount"),
    enterEmailToLogin: t("enterEmailToLogin"),
    emailAddress: t("emailAddress"),
    password: t("password"),
    signIn: t("signIn"),
    dontHaveAccount: t("dontHaveAccount"),
    registerHere: t("registerHere"),
    signInWithGoogle: t("signInWithGoogle"),
    signInWithGitHub: t("signInWithGitHub"),
    invalidEmail: t("invalidEmail"),
    invalidPassword: t("invalidPassword"),
    invalidCredentials: t("invalidCredentials"),
    successfulLogin: t("successfulLogin"),
    loading: t("loading"),
  };

  return <LoginForm translations={translations} />;
}
