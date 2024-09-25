// File: app/[locale]/profile/page.tsx
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
      <div className="flex h-screen flex-col bg-rose-50">
        <NavBar />
        <div className="flex">
          <SideNav />
          <main>
            <ProfileForm
              user={session.user}
              completeUserInfo={completeUserInfo}
            />
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
