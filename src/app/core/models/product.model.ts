export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  type: string;
  imageUrl: string;
  stock: number;
  publishDate?: string;
  category?: string;
  discount?: string;
  discountPrice?: string;
  features?: string[];
  rating?: string;
}
