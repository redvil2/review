import { useColorMode } from '@chakra-ui/react';

import { LogoDarkMode } from './logoDarkMode';
import { LogoLightMode } from './logoLightMode';
import { ChinaLogoDarkMode } from './zhLogoDarkMode';
import { ChinaLogoLightMode } from './zhLogoLightMode';

export const Logo = ({ region }: { region?: string }) => {
  const { colorMode } = useColorMode();
  if (colorMode === 'light' && region === 'china') {
    return <ChinaLogoLightMode />;
  } else if (colorMode === 'dark' && region === 'china') {
    return <ChinaLogoDarkMode />;
  } else if (colorMode === 'dark') {
    return <LogoDarkMode />;
  } else {
    return <LogoLightMode />;
  }
};
