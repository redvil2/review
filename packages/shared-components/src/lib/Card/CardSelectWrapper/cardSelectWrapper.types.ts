import { ReactNode } from 'react';

export interface CardSelectWrapperPropTypes<T> {
  children: (
    selectedCard: T | null,
    handleSelectCard: (cardId: T | null) => void,
    prevSelectedCard: T | null,
  ) => ReactNode;
  defaultSelected?: T | null;
}
