export interface iRequestBase {
  bookId: number;
  memberId: number;
  requestDate: Date;
  issuedDate: Date | null;
  returnDate: Date | null;
  status: string;
}

export interface iRequest extends iRequestBase {
  id: number;
}
