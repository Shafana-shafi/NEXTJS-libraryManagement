"use server";

import { redirect } from "next/navigation";
import { createProfessor } from "@/repositories/professor.repository";
import { Professor } from "@/repositories/professor.repository"; // Import the Professor type

async function inviteToCalendly(email: string) {
  const url =
    "https://api.calendly.com/organizations/cf5a9284-80a4-4773-8e28-d3d0d50200c2/invitations";
  const token = process.env.CALENDLY_API_TOKEN;

  if (!token) {
    console.error("CALENDLY_API_TOKEN is not set in environment variables");
    return false;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to invite to Calendly:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error inviting to Calendly:", error);
    return false;
  }
}

export async function handleAddProfessor(data: Professor) {
  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.department.trim())
      newErrors.department = "Department is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    if (data.bio && data.bio.length < 10) {
      newErrors.bio = "Bio must be at least 10 characters if provided";
    }
    if (data.calendlyLink && !/^https?:\/\/.+/.test(data.calendlyLink)) {
      newErrors.calendlyLink = "Calendly link must be a valid URL";
    }
    return newErrors;
  };

  const newErrors = validateForm();
  if (Object.keys(newErrors).length > 0) {
    return { success: false, errors: newErrors };
  }

  const result = await createProfessor(data);
  if (result.success) {
    // Invite the professor to Calendly
    const inviteResult = await inviteToCalendly(data.email);
    if (!inviteResult) {
      console.warn(
        `Professor created successfully, but Calendly invitation failed for email: ${data.email}`
      );
    }
    redirect("/professors"); // Adjust redirect path as needed
  } else {
    return {
      success: false,
      message: result.message || "Failed to add Professor. Please try again.",
    };
  }
}
