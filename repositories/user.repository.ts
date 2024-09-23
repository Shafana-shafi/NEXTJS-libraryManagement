import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { books, members, transactions } from "@/db/schema";
import { eq, and, ilike, or, count } from "drizzle-orm";
import chalk from "chalk";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  iMember,
  iMemberB,
  iMemberBase,
  RegisteredMemberInterface,
} from "@/models/member.model";

import * as schema from "../db/schema";

export const db = drizzle(sql, { schema });

export async function completeProfile(formData: FormData) {
  const rawFormData = {
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
  };

  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      console.log("No email found in session");
      return { success: false, message: "No email found in session" };
    }

    const result = await db.transaction(async (transaction) => {
      const existingMembers = await transaction
        .select()
        .from(members)
        .where(eq(members.email, email))
        .limit(1);

      if (existingMembers.length > 0) {
        await transaction
          .update(members)
          .set({
            address: rawFormData.address as string,
            phoneNumber: rawFormData.phoneNumber as string,
          })
          .where(eq(members.email, email));
        return { success: true, message: "Profile updated successfully" };
      } else {
        console.log("No such user");
        return { success: false, message: "No such user" };
      }
    });

    return result;
  } catch (error) {
    console.error("Error updating profile", error);
    return { success: false, message: "Error updating profile" };
  }
}

export async function register(memberData: RegisteredMemberInterface) {
  try {
    // Check if a member with the same email already exists
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.email, memberData.email))
      .limit(1);

    console.log(members.email, memberData.email);
    if (existingMember.length > 0) {
      return {
        success: false,
        message:
          "A user with this email already exists. Please use a different email or log in.",
      };
    }

    // If no existing member, proceed with registration
    const password = memberData.password as string;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(members).values({
      ...memberData,
      password: hashedPassword,
      membershipStatus: "active",
      role: "user",
    });

    return { success: true, message: "Registration successful." };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }
}

export async function getUserByEmail(email: string) {
  try {
    const selectedMember = await db
      .select()
      .from(members)
      .where(eq(members.email, email));
    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by email:", error);
    throw error;
  }
}

export async function fetchFilteredTransactions(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * 10;
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      console.log("No email found in session");
      return { success: false, message: "No email found in session" };
    }

    const user = await getUserByEmail(email);
    const userId = user?.id;

    const transList = await db
      .select()
      .from(transactions)
      .where(eq(transactions.memberId, Number(userId)))
      .limit(10)
      .offset(offset);

    return transList;
  } catch (error) {
    console.error("Error fetching transactions", error);
    throw error;
  }
}

export async function checkUserRole(session: any) {
  if (!session || !session.user || !session.user.membershipStatus) {
    return null;
  }

  const email = session.user.email;
  const user = await getUserByEmail(email);

  return user?.role === "admin" ? "admin" : "user";
}

export async function hasProfileBeenUpdated(email: string) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email as string;

    const member = await db
      .select()
      .from(members)
      .where(eq(members.email, userEmail))
      .limit(1);

    return (
      member.length > 0 &&
      member[0].address !== null &&
      member[0].phoneNumber !== null
    );
  } catch (error) {
    console.error("Error checking profile update status", error);
    return false;
  }
}

export async function fetchPaginatedMembers(query: string): Promise<number> {
  try {
    const memberCountResult = await db
      .select({ count: count() })
      .from(members)
      .where(
        or(
          ilike(members.firstName, `%${query}%`),
          ilike(members.lastName, `%${query}%`),
          ilike(members.email, `%${query}%`)
        )
      );

    const memberCount = memberCountResult[0]?.count || 0;
    const totalMembers = Number(memberCount);

    if (isNaN(totalMembers)) {
      console.error("Invalid member count:", memberCount);
      return 0;
    }

    return Math.ceil(totalMembers / 5);
  } catch (error) {
    console.error("Database Error:", error);
    return 0;
  }
}

export async function fetchFilteredMembers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 6;
  try {
    const filteredMembers = await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.role, "user"),
          or(
            ilike(members.firstName, `%${query}%`),
            ilike(members.lastName, `%${query}%`),
            ilike(members.email, `%${query}%`)
          )
        )
      )
      .limit(6)
      .offset(offset);

    return filteredMembers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Members.");
  }
}

export async function deleteMember(id: number): Promise<iMemberB | undefined> {
  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (existingMembers.length > 0) {
      await db.delete(members).where(eq(members.id, id));

      console.log(chalk.green("Member deleted successfully"));
      return existingMembers[0] as iMemberB;
    } else {
      console.log(chalk.red("Member ID not found, verify the ID entered"));
      return undefined;
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
}

export async function createUser(member: RegisteredMemberInterface) {
  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.email, member.email))
      .limit(1);

    if (existingMembers.length > 0) {
      console.log(chalk.red("MEMBER ALREADY EXISTS"));
      return;
    } else {
      const hashedPassword = await bcrypt.hash(member.password!, 10);
      const insertedMember = await db
        .insert(members)
        .values({
          ...member,
          password: hashedPassword,
          membershipStatus: "active",
          role: "user",
        })
        .returning();

      console.log(chalk.green("Member Registered successfully\n"));
      return insertedMember[0];
    }
  } catch (error) {
    console.error("Error Adding a Member", error);
  }
}

export async function getUserByName(firstName: string, lastName: string) {
  try {
    const selectedMember = await db
      .select()
      .from(members)
      .where(
        and(eq(members.firstName, firstName), eq(members.lastName, lastName))
      )
      .limit(1);

    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by name:", error);
    throw error;
  }
}

export async function getUserById(id: number) {
  try {
    const selectedMember = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by ID:", error);
    throw error;
  }
}

export async function updateMember(id: number, data: iMemberBase) {
  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (existingMembers.length === 0) {
      console.log("---NO MEMBER FOUND---");
      return null;
    }

    const existingMember = existingMembers[0];
    const updatedMember = { ...existingMember, ...data };

    await db.update(members).set(updatedMember).where(eq(members.id, id));

    console.log("---MEMBER UPDATED SUCCESSFULLY---");
    return updatedMember;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

interface updateProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export async function updateMemberForProfile(id: number, data: updateProfile) {
  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (existingMembers.length === 0) {
      console.log("---NO MEMBER FOUND---");
      return null;
    }

    const existingMember = existingMembers[0];
    const updatedMember = { ...existingMember, ...data };

    await db.update(members).set(updatedMember).where(eq(members.id, id));

    console.log("---MEMBER UPDATED SUCCESSFULLY---");
    return updatedMember;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}
