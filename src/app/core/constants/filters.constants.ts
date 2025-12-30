import { CheckboxConfig } from '../models/filter.model';

export const CATEGORY_LABELS: Record<string, string> = {
  phone: 'Телефони',
  laptop: 'Ноутбуки',
  headphones: 'Навушники',
  tablet: 'Планшети',
  mouse: 'Мишки',
};

export const RATING_LABELS: Record<number, string> = {
  5: '⭐⭐⭐⭐⭐',
  4: '⭐⭐⭐⭐',
  3: '⭐⭐⭐',
  2: '⭐⭐',
  1: '⭐',
};

export const BASE_CATEGORY_CONFIG: CheckboxConfig = {
  label: 'Категорія',
  type: 'radio',
  options: [{ value: 'all', label: 'Всі товари' }],
};

export const BASE_IN_STOCK_CONFIG: CheckboxConfig = {
  label: 'Тільки в наявності',
  type: 'boolean',
};

export const BASE_RATING_CONFIG: CheckboxConfig = {
  label: 'Рейтинг',
  type: 'radio',
  options: [],
};
