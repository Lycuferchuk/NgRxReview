import { EmptyStateType } from '../enums/empry-state.enum';
import { EmptyStateConfig } from '../models/empty-state.model';

export const EMPTY_STATE_MAP: Record<EmptyStateType, EmptyStateConfig> = {
  [EmptyStateType.EMPTY_CART]: {
    imageSrc: 'assets/images/empty-cart.png',
    altImage: 'Empty cart',
    text: 'Ваш кошик порожній',
  },
  [EmptyStateType.NO_DATA]: {
    imageSrc: 'assets/images/no-data.png',
    altImage: 'No data',
    text: 'Дані відсутні',
  },
  [EmptyStateType.NO_RESULTS]: {
    imageSrc: 'assets/images/no-data.png',
    altImage: 'No results',
    text: 'Нічого не знайдено',
  },
  [EmptyStateType.ERROR]: {
    imageSrc: 'assets/images/error.png',
    altImage: 'Error',
    text: 'Щось пішло не так',
  },
};
