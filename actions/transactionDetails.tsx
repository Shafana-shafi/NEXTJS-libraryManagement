"use server";

import { authOptions } from "@/lib/authOptions";
import { insertTransactionDetails } from "@/repositories/professor.repository";
import { getServerSession } from "next-auth";

export interface TransactionDetails {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  professorId: number;
  amount: number;
  currency: string;
}

export async function storeTransactionDetails(details: TransactionDetails) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.error("No session or user found");
      return { success: false, message: "User not authenticated" };
    }

    const memberId = session.user.id;

    if (!memberId) {
      console.error("User ID is missing from the session");
      return { success: false, message: "User ID not found" };
    }

    const id = Number(memberId);

    if (isNaN(id)) {
      console.error("Invalid user ID:", memberId);
      return { success: false, message: "Invalid user ID" };
    }

    const result = await insertTransactionDetails({ ...details, id });

    if (result.success) {
      return {
        success: true,
        message: "Transaction details stored successfully.",
      };
    } else {
      console.error("Failed to insert transaction details:", result.message);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Error in storeTransactionDetails action:", error);
    return { success: false, message: "Failed to store transaction details" };
  }
}
