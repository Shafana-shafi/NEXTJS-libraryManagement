"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";
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
  onSubmit: (
    data: RegisteredMemberInterface
  ) => Promise<{ success: boolean; message: string } | void>;
  translations: {
    createAccount: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
    register: string;
    alreadyHaveAccount: string;
    signIn: string;
    showPassword: string;
    hidePassword: string;
    firstNameRequired: string;
    lastNameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordLength: string;
    registrationSuccess: string;
    registrationError: string;
  };
}

export default function RegisterForm({
  onSubmit,
  translations,
}: RegisterFormProps) {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (value.trim().length < 2) {
          error =
            name === "firstName"
              ? translations.firstNameRequired
              : translations.lastNameRequired;
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = translations.emailInvalid;
        }
        break;
      case "password":
        if (value.length < 8) {
          error = translations.passwordLength;
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && touched[key]) {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      const result = await onSubmit(formData);
      if (result && !result.success) {
        setServerError(result.message);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-lg border border-rose-100">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center">
            <BookOpen className="h-12 w-12 text-rose-600 mb-2" />
            <CardTitle className="text-2xl font-bold text-rose-800">
              {translations.createAccount}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-rose-700">
                {translations.firstName}
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder={translations.firstName}
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`border-rose-200 focus:border-rose-400 focus:ring-rose-400 ${
                  errors.firstName && touched.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-rose-700">
                {translations.lastName}
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder={translations.lastName}
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`border-rose-200 focus:border-rose-400 focus:ring-rose-400 ${
                  errors.lastName && touched.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
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
                placeholder={translations.emailAddress}
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`border-rose-200 focus:border-rose-400 focus:ring-rose-400 ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-rose-700">
                {translations.password}
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
                  onBlur={handleBlur}
                  className={`border-rose-200 focus:border-rose-400 focus:ring-rose-400 ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
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
              {errors.password && touched.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {serverError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2"
              disabled={Object.keys(errors).length > 0}
            >
              {translations.register}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-rose-600">
            {translations.alreadyHaveAccount}{" "}
            <Link
              href="/login"
              className="font-medium text-rose-800 hover:underline"
            >
              {translations.signIn}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
