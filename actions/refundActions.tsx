"use server";

import {
  getRefundablePayments,
  initiateRefund,
} from "@/repositories/professor.repository";
import { revalidatePath } from "next/cache";

export async function fetchRefundablePayments(userId: number) {
  try {
    const payments = await getRefundablePayments(userId);
    return { success: true, payments };
  } catch (error) {
    console.error("Error fetching refundable payments:", error);
    return { success: false, error: "Failed to fetch refundable payments" };
  }
}

export async function processRefund(paymentId: string, amount: number) {
  try {
    const refund = await initiateRazorpayRefund(paymentId, amount);

    // If refund is successful, update the database
    if (refund.success) {
      await initiateRefund(paymentId);
      revalidatePath("/refunds");
      return { success: true, message: "Refund processed successfully" };
    } else {
      throw new Error("new error");
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    return { success: false, error: "Failed to process refund" };
  }
}

async function initiateRazorpayRefund(paymentId: string, amount: number) {
  try {
    const url = `https://api.razorpay.com/v1/payments/${paymentId}/refund`;
    const auth = Buffer.from(
      process.env.RAZORPAY_KEY_ID + ":" + process.env.RAZORPAY_KEY_SECRET
    ).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({ amount: amount }), // Razorpay expects amount in paise
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Razorpay API Error:", errorData);
      throw new Error(`Razorpay API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Razorpay Refund Response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error initiating Razorpay refund:", error);
    return {
      success: false,
      error: error || "Failed to initiate refund with Razorpay",
    };
  }
}
