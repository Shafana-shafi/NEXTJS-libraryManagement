"use server";
import ProfessorCard from "@/allTables/professorCard";
import { fetchAllProfessors } from "@/repositories/professor.repository";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";

export default async function ProfessorsPage() {
  const { data: professors } = await fetchAllProfessors();

  return (
    <div className="flex h-screen flex-col bg-rose-50 text-rose-900">
      <NavBar />
      <div className="flex flex-grow overflow-hidden">
        <SideNav />
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {professors.map((professor) => (
              <ProfessorCard key={professor.id} professor={professor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
