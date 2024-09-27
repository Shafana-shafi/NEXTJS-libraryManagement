"use server";

import { fetchProfessorById } from "@/repositories/professor.repository";
import ProfessorScheduleClient from "@/allTables/professorSchedule";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";

interface Professor {
  id: number;
  name: string;
  department: string;
  bio: string | null;
  calendlyLink: string | null;
  userName: string | null;
  userEmail: string | null;
}

export default async function ProfessorSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const professorId = parseInt(params.id, 10); // Parse ID from the dynamic route
  const professor = await fetchProfessorById(professorId); // Fetch professor by ID
  const session = await getServerSession(authOptions);
  const userName = session?.user.name || "";
  const userEmail = session?.user?.email || "";
  const newProfessor = { ...professor, userName, userEmail };

  if (!professor) {
    return <div>Professor not found</div>; // Handle case where professor is not found
  }

  // Pass professor data to the client component
  return (
    <div className="flex h-screen flex-col bg-rose-50">
      {/* Sticky NavBar */}
      <div className="sticky top-0 z-10">
        <NavBar />
      </div>
      <div className="flex flex-grow overflow-hidden">
        {/* Sticky SideNav */}
        <div className="sticky top-16 z-10">
          <SideNav />
        </div>
        <div className="flex-1 flex items-center justify-center align-middle h-full">
          <ProfessorScheduleClient professor={newProfessor} />
        </div>
      </div>
    </div>
  );
}
