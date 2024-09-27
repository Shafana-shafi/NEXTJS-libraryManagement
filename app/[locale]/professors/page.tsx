"use server";
import ProfessorCard from "@/allTables/professorCard";
import AddButton from "@/components/ui/books/addButton";
import Search from "@/components/ui/search";
import { authOptions } from "@/lib/authOptions";
import { fetchAllProfessors } from "@/repositories/professor.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { getServerSession } from "next-auth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getNow, getTimeZone } from "next-intl/server";

interface Invitation {
  email: string;
  status: string;
  // Include other relevant fields based on the API response
}

async function fetchCalendlyInvitations(): Promise<Invitation[] | null> {
  const url =
    "https://api.calendly.com/organizations/cf5a9284-80a4-4773-8e28-d3d0d50200c2/invitations";
  const token = process.env.CALENDLY_API_TOKEN;

  if (!token) {
    console.error("CALENDLY_API_TOKEN is not set in environment variables");
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Calendly invitations");
    }

    const data = await response.json();
    return data.collection; // Ensure this matches the Invitation type
  } catch (error) {
    console.error("Error fetching Calendly invitations:", error);
    return null;
  }
}

export default async function ProfessorsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const { data: professors } = await fetchAllProfessors();
  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  const now = await getNow();
  const timeZone = await getTimeZone();
  const messages = await getMessages();

  const invitations = await fetchCalendlyInvitations();

  const professorsWithStatus = professors.map((professor) => {
    const invitation = invitations?.find(
      (inv: Invitation) => inv.email === professor.email
    );
    return {
      ...professor,
      inviteStatus: invitation ? invitation.status : "not invited",
    };
  });

  return (
    <NextIntlClientProvider
      locale={locale}
      now={now}
      timeZone={timeZone}
      messages={messages}
    >
      <div className="flex h-screen flex-col bg-rose-50 text-rose-900">
        {/* Sticky NavBar */}
        <div className="sticky top-0 z-10">
          <NavBar />
        </div>
        <div className="flex flex-grow overflow-hidden">
          {/* Sticky SideNav */}
          <div className="sticky top-16 z-10">
            <SideNav />
          </div>
          <div className="relative flex flex-col flex-grow bg-rose-50 p-4">
            <div className="flex items-center justify-center gap-4 mb-3 align-middle">
              <Search placeholder="Search" />
              {role === "admin" && <AddButton buttonFor="add" />}
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {professorsWithStatus.map((professor) => (
                  <ProfessorCard
                    key={professor.id}
                    professor={professor}
                    invitations={invitations || []}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
