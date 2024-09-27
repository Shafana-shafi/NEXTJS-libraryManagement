import AddMemberForm from "@/components/members/addMemberForm";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";

export default function AddMemberPage() {
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
        <div className="flex flex-col w-full p-4 justify-center">
          <AddMemberForm />
        </div>
      </div>
    </div>
  );
}
