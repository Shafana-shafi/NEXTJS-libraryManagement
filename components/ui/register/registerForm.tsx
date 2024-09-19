"use client";

import { useState } from "react";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisteredMemberInterface } from "@/models/member.model";

interface RegisterFormProps {
  onSubmit: (data: RegisteredMemberInterface) => void;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisteredMemberInterface>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
    membershipStatus: "active",
    phoneNumber: null,
    address: null,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-lg border border-rose-100">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-rose-600 mb-2" />
            <CardTitle className="text-2xl font-bold text-rose-800">
              Create your account
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-rose-700">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-rose-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-rose-700">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-rose-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.password ?? ""}
                  onChange={handleChange}
                  className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-rose-600 hover:text-rose-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2"
            >
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-rose-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-rose-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
