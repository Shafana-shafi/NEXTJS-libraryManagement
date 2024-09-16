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
    id: 0,
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
    <div className="flex min-h-screen items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-gray-900 text-white border border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center">
            <CardTitle className="text-2xl font-bold">
              Create your account
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-400">
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
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-400">
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
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>
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
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-800 text-white border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-400">
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
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-800 text-white border-gray-600"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-gray-400"
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
              className="w-full bg-gray-700 hover:bg-gray-600 py-3"
            >
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-300 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
