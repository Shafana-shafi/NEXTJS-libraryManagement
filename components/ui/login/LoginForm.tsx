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
import { Separator } from "@radix-ui/react-separator";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    const role = async () => {
      if (sessionStatus === "authenticated") {
        const user = await getUserByEmail(session.user?.email as string);
        if (user === undefined) {
          return;
        } else {
          if (user?.role === "user") {
            router.replace("/userBooks");
          }
          if (user?.role === "admin") {
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
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
    } else {
      setError("");
      toast.success("Successful login");
      router.replace("/userBooks");
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex min-h-screen items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-gray-900 text-white border border-gray-700 shadow-lg">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-400">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-800 text-white border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-400">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="bg-gray-800 text-white border-gray-600 "
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 "
              >
                Sign in
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p className="text-gray-400">
                Dont have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-gray-300 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </CardContent>
          <CardFooter className="space-y-4 pt-4">
            <Separator className="bg-gray-600" />
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="text-black hover:text-white bg-white hover:bg-gray-700 border border-gray-300"
                onClick={() => signIn("google")}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="text-black hover:text-white bg-white hover:bg-gray-700 border border-gray-300"
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
                Sign in with GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  );
}