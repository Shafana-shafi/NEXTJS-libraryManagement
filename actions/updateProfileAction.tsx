"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  updateMemberForProfile,
  updateMemberPassword,
} from "@/repositories/user.repository";

interface UpdateProfileData {
  phone?: string;
  address?: string;
  password?: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, message: "Not authenticated" };
  }

  const userId = session.user.id;

  try {
    // Prepare the update object
    const updateFields: Partial<UpdateProfileData> = {};

    if (data.phone && data.phone.trim() !== "") {
      updateFields.phone = data.phone;
    }
    if (data.address && data.address.trim() !== "") {
      updateFields.address = data.address;
    }

    // Update phone and address if present
    if (Object.keys(updateFields).length > 0) {
      const updatedMember = await updateMemberForProfile(
        Number(userId),
        updateFields
      );

      if (!updatedMember) {
        return { success: false, message: "Member not found" };
      }
    }

    // Update password if provided
    if (data.password && data.password.trim() !== "") {
      await updateMemberPassword(Number(userId), data.password);
    }

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}
