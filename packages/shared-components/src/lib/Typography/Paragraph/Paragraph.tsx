import React from 'react';

import { StyledParagraph } from './paragraph.style';
import { ParagraphPropTypes } from './paragraph.types';

export const Paragraph: React.FC<ParagraphPropTypes> = ({
  children,
  textAlign,
  className,
  ...rest
}) => (
  <StyledParagraph
    className={`al-paragraph ${className ? className : ''}`}
    textAlign={textAlign}
    {...rest}
  >
    {children}
  </StyledParagraph>
);
