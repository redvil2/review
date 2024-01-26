import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

type AnimatedLetterProps = {
  isVisible: boolean;
};

const AnimatedLetter = styled.span<AnimatedLetterProps>`
  transition: opacity 0.3s ease;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

type RevealingTextProps = {
  text: string;
  revealSpeed?: number;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  startAnimation: boolean;
};
export const RevealingText: React.FC<RevealingTextProps> = ({
  text,
  revealSpeed = 100,
  fontSize,
  fontWeight,
  color,
  startAnimation,
}) => {
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (startAnimation && revealedIndices.length < text.length) {
      const timeoutId = setTimeout(() => {
        setRevealedIndices(currentIndices => [
          ...currentIndices,
          currentIndices.length,
        ]);
      }, revealSpeed);
      return () => clearTimeout(timeoutId);
    }
  }, [startAnimation, revealedIndices, text, revealSpeed]);

  return (
    <Box fontSize={fontSize} fontWeight={fontWeight} color={color}>
      {text.split('').map((char, index) => (
        <AnimatedLetter key={index} isVisible={revealedIndices.includes(index)}>
          {char}
        </AnimatedLetter>
      ))}
    </Box>
  );
};
