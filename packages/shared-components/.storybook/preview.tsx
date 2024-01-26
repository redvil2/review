import { SetupChakra } from '@app/shared/ui/theme';
import type { Preview } from '@storybook/react';
import React from 'react';

import { ThemeSwitcher } from './themeSwitcher';

const preview: Preview = {
  parameters: {
    chakra: {
      theme: 'dark',
    },
    toolbar: {
      items: [
        {
          type: 'component',
          component: ThemeSwitcher,
          title: 'Theme Switcher',
        },
      ],
    },
  },

  decorators: [
    (Story, context) => {
      const { parameters } = context;
      return (
        <SetupChakra initialColorMode={parameters.chakra.theme}>
          <Story />
        </SetupChakra>
      );
    },
  ],
};

export default preview;
