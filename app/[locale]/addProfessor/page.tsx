import AddProfessorForm from "@/allTables/addProfessorForm";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { getTranslations } from "next-intl/server";

export default async function AddProfessorPage() {
  const t = await getTranslations("AddProfessorForm");

  // Translation mappings for the form
  const translations = {
    addNewProfessor: t("addNewProfessor"),
    firstName: t("firstName"),
    lastName: t("lastName"),
    email: t("email"),
    department: t("department"),
    phoneNumber: t("phoneNumber"),
    addProfessor: t("addProfessor"),
    adding: t("adding"),
    error: t("error"),
    success: t("success"),
    addProfessorError: t("addProfessorError"),
    professorAddedSuccess: t("professorAddedSuccess"),
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Make NavBar sticky */}
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      <div className="flex flex-grow">
        {/* Make SideNav sticky */}
        <div className="sticky top-0 h-screen">
          <SideNav />
        </div>
        <div className="flex flex-col w-full p-4 justify-center align-middle">
          <AddProfessorForm translations={translations} />
        </div>
      </div>
    </div>
  );
}
