import {
  fetchFilteredMembers,
  deleteMember,
} from "@/repositories/user.repository";
import { revalidatePath } from "next/cache";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserIcon } from "lucide-react";
import { DeleteMemberButton } from "./deleteMemberButton";

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export default async function MembersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const members = await fetchFilteredMembers(query, currentPage);

  if (members.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No members found.</p>;
  }

  async function handleDeleteMember(memberId: number) {
    "use server";
    await deleteMember(memberId);
    revalidatePath("/adminBooks/members");
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden border border-rose-200">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-rose-100">
              <TableHead className="text-rose-800">Name</TableHead>
              <TableHead className="text-rose-800">Email</TableHead>
              <TableHead className="text-rose-800">Phone Number</TableHead>
              <TableHead className="text-rose-800">Address</TableHead>
              <TableHead className="text-rose-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5 text-rose-400" />
                    <span className="font-medium">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  <DeleteMemberButton
                    memberId={member.id}
                    onDelete={handleDeleteMember}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
