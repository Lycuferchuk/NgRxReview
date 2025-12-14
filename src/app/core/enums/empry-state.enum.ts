import { EmptyStateConfig } from '../models/empty-state-config.model';

export enum EmptyStateType {
  EMPTY_CART = 'empty-cart',
  NO_DATA = 'no-data',
}

export const EMPTY_STATE_MAP: Record<string, EmptyStateConfig> = {
  'empty-cart': {
    imageSrc: 'assets/images/empty-cart.png',
    altImage: 'Empty cart',
    text: 'Ваш кошик порожній',
  },
  'no-data': {
    imageSrc: 'assets/images/no-data.png',
    altImage: 'No data',
    text: 'Дані відсутні',
  },
};
