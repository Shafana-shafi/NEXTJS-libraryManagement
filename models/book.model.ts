export interface iBookBase {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  pages: number;
  totalCopies: number;
}
export interface iBook extends iBookBase {
  id: number;
  availableCopies: number;
  price: number;
}

export interface iBookB extends iBookBase {
  id: number;
  availableCopies: number;
  price: number;
}
