import {
  ChakraProvider,
  ColorModeScript,
  ColorModeScriptProps,
  useColorMode,
} from '@chakra-ui/react';
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';

import { theme, Theme, switchColor, useTheme } from '.';

type ChakraColors = Theme['colors'];

interface Colors extends ChakraColors {
  current: ReturnType<typeof switchColor>;
}

export interface StyledTheme extends Theme {
  colors: Colors;
}

const SetupStyled = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const extTheme: StyledTheme = useMemo(
    () => ({
      ...theme,
      colors: { ...theme.colors, current: switchColor(colorMode) },
    }),
    [colorMode],
  );
  return <ThemeProvider theme={extTheme}>{children}</ThemeProvider>;
};

export interface SetupChakraProps extends PropsWithChildren {
  initialColorMode?: ColorModeScriptProps['initialColorMode'];
}

export const SetupChakra: FC<SetupChakraProps> = props => {
  const { children, initialColorMode = 'system' } = props;

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={initialColorMode} />
      <SetupStyled>{children}</SetupStyled>
    </ChakraProvider>
  );
};
