export interface iMemberBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  // dateOfBirth: string;
  // membershipStartDate: string;
  // membershipEndDate: string;
}

export interface iMember extends iMemberBase {
  id: number;
  membershipStatus: string;
}

export interface iMemberB extends iMemberBase {
  id: number;
  membershipStatus: string;
}

type userRole = {
  user: 4040;
};
type adminRole = {
  admin: 5050;
};
export interface RegisteredMemberInterface extends iMemberB {
  password: string | null;
  role: string;
}
