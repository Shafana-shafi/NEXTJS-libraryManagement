"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { professorSchema } from "@/validations/validations"; // Assuming you have a schema for professor
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { handleAddProfessor } from "@/actions/addProfessorActions";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

type iProfessor = z.infer<typeof professorSchema>;

interface AddProfessorFormProps {
  translations: {
    addNewProfessor: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    addProfessor: string;
    adding: string;
    error: string;
    success: string;
    addProfessorError: string;
    professorAddedSuccess: string;
  };
}

export default function AddProfessorForm({
  translations,
}: AddProfessorFormProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<iProfessor>({
    resolver: zodResolver(professorSchema),
    mode: "onChange",
  });
  const { toast } = useToast();

  const onSubmit = async (data: iProfessor) => {
    setLoading(true);
    try {
      const result = await handleAddProfessor(data);

      if (result && !result.success) {
        if (result.errors) {
          setServerErrors(result.errors);
        } else {
          toast({
            title: translations.error,
            description: translations.addProfessorError,
            variant: "destructive",
            duration: 1000,
          });
        }
      }

      if (result?.success) {
        toast({
          title: translations.success,
          description: translations.professorAddedSuccess,
          className: "bg-green-500",
          duration: 1000,
        });
      }
    } catch (error) {
      toast({
        title: translations.error,
        description: translations.addProfessorError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async (fieldName: keyof iProfessor) => {
    await trigger(fieldName);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-rose-50 border-rose-200">
      <CardHeader className="bg-rose-100">
        <CardTitle className="text-rose-800">
          {translations.addNewProfessor}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-rose-700">
                {translations.firstName}
              </Label>
              <Input
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby="firstName-error"
                onBlur={() => handleBlur("name")}
                onChange={(e) => setValue("name", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.name && (
                <p id="firstName-error" className="text-rose-600 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-rose-700">
                {translations.email}
              </Label>
              <Input
                id="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                onBlur={() => handleBlur("email")}
                onChange={(e) => setValue("email", e.target.value)}
                className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
              />
              {errors.email && (
                <p id="email-error" className="text-rose-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="department" className="text-rose-700">
              {translations.department}
            </Label>
            <Input
              id="department"
              {...register("department")}
              aria-invalid={!!errors.department}
              aria-describedby="department-error"
              onBlur={() => handleBlur("department")}
              onChange={(e) => setValue("department", e.target.value)}
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            {errors.department && (
              <p id="department-error" className="text-rose-600 text-sm">
                {errors.department.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="bio" className="text-rose-700">
              Bio
            </Label>
            <Input
              id="bio"
              {...register("bio")}
              aria-invalid={!!errors.bio}
              aria-describedby="bio-error"
              onBlur={() => handleBlur("bio")}
              onChange={(e) => setValue("bio", e.target.value)}
              className="border-rose-200 focus:border-rose-400 focus:ring-rose-400"
            />
            {errors.bio && (
              <p id="bio-error" className="text-rose-600 text-sm">
                {errors.bio.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-rose-100 flex justify-center align-middle pt-6">
          <Button
            type="submit"
            disabled={loading || isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {loading ? translations.adding : translations.addProfessor}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
