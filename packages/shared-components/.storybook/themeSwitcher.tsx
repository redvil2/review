import { Button, useColorMode } from '@chakra-ui/react';
import React from 'react';

export const ThemeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleClick = () => {
    toggleColorMode();
  };

  return (
    <Button aria-label="Toggle theme" variant="ghost" onClick={handleClick}>
      {colorMode}
    </Button>
  );
};
