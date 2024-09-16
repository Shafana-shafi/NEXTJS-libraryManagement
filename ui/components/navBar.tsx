import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import NavBarClient from "./navBarClient";

export default async function NavBar() {
  const session = await getServerSession(authOptions);
  const userImage = session?.user?.image || "/default-avatar.svg";

  return <NavBarClient userImage={userImage} />;
}
