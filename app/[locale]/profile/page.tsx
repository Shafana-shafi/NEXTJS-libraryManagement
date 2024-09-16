import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from "lucide-react";
import { getProfile } from "@/actions/addMemberActions";
import EditProfileForm from "@/components/members/editProfileForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";

// Fetch session and profile data
const session = await getServerSession(authOptions);
const memberid = Number(session?.user.id);

async function fetchProfileData(id: number) {
  "use server";
  return await getProfile(id);
}

export default async function MemberProfile() {
  const result = await fetchProfileData(memberid);
  const profile = result.result;

  return (
    <div className="flex h-screen flex-col align-middle">
      {/* Horizontal NavBar */}
      <NavBar />

      <div className="flex flex-grow">
        {/* Vertical SideNav */}
        <SideNav />

        {/* Main Content Area */}
        <div className="w-full flex justify-center align-middle items-center min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl mx-auto shadow-xl border border-gray-300 rounded-lg">
            <div className="bg-gray-100 text-black rounded-t-lg text-center p-6">
              <h1 className="text-3xl font-bold">Member Profile</h1>
            </div>

            <div className="mt-6 p-6">
              <div className="flex flex-col sm:flex-row items-center mb-8">
                <Avatar className="w-32 h-32 border-4 border-gray-300 shadow-lg">
                  <AvatarImage
                    src="/placeholder.svg?height=128&width=128"
                    alt={`${profile?.firstName} ${profile?.lastName}`}
                  />
                  <AvatarFallback className="text-3xl font-bold text-black">
                    {profile?.firstName[0]}
                    {profile?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-gray-500">{profile?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Phone Number</h4>
                      <p className="text-sm text-gray-500">
                        {profile?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Address</h4>
                      <p className="text-sm text-gray-500">
                        {profile?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <EditProfileForm profile={profile!} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
