"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { updateMemberForProfile } from "@/repositories/user.repository";

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export async function updateProfile(data: UpdateProfileData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, message: "Not authenticated" };
  }

  const userId = session.user.id;

  try {
    const updatedMember = await updateMemberForProfile(Number(userId), {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
    });

    if (!updatedMember) {
      return { success: false, message: "Member not found" };
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedMember,
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}
