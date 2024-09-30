"use server";

import {
  insertTransactionDetails,
  TransactionDetails,
} from "@/repositories/professor.repository";

export async function storeTransactionDetails(details: TransactionDetails) {
  try {
    const result = await insertTransactionDetails(details);
    if (result.success) {
      return {
        success: true,
        message: "Transaction details stored successfully.",
      };
    } else {
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error("Error in storeTransactionDetails action:", error);
    return { success: false, message: "Failed to store transaction details" };
  }
}
