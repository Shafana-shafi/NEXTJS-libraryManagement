"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, Globe } from "lucide-react";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Translations {
  libraryName: string;
  features: string;
  about: string;
  contact: string;
  loginRegister: string;
  welcome: string;
  description: string;
  termsOfService: string;
  privacy: string;
  copyright: string;
  changeLanguage: string;
  english: string;
  kannada: string;
}

export default function LandingPageClient({
  translations,
  locale,
}: {
  translations: Translations;
  locale: string;
}) {
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    router.push("/", { locale: newLocale });
  };

  return (
    <div className="flex flex-col min-h-screen bg-rose-50 text-rose-900">
      {/* Header */}
      <header className="px-4 lg:px-6 py-3 h-20 flex items-center justify-between border-b border-rose-200 bg-white shadow-sm mb-5">
        <Link className="flex items-center space-x-2 text-rose-800" href="/">
          <BookOpen className="h-8 w-8 text-rose-600" />
          <span className="ml-2 text-xl font-bold">
            {translations.libraryName}
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#features"
          >
            {translations.features}
          </Link>
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#about"
          >
            {translations.about}
          </Link>
          <Link
            className="text-sm font-medium text-rose-600 hover:text-rose-800 transition-colors"
            href="#contact"
          >
            {translations.contact}
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                Language
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("kn")}>
                ಕನ್ನಡ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/login">
            <Button
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {translations.loginRegister}
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex justify-center items-center flex-grow">
        <section className="relative flex items-center justify-center py-24 lg:py-32 bg-gradient-to-b from-rose-100 to-rose-50">
          <div className="text-center space-y-8 px-4">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-rose-900">
              {translations.welcome}
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-rose-700 p-5">
              {translations.description}
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {translations.loginRegister}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-rose-800 py-8 px-4 md:px-6 text-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">
              {translations.libraryName}
            </h3>
            <p className="text-sm text-white">{translations.copyright}</p>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 md:mt-0 text-sm">
            <Link className="hover:text-white transition-colors" href="/terms">
              {translations.termsOfService}
            </Link>
            <Link
              className="hover:text-white transition-colors"
              href="/privacy"
            >
              {translations.privacy}
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
