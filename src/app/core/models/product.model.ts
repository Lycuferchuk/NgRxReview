// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string; // phone / pc / earbuds
//   imageUrl: string;
//   brand: string;
//   stock: number;
//   publishDate: string;
//   discount?: string;
//   discountPrice?: number;
//   rating?: number | null;
//   // filterAttributes: Record<string, string | boolean | string[]>;
// }

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'phones' | 'laptops' | 'headphones' | 'all';
  imageUrl: string;
  brand: string;
  stock: number;
  publishDate: string;
  discount?: number;
  discountPrice?: number;
  rating?: number | null;

  attributes?: ProductAttributes;
}

export interface ProductAttributes {
  // Для телефонів
  screenSize?: string; // "6.1", "6.7"
  battery?: number; // 4500 mAh
  camera?: string[]; // ["48MP", "12MP"]

  // Для ноутбуків
  ram?: string; // "16GB", "32GB"
  processor?: string; // "Intel i7", "AMD Ryzen 7"
  gpu?: string; // "RTX 4060", "Integrated"
  storage?: string; // "512GB SSD", "1TB HDD"
  displaySize?: string; // "15.6", "14"

  // Для навушників
  type?: string; // "over-ear", "in-ear", "on-ear"
  noiseCancelling?: boolean;
  wireless?: boolean;

  // Загальні
  color?: string;
  weight?: number;
  [key: string]: any; // Для додаткових атрибутів
}
