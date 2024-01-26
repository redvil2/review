import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-styling',
    // TODO: keep an eye on this plugin and use it once it supports storybook 7
    // '@chakra-ui/storybook-addon',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (config, { configType }) => {
    return mergeConfig(config, {
      plugins: [
        viteTsConfigPaths({
          projects: [`${__dirname}/../../../tsconfig.base.json`],
        }),
      ],
    });
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
