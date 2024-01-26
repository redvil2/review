/// <reference types="vitest" />
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, searchForWorkspaceRoot } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const ENV_WHITELIST = ['SENTRY_DSN'];

export default defineConfig(({ command, mode }) => {
  const envDir = '../..';
  const env = loadEnv(mode, envDir, '');
  const enableSentry = Boolean(
    command == 'build' && env.SENTRY_DSN && env.SENTRY_ENVIRONMENT,
  );

  return {
    envDir,

    server: {
      port: 4200,
      host: '0.0.0.0',
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          '/node_modules/@fontsource',
        ],
      },
    },

    preview: {
      port: 4300,
      host: 'localhost',
    },

    build: {
      sourcemap: enableSentry,
    },

    define: ENV_WHITELIST.reduce((acc, key) => {
      if (env[key] == null) return acc;

      return {
        ...acc,
        [`import.meta.env.${key}`]: JSON.stringify(env[key]),
      };
    }, {}),

    plugins: [
      tsconfigPaths(),
      react(),
      svgr(),
      sentryVitePlugin({
        disable: !enableSentry,
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
        sourcemaps: {
          filesToDeleteAfterUpload: ['**/*.map'],
        },
        release: {
          setCommits: {
            auto: true,
          },
          deploy: {
            env: env.SENTRY_ENVIRONMENT,
            url: env.VITE_CORE_WEB_URL,
          },
        },
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../../',
    //    }),
    //  ],
    // },

    test: {
      globals: true,
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  };
});
