"use server";

import mysql2 from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { books, members, transactions } from "@/db/schema";
import { eq, and, like, or, count } from "drizzle-orm";
import chalk from "chalk";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  iMember,
  iMemberB,
  iMemberBase,
  RegisteredMemberInterface,
} from "@/models/member.model";

const poolConnection = mysql2.createPool({
  uri: process.env.DATABASE_URL,
});
const db = drizzle(poolConnection);

export async function completeProfile(formData: FormData) {
  const rawFormData = {
    address: formData.get("address"),
    phoneNumber: formData.get("phoneNumber"),
  };

  try {
    // Get the session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    // Ensure email is defined and not null
    if (!email) {
      console.log("No email found in session");
      return { success: false, message: "No email found in session" };
    }

    // Perform the transaction
    await db.transaction(async (transaction) => {
      // Check for existing members
      const existingMembers = await transaction
        .select()
        .from(members)
        .where(eq(members.email, email))
        .limit(10);

      // Update or handle missing user
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
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile", error);
    return { success: false, message: "Error updating profile" };
  }
}

export async function register(memberData: RegisteredMemberInterface) {
  try {
    // Check if user already exists
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.email, memberData.email))
      .execute();

    if (existingMembers.length > 0) {
      return { success: false, message: "User already exists. Please log in." };
    }
    const password = memberData.password as string;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db
      .insert(members)
      .values({ ...memberData, password: hashedPassword })
      .execute();

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
      .where(eq(members.email, email))
      .execute();
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
    // Get the session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    // Ensure email is defined and not null
    // if (!email) {
    //   console.log("No email found in session");
    //   return { success: false, message: "No email found in session" };
    // }

    const user = await getUserByEmail(email!);
    const userId = user?.id as number;
    // Perform the transaction
    const transList = await db.transaction(async (transaction) => {
      // Check for existing members
      const transactionList = await transaction
        .select()
        .from(transactions)
        .where(eq(transactions.memberId, userId))
        .limit(10)
        .offset(offset);
      return transactionList;
    });
    return transList;
  } catch (error) {
    console.error("Error updating profile", error);
    throw error;
  }
}

async function checkUserRole(session: any) {
  if (!session || !session.user || !session.user.membershipStatus) {
    return null; // Return null if the user is not a basic member
  }

  const email = session.user.email;
  const user = await getUserByEmail(email);

  if (user?.role === "admin") return "admin";
  else return "user";
}

export { checkUserRole };

export async function hasProfileBeenUpdated(email: string) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    const email = session?.user?.email as string;

    // Perform the transaction
    const transList = await db.transaction(async (transaction) => {
      // Check for existing members
      const member = await transaction
        .select()
        .from(members)
        .where(eq(members.email, email));
      if (member[0].address !== null && member[0].phoneNumber !== null)
        return true;
      else return false;
    });
    return transList;
  } catch (error) {
    console.error("Error updating profile", error);
  }
}
export async function fetchPaginatedMembers(query: string): Promise<number> {
  try {
    const totalPages = await db.transaction(async (transaction) => {
      // Count the total number of books matching the query
      const memberCountResult = await transaction
        .select({ count: count() })
        .from(members)
        .where(
          or(
            like(members.firstName, `%${query}%`),
            like(members.lastName, `%${query}%`),
            like(members.email, `%${query}%`)
          )
        );

      // Extract count from the result
      const memberCount = memberCountResult[0]?.count || 0;
      const totalBooks = Number(memberCount);

      if (isNaN(totalBooks)) {
        console.error("Invalid book count:", memberCount);
        return 0;
      }

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalBooks / 5);

      return totalPages;
    });

    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Ensure that a valid number is returned in case of an error
  }
}

export async function fetchFilteredMembers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * 6;
  try {
    // Perform the transaction
    const allMembers = await db.transaction(async (transaction) => {
      // Check for existing members
      const filtereedMembers = await transaction
        .select()
        .from(members)
        .where(
          and(
            eq(members.role, "user"),
            or(
              like(members.firstName, `%${query}%`),
              like(members.lastName, `%${query}%`),
              like(members.email, `%${query}%`)
            )
          )
        )
        .limit(6)
        .offset(offset);
      return filtereedMembers;
    });
    return allMembers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Members.");
  }
}

export async function deleteMember(id: number): Promise<iMemberB | undefined> {
  try {
    const result = await db.transaction(async (transaction) => {
      const existingMembers = await transaction
        .select()
        .from(members)
        .where(eq(members.id, id))
        .limit(10);

      if (existingMembers && existingMembers.length > 0) {
        const deletedMember = await transaction
          .delete(members)
          .where(eq(members.id, id))
          .execute();

        console.log(chalk.green("Member deleted successfully"));
        return deletedMember;
      } else {
        console.log(
          chalk.red("Member email ID not found, verify the email ID entered")
        );
        return undefined;
      }
    });
    return;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
}

export async function createUser(member: RegisteredMemberInterface) {
  try {
    const result = await db.transaction(async (transaction) => {
      const existingMembers = await transaction
        .select()
        .from(members)
        .where(
          and(
            member.password
              ? eq(members.password, member.password)
              : eq(members.password, ""),
            eq(members.email, member.email)
          )
        )
        .limit(10);
      if (existingMembers && existingMembers.length > 0) {
        console.log(chalk.red("MEMBER ALREADY EXISTS"));
        return;
      } else {
        const updatedMember: RegisteredMemberInterface = {
          ...member,
          id: 0, // Assuming the database will autogenerate the ID.
          membershipStatus: "active",
        };
        const hashedPassword = await bcrypt.hash(member.password!, 10);
        await transaction
          .insert(members)
          .values({ ...updatedMember, password: hashedPassword });
        console.log(chalk.green("Member Registered successfully\n"));
        return updatedMember;
      }
    });
    return result;
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
      .execute();
    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by email:", error);
    throw error;
  }
}

export async function getUserById(id: number) {
  try {
    const selectedMember = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .execute();
    return selectedMember.length > 0 ? selectedMember[0] : undefined;
  } catch (error) {
    console.error("Error retrieving member by email:", error);
    throw error;
  }
}

export async function updateMember(id: number, data: iMemberBase) {
  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .execute();
    console.log(id, "id");
    if (!existingMembers || existingMembers.length === 0) {
      console.log("---NO BOOKS FOUND---");
      return null;
    }
    const existingBook = existingMembers[0];

    const updatedMember = {
      ...existingBook,
      ...data,
    };

    await db
      .update(members)
      .set(updatedMember)
      .where(eq(members.id, id))
      .execute();

    console.log("---BOOK UPDATED SUCCESSFULLY---");
    return { ...existingBook, ...updatedMember };
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}
