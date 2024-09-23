import { useTranslations } from "next-intl";
import LandingPageClient from "@/allTables/homePage";
import { useLocale } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("LandingPageClient");
  const locale = useLocale();

  const translations = {
    libraryName: t("libraryName"),
    features: t("features"),
    about: t("about"),
    contact: t("contact"),
    loginRegister: t("loginRegister"),
    welcome: t("welcome"),
    description: t("description"),
    termsOfService: t("termsOfService"),
    privacy: t("privacy"),
    copyright: t("copyright", { year: new Date().getFullYear() }),
    changeLanguage: t("changeLanguage"),
    english: t("english"),
    kannada: t("kannada"),
  };

  return <LandingPageClient translations={translations} locale={locale} />;
}

// import { NextIntlClientProvider } from "next-intl";
// import { getTranslations } from "next-intl/server";
// import LandingPageClient from "@/allTables/homePage";

// export default async function LandingPage() {
//   const messages = await getTranslations("LandingPageClient");

//   return (
//     <NextIntlClientProvider messages={messages}>
//       <LandingPageClient />
//     </NextIntlClientProvider>
//   );
//}
