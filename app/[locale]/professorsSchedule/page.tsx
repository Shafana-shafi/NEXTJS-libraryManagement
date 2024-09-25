// app/professors/[id]/page.tsx
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
      <NavBar />
      <div className="flex">
        <SideNav />
        <ProfessorScheduleClient professor={newProfessor} />
      </div>
    </div>
  );
}