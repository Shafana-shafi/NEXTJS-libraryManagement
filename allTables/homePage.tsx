import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, Search, Users, Clock } from "lucide-react";
import { ReactNode } from "react";

export default function LandingPageClient() {
  const t = useTranslations("LandingPageClient");

  return (
    <div className="flex flex-col min-h-screen bg-rose-50 text-rose-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center justify-between border-b border-rose-200 bg-white shadow-sm">
        <Link className="flex items-center space-x-2 text-rose-800" href="/">
          <BookOpen className="h-8 w-8 text-rose-600" />
          <span className="ml-2 text-xl font-bold">{t("libraryName")}</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#features"
          >
            {t("features")}
          </Link>
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#about"
          >
            {t("about")}
          </Link>
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#contact"
          >
            {t("contact")}
          </Link>
        </nav>
        <Link href="/login">
          <Button
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {t("loginRegister")}
          </Button>
        </Link>
      </header>

      {/* Main Section */}
      <main className="flex-1">
        <section className="relative flex items-center justify-center py-24 lg:py-32 bg-gradient-to-b from-rose-100 to-rose-50">
          <div className="text-center space-y-8 px-4">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-rose-900">
              {t("welcome")}
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-rose-700">
              {t("description")}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {t("loginRegister")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-rose-800">
              {t("featuresTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Search className="h-10 w-10 text-rose-600" />}
                title={t("feature1Title")}
                description={t("feature1Description")}
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-rose-600" />}
                title={t("feature2Title")}
                description={t("feature2Description")}
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-rose-600" />}
                title={t("feature3Title")}
                description={t("feature3Description")}
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-rose-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-rose-800">
              {t("aboutTitle")}
            </h2>
            <p className="text-lg text-center max-w-3xl mx-auto text-rose-700">
              {t("aboutDescription")}
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-rose-800">
              {t("contactTitle")}
            </h2>
            <p className="text-lg text-center max-w-3xl mx-auto mb-8 text-rose-700">
              {t("contactDescription")}
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {t("contactButton")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-rose-800 py-8 px-4 md:px-6 text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">{t("libraryName")}</h3>
            <p className="text-sm text-rose-200">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 md:mt-0 text-sm">
            <Link
              className="hover:text-rose-300 transition-colors"
              href="/terms"
            >
              {t("termsOfService")}
            </Link>
            <Link
              className="hover:text-rose-300 transition-colors"
              href="/privacy"
            >
              {t("privacy")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-rose-50 p-6 rounded-lg shadow-md text-center">
      <div className="inline-block p-3 bg-rose-100 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-rose-800">{title}</h3>
      <p className="text-rose-600">{description}</p>
    </div>
  );
}
