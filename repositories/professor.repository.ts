import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import chalk from "chalk";
import { payments, professors } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import axios from "axios";

export const db = drizzle(sql, { schema: { professors, payments } });

export interface Professor {
  id?: number;
  name: string;
  department: string;
  email: string;
  bio?: string;
  calendlyLink?: string;
}

// Function to create a new professor
export async function createProfessor(professor: Professor) {
  try {
    const result = await db.insert(professors).values(professor).execute();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating professor:", error);
    return { success: false, message: "Error creating professor." };
  }
}

// Function to fetch all professors
export async function fetchAllProfessors() {
  try {
    const result = await db.select().from(professors).execute();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching professors:", error);
    return { success: false, message: "Error fetching professors.", data: [] };
  }
}

// Function to fetch event types for a professor
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

// Function to fetch a professor by ID
export async function fetchProfessorById(id: number) {
  try {
    const result = await db
      .select()
      .from(professors)
      .where(eq(professors.id, id))
      .execute();
    return result[0];
  } catch (error) {
    console.error("Error fetching professor:", error);
    throw error;
  }
}

// Function to get user URI for Calendly
const CALENDLY_API_URL = "https://api.calendly.com";
const CALENDLY_API_TOKEN = process.env.CALENDLY_API_TOKEN;

export async function getUserUri() {
  try {
    const response = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Organizations", response);
    if (!response.ok) {
      throw new Error(`Error fetching user info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.resource.current_organization;
  } catch (error) {
    console.error("Error fetching user URI", error);
    throw error;
  }
}

// Function to fetch scheduled events for the user
export async function fetchScheduledEvents(email: string) {
  const userUri = await getUserUri();

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
    return data.collection;
  } catch (error) {
    console.error("Error fetching scheduled events", error);
    throw error;
  }
}

// New function to update the Calendly link for a professor
export async function updateProfessorCalendlyLink(
  professorId: number,
  calendlyLink: string
) {
  try {
    console.log("calendly link", calendlyLink);
    const result = await db
      .update(professors)
      .set({ calendlyLink })
      .where(eq(professors.id, professorId))
      .execute();
    console.log("hiii 2");
    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Professor not found or no update was necessary.",
      };
    }
    console.log("hiii 1");
    return { success: true, message: "Calendly link updated successfully." };
  } catch (error) {
    console.error("Error updating professor's Calendly link:", error);
    return {
      success: false,
      message: "Error updating professor's Calendly link.",
    };
  }
}

export interface TransactionDetails {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  professorId: number;
  amount: number;
  currency: string;
}

// New function to insert transaction details
export async function insertTransactionDetails(details: TransactionDetails) {
  try {
    const result = await db
      .insert(payments)
      .values({
        razorpayPaymentId: details.razorpayPaymentId,
        razorpayOrderId: details.razorpayOrderId,
        razorpaySignature: details.razorpaySignature,
        professorId: details.professorId,
        amount: details.amount,
        currency: details.currency,
        createdAt: new Date(),
      })
      .execute();

    return { success: true, data: result };
  } catch (error) {
    console.error("Error inserting transaction details:", error);
    return { success: false, message: "Error inserting transaction details." };
  }
}
