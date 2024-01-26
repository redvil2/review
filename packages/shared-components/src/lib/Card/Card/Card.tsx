import { CardBody, useColorMode } from '@chakra-ui/react';

import { StyledCard } from './card.style';
import { CardPropTypes } from './card.types';

export const Card = <T,>({
  id,
  selected,
  onSelect,
  children,
  header,
  input,
  footer,
  readOnly,
  onClick,
  className,
  first,
  noPadding,
  zIndex,
}: CardPropTypes<T>) => {
  const { colorMode } = useColorMode();
  const handleClick = () => {
    onSelect && id !== undefined && onSelect(id);
    onClick && !readOnly && onClick();
  };
  if (selected === id || selected === null || selected === undefined) {
    return (
      <StyledCard
        className={`al-card ${className ? className : ''}`}
        $colorMode={colorMode}
        $first={first}
        $noPadding={noPadding}
        $zIndex={zIndex}
        readOnly={readOnly}
        onClick={handleClick}
      >
        {input && input}
        {header && header}
        {children && <CardBody>{children}</CardBody>}
        {footer && footer}
      </StyledCard>
    );
  }
  return <div />;
};
