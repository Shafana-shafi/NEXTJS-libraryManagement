"use server";

export async function fetchSchedulingUrl(userUrl: string) {
  try {
    const response = await fetch(userUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDLY_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    return userData.resource.scheduling_url;
  } catch (error) {
    console.error("Error fetching scheduling URL:", error);
    throw error;
  }
}
