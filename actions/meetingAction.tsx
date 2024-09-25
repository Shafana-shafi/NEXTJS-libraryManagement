// app/meetings/actions.ts
"use server";

import { revalidatePath } from "next/cache";

export async function createMeeting() {
  try {
    // Step 1: Fetch available event types
    const eventTypeResponse = await fetch(
      "https://api.calendly.com/event_types/user/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.CALENDLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // if (!eventTypeResponse.ok) {
    //   throw new Error("Failed to fetch event types.");
    // }

    const eventTypesData = await eventTypeResponse.json();
    const eventTypeId = eventTypesData.collection[0]?.uri;

    if (!eventTypeId) {
      throw new Error("No event type available to create a meeting.");
    }

    // Step 2: Use the fetched event type ID to create a new meeting
    const response = await fetch(
      "https://calendly.com/users/38366143/event_types/new/solo?return_to=%2Fevent_types%2Fnew",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CALENDLY_API_TOKEN}`,
        },
        body: JSON.stringify({
          event_type: eventTypeId,
          start_time: new Date().toISOString(),
          invitees: [{ email: "shifashafana14@gmail.com" }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create meeting.");
    }

    const data = await response.json();
    revalidatePath("/meetings");
    return { success: true, data };
  } catch (error: any) {
    console.error("Request failed", error);
    return { success: false, error: error.message };
  }
}
