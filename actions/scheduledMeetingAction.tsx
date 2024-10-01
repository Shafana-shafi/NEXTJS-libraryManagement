"use server";

import { revalidatePath } from "next/cache";
import { insertScheduledMeeting } from "@/repositories/professor.repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function createScheduledMeeting(
  eventDetails: {
    startTime: string;
    endTime: string;
    inviteeName: string;
    inviteeEmail: string;
    eventType: string;
    eventTypeUuid: string;
    eventUuid: string;
  },
  professorId: number
) {
  try {
    console.log("Event details:", eventDetails);
    console.log("Professor ID:", professorId);

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const result = await insertScheduledMeeting({
      userId: Number(userId),
      professorId: professorId,
      meetingDate: new Date(eventDetails.startTime),
      // endTime: new Date(eventDetails.endTime),
      status: "scheduled",
      // inviteeName: eventDetails.inviteeName,
      // inviteeEmail: eventDetails.inviteeEmail,
      // eventType: eventDetails.eventType,
      // eventTypeUuid: eventDetails.eventTypeUuid,
      calendlyEventId: eventDetails.eventUuid,
      paymentId: "N/A", // You might want to update this if you have payment information
    });

    if (result.success) {
      revalidatePath("/meetings");
      return { success: true, message: "Meeting scheduled successfully" };
    } else {
      throw new Error(result.message || "Failed to insert scheduled meeting");
    }
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to schedule meeting",
    };
  }
}
