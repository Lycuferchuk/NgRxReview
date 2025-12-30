export type Categories = 'phone' | 'laptop' | 'headphones' | 'tablet' | 'mouse';

export type ProductAttributeValue = string | number | boolean | undefined;

export interface Product<T extends ProductAttributes = ProductAttributes> {
  id: string;
  name: string;
  category: Categories;
  brand: string;
  price: string;
  rating: string;
  inStock: boolean;
  imageUrl: string;
  description?: string;
  attributes: T;
}

export type ProductAttributes = Record<string, ProductAttributeValue>;

export interface PhoneAttributes extends ProductAttributes {
  screenSize: string;
  screenType: string;
  storage: string;
  camera: string;
  batteryCapacity: string;
  processor: string;
  ram: string;
  has5G: boolean;
  refreshRate: string;
}

export interface LaptopAttributes extends ProductAttributes {
  processor: string;
  ram: string;
  storage: string;
  screenSize: string;
  screenType: string;
  gpu: string;
  weight: string;
  batteryLife: string;
  refreshRate: string;
}

export interface HeadphonesAttributes extends ProductAttributes {
  type: string;
  wireless: boolean;
  noiseCancelling: boolean;
  microphone: boolean;
  waterResistant?: string;
  driverSize?: string;
  impedance?: string;
  batteryLife?: string;
}

export interface TabletAttributes extends ProductAttributes {
  screenSize: string;
  screenType: string;
  storage: string;
  processor: string;
  ram: string;
  cellularSupport: boolean;
  pencilSupport: boolean;
  keyboardSupport: boolean;
  batteryLife: string;
  refreshRate: string;
}

export interface MouseAttributes extends ProductAttributes {
  type: string;
  wireless: boolean;
  dpi: string;
  buttons: string;
  sensor: string;
  batteryLife?: string;
  weight: string;
  rgb: boolean;
  programmableButtons: boolean;
}

export type AllProductAttributes =
  | PhoneAttributes
  | LaptopAttributes
  | HeadphonesAttributes
  | TabletAttributes
  | MouseAttributes;
