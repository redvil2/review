import { Flex } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';

import { CardSelectWrapperPropTypes } from './cardSelectWrapper.types';

export const CardSelectWrapper = <T,>({
  children,
  defaultSelected,
}: CardSelectWrapperPropTypes<T>) => {
  const [selectedCard, setSelectedCard] = useState<T | null>(
    defaultSelected || null,
  );
  const [prevSelectedCard, setPrevSelectedCard] = useState<T | null>(null);

  useEffect(() => {
    setSelectedCard(defaultSelected || null);
  }, [defaultSelected]);

  const handleSelectCard = useCallback(
    (cardId: T | null) => {
      if (selectedCard === cardId) {
        setSelectedCard(null);
      } else {
        setSelectedCard(cardId);
        setPrevSelectedCard(cardId);
      }
    },
    [selectedCard],
  );

  return (
    <Flex direction={'column'} width={'100%'}>
      {children(selectedCard, handleSelectCard, prevSelectedCard)}
    </Flex>
  );
};
