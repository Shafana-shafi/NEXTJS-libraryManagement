"use server";

import { updateProfessorCalendlyLink } from "@/repositories/professor.repository";

export async function updateProfessorCalendlyLinkAction(
  professorId: number,
  calendlyLink: string
) {
  try {
    const result = await updateProfessorCalendlyLink(professorId, calendlyLink);
    return result;
  } catch (error) {
    console.error("Error in updateProfessorCalendlyLinkAction:", error);
    return { success: false, message: "Failed to update Calendly link" };
  }
}
