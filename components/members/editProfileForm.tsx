"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save } from "lucide-react";
import { iMemberBase } from "@/models/member.model";
import { memberSchema } from "@/validations/validations";
import { handleUpdateMember } from "@/actions/addMemberActions";
import { useToast } from "@/components/ui/use-toast";
import { error } from "console";

export interface ProfileData {
  id: number;
  address: string | null;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
}

interface EditProfileFormProps {
  profile: ProfileData;
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<iMemberBase>({
    resolver: zodResolver(memberSchema),
    mode: "onChange",
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
    },
  });

  const onSubmit = async (data: iMemberBase) => {
    try {
      const result = await handleUpdateMember(data, profile.id);
      if (result && result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
          className: "bg-green-500",
        });
        setIsEditing(false);
        // Update the profile data here if necessary
      } else {
        if (result && result.error) {
          throw error;
        }
        toast({
          title: "Error",
          description: result?.error || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return isEditing ? (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} required />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} required />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" {...register("email")} type="email" required />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" {...register("phoneNumber")} />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} rows={3} />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsEditing(true)}
      className="mt-4"
    >
      <Pencil className="w-4 h-4 mr-2" />
      Edit Profile
    </Button>
  );
}
