class ProductHistory {
  user: string;
  date: string;
  type: string;

  constructor(user: string, date: string, type: string) {
    this.user = user;
    this.date = date;
    this.type = type;
  }
}

export interface Product {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  history: Array<ProductHistory>;
}
