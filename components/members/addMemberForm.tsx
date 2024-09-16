"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { handleAddMember } from "@/actions/addMemberActions";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const memberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable(),
  role: z.enum(["user", "admin"]),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function AddMemberForm() {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: MemberFormData) => {
    const result = await handleAddMember({
      ...data,
      id: 0,
      membershipStatus: "active",
    });
    if (result && !result.success) {
      if (result.errors) {
        throw errors;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "An error occurred",
        });
      }
    }
    if (result?.success) {
      toast({
        title: "Success",
        description: "Member added successfully",
        className: "bg-green-500",
      });
    }
  };

  const handleBlur = async (fieldName: keyof MemberFormData) => {
    await trigger(fieldName);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <Link href="/adminBooks/members" passHref>
          <Button variant="outline" size="sm" className="flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Member</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                aria-invalid={!!errors.firstName}
                aria-describedby="firstName-error"
                onBlur={() => handleBlur("firstName")}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                aria-invalid={!!errors.lastName}
                aria-describedby="lastName-error"
                onBlur={() => handleBlur("lastName")}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
                onBlur={() => handleBlur("email")}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                aria-invalid={!!errors.phoneNumber}
                aria-describedby="phoneNumber-error"
                onBlur={() => handleBlur("phoneNumber")}
              />
              {errors.phoneNumber && (
                <p id="phoneNumber-error" className="text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                aria-invalid={!!errors.address}
                aria-describedby="address-error"
                onBlur={() => handleBlur("address")}
              />
              {errors.address && (
                <p id="address-error" className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
                onBlur={() => handleBlur("password")}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) =>
                  setValue("role", value as "user" | "admin")
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p id="role-error" className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
