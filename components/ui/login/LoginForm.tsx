"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { getUserByEmail } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/ui/components/separator";

interface Translations {
  signInToAccount: string;
  enterEmailToLogin: string;
  emailAddress: string;
  password: string;
  signIn: string;
  dontHaveAccount: string;
  registerHere: string;
  signInWithGoogle: string;
  signInWithGitHub: string;
  invalidEmail: string;
  invalidPassword: string;
  invalidCredentials: string;
  successfulLogin: string;
  loading: string;
}

export default function LoginForm({
  translations,
}: {
  translations: Translations;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const role = async () => {
      if (sessionStatus === "authenticated") {
        const userRole = session.user.role;
        if (userRole === undefined) {
          return;
        } else {
          if (userRole === "user") {
            router.replace("/userBooks");
          }
          if (userRole === "admin") {
            router.replace("/adminBooks");
          }
        }
      }
    };

    role();
  }, [sessionStatus, router, session]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    if (!isValidEmail(email)) {
      setError(translations.invalidEmail);
      toast.error(translations.invalidEmail);
      return;
    }

    if (!password || password.length < 8) {
      setError(translations.invalidPassword);
      toast.error(translations.invalidPassword);
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(translations.invalidCredentials);
      toast.error(translations.invalidCredentials);
    } else {
      setError("");
      toast.success(translations.successfulLogin);
      router.replace("/userBooks");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-rose-50 text-rose-800">
        {translations.loading}
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen items-center justify-center bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-rose-800">
              {translations.signInToAccount}
            </CardTitle>
            <CardDescription className="text-center text-rose-600">
              {translations.enterEmailToLogin}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-rose-700">
                  {translations.emailAddress}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-rose-700">
                  {translations.password}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                {translations.signIn}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p className="text-rose-600">
                {translations.dontHaveAccount}{" "}
                <Link
                  href="/register"
                  className="font-medium text-rose-800 hover:underline"
                >
                  {translations.registerHere}
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Separator className="bg-rose-200" />
            <div className="flex flex-col w-full space-y-2">
              <Button
                variant="outline"
                className="w-full text-rose-700 hover:text-rose-800 border-rose-300 hover:bg-rose-50"
                onClick={() => signIn("google")}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                {translations.signInWithGoogle}
              </Button>
              <Button
                variant="outline"
                className="w-full text-rose-700 hover:text-rose-800 border-rose-300 hover:bg-rose-50"
                onClick={() => signIn("github")}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.156-1.109-1.465-1.109-1.465-.907-.622.068-.609.068-.609 1.002.071 1.53 1.035 1.53 1.035.892 1.534 2.341 1.091 2.91.834.091-.648.349-1.092.636-1.343-2.22-.255-4.555-1.113-4.555-4.951 0-1.093.389-1.987 1.029-2.688-.103-.256-.446-1.283.097-2.674 0 0 .84-.27 2.75 1.026A9.573 9.573 0 0 1 10 5.84c.853.004 1.71.115 2.51.338 1.91-1.296 2.75-1.026 2.75-1.026.543 1.391.2 2.418.098 2.674.641.701 1.028 1.595 1.028 2.688 0 3.846-2.338 4.692-4.566 4.943.36.311.679.924.679 1.861 0 1.343-.012 2.426-.012 2.757 0 .269.18.579.688.481C17.135 18.195 20 14.44 20 10.017 20 4.484 15.523 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {translations.signInWithGitHub}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  );
}
