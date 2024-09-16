import LandingPageClient from "@/allTables/homePage";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  // We're not using this `t` function directly in this component,
  // // but we're keeping it to demonstrate how to use server-side translations if needed
  // unstable_setRequestLocale(locale);

  const t = useTranslations("IndexPage");

  return <LandingPageClient />;
}
