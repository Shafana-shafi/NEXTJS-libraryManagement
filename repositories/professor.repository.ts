// repositories/professor.repository.ts
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import chalk from "chalk";
import { professors } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import axios from "axios";

export const db = drizzle(sql, { schema: { professors } });

export interface Professor {
  id?: number;
  name: string;
  department: string;
  bio?: string;
  calendlyLink?: string;
}

// ... (keep other functions like createProfessor, updateProfessor, etc.)

export async function fetchAllProfessors() {
  try {
    const result = await db.select().from(professors).execute();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching professors:", error);
    return { success: false, message: "Error fetching professors.", data: [] };
  }
}

export async function fetchProfessorEventTypes(
  calendlyLink: string | undefined
) {
  if (!calendlyLink) {
    return [];
  }

  try {
    const response = await axios.get(
      "https://api.calendly.com/event_types/user/shifashafana14",
      {
        headers: {
          Authorization: `Bearer ${process.env.CALENDLY_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data.collection;
  } catch (error) {
    console.error("Failed to fetch event types:", error);
    return [];
  }
}

export async function fetchProfessorById(id: number) {
  try {
    const result = await db
      .select()
      .from(professors)
      .where(eq(professors.id, id));
    return result[0];
  } catch (error) {
    console.error("Error fetching professors:", error);
    throw error;
  }
}

const CALENDLY_API_URL = "https://api.calendly.com";
const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN; // Store your token securely

export async function getUserUri() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Prganizations", response);
    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.resource.current_organization; // This is the user's URI
  } catch (error) {
    console.error("Error fetching user URI", error);
    throw error;
  }
}

// Fetch scheduled events for the user
export async function fetchScheduledEvents(email: string) {
  const userUri = await getUserUri(); // Get the logged-in user's URI
  // const email = "shafanashahina57@gmail.com";
  try {
    const response = await fetch(
      `https://api.calendly.com/scheduled_events?organization=${userUri}&invitee_email=${email}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error fetching scheduled events:", errorText);
      throw new Error(`Error fetching Calendly events: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("----------------------------------------------------:", data);
    return data.collection; // Return an array of scheduled events
  } catch (error) {
    console.error("Error fetching scheduled events", error);
    throw error;
  }
}
