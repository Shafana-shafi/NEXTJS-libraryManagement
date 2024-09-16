"use server";

import {
  createUser,
  getUserById,
  updateMember,
} from "@/repositories/user.repository";
import { iMemberBase, RegisteredMemberInterface } from "@/models/member.model";
import { z } from "zod";

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

export async function handleAddMember(data: RegisteredMemberInterface) {
  const validationResult = memberSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await createUser(data);
    if (result) {
      return { success: true, message: "Member added successfully" };
    } else {
      return { success: false, error: "Failed to add member" };
    }
  } catch (error) {
    console.error("Failed to add member:", error);
    return { success: false, error: "Failed to add member" };
  }
}

export async function getProfile(id: number) {
  try {
    const result = await getUserById(id);
    if (result) {
      return { success: true, message: "Member added successfully", result };
    } else {
      return { success: false, error: "Failed to add member" };
    }
  } catch (error) {
    console.error("Failed to add member:", error);
    return { success: false, error: "Failed to add member" };
  }
}

export async function handleUpdateMember(data: iMemberBase, id: number) {
  try {
    const result = await updateMember(id, data);
    if (result) {
      return { success: true, message: "Profile data updated successfully" };
    }
  } catch (error) {
    console.error("Failed to update profile Data:", error);
    return { success: false, error: "Failed to add book" };
  }
}
