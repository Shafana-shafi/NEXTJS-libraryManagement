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
}

export default async function ProfessorSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const professor = await fetchProfessorById(parseInt(params.id, 10));
  const session = await getServerSession(authOptions);
  const userName = session?.user.name || "";
  const userEmail = session?.user?.email || "";
  const newProfessor = { ...professor, userName, userEmail };
  if (!professor) {
    return <div>Professor not found</div>;
  }

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
