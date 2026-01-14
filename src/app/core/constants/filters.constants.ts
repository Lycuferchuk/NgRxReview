import { FilterUIConfig } from '../models/filter.model';

export const CATEGORY_CONFIG: FilterUIConfig = {
  label: 'Категорія',
  type: 'radio',
  options: [
    { value: 'all', label: 'Всі товари' },
    { value: 'smartphone', label: 'Телефони' },
    { value: 'laptop', label: 'Ноутбуки' },
    { value: 'headphones', label: 'Навушники' },
    { value: 'tablet', label: 'Планшети' },
    { value: 'mouse', label: 'Мишки' },
  ],
};

export const RATING_CONFIG: FilterUIConfig = {
  label: 'Рейтинг',
  type: 'radio',
  options: [
    { value: 5, label: '5 зірок і вище' },
    { value: 4, label: '4 зірки і вище' },
    { value: 3, label: '3 зірки і вище' },
    { value: 2, label: '2 зірки і вище' },
    { value: 1, label: '1 зірка і вище' },
  ],
};

export const IN_STOCK_CONFIG: FilterUIConfig = {
  label: 'Тільки в наявності',
  type: 'boolean',
};
