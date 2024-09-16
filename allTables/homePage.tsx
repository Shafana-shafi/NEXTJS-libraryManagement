import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn } from "lucide-react";

export default function LandingPageClient() {
  const t = useTranslations("LandingPageClient");

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-700">
        <Link className="flex items-center space-x-2 text-white" href="/">
          <BookOpen className="h-6 w-6 text-gray-300" />
          <span className="ml-2 text-lg font-semibold">{t("libraryName")}</span>
        </Link>
        <nav className="flex gap-6">
          <Link
            className="text-sm font-medium text-gray-400 hover:text-gray-200"
            href="#features"
          >
            {t("features")}
          </Link>
          <Link
            className="text-sm font-medium text-gray-400 hover:text-gray-200"
            href="#about"
          >
            {t("about")}
          </Link>
          <Link
            className="text-sm font-medium text-gray-400 hover:text-gray-200"
            href="#contact"
          >
            {t("contact")}
          </Link>
        </nav>
      </header>

      {/* Main Section */}
      <main className="flex-1">
        <section className="relative flex items-center justify-center py-24 lg:py-32 bg-black">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-white">
              {t("welcome")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400">
              {t("description")}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/login">
                <Button
                  variant="solid"
                  size="lg"
                  className="bg-gray-800 hover:bg-gray-600"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {t("loginRegister")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 px-4 md:px-6 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
          <p className="text-xs text-gray-400">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <nav className="flex space-x-4 mt-4 sm:mt-0 text-sm text-gray-400">
            <Link className="hover:text-white" href="/terms">
              {t("termsOfService")}
            </Link>
            <Link className="hover:text-white" href="/privacy">
              {t("privacy")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
