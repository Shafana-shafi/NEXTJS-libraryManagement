import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import ProfileForm from "@/allTables/profileForm";
import NavBar from "@/ui/components/navBar";
import SideNav from "@/ui/components/sidenav";
import { getUserByEmail } from "@/repositories/user.repository";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function ProfilePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const completeUserInfo = await getUserByEmail(session?.user.email || "");
  if (!session || !session.user) {
    redirect("/login");
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col h-screen bg-rose-50">
        <NavBar />
        <div className="flex flex-1 overflow-hidden">
          <SideNav />
          <main className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center h-full p-4">
              <ProfileForm
                user={session.user}
                completeUserInfo={completeUserInfo}
              />
            </div>
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
