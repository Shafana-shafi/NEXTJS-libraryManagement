"use server";

import { authOptions } from "@/lib/authOptions";
import { checkPaymentStatus } from "@/repositories/professor.repository";
import { getServerSession } from "next-auth";

export async function checkProfessorPaymentStatus(professorId: number) {
  const session = await getServerSession(authOptions);
  const memberId = session?.user.id;
  try {
    const status = await checkPaymentStatus(professorId, Number(memberId));
    return { success: true, status };
  } catch (error) {
    console.error("Error checking payment status:", error);
    return { success: false, error: "Failed to check payment status" };
  }
}
