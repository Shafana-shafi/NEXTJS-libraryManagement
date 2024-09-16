export interface iTransactionBase {
  bookId: number;
  memberId: number;
}

export interface iTransaction extends iTransactionBase {
  borrowDate: string;
  returnDate: string | null;
  dueDate: string;
}
