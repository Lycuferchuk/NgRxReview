export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  type: string;
  imageUrl: string;
  features?: string[];
  stock: number;
  rating?: number;
}
