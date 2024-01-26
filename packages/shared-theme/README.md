# shared-ui-theme
## Project

### Description
This is a theme for the component library that can be used across the entire monorepo. It implements [Chakra UI](https://chakra-ui.com/) to provide a fast way to build components, but with a customized theme. The component lib itself is a separate project.

### Using the theme
In the app you want to use the theme, import the SetUp wrapper and wrap your entire app with it. 
```js
import { SetupChakra } from '@app/shared/ui/theme';

const App = () => <SetupChakra>{children}</SetupChakra>;
```

### Tech stack
- This library was generated with [Nx](https://nx.dev).

- [Eslint](https://eslint.org/): Highlights and enforces code quality and style guidelines, helping catch errors early and improve code maintainability.

- [Typescript](https://www.typescriptlang.org/): Adds static type checking, reducing runtime errors and improving code clarity and documentation.

- [Vite](https://vitejs.dev/): Provides a fast and efficient build tool, reducing development and build times.

- [Chakra UI](https://chakra-ui.com/): Offers a comprehensive component library with customizable styling, reducing development time and improving consistency and accessibility.


## Prerequisites
- Node Version > 18
- NX must be installed

## Installation
```bash
yarn install
```

## Usage

### Running unit tests
Execute the unit tests via [Vitest](https://vitest.dev/)
```bash
nx test shared-ui-theme
```

## Project structure
```
src
│   vite.config.ts         // Vite configuration
│   tsconfig               // Typescript configuration
│   project.json           // NX configuration
│   .eslintrs.json         // Linter configuration
│
└─── src
    └─── index.ts           // Exporting all theme elements
    └─── setup-chakra.tsx   // Wrapper component to use chakra provider 
    └─── switch-color.ts    // Helper function to switch between light and dark mode 
    └─── theme
        └─── index.ts       // extendTheme function from Chakra
        └─── darkTheme.ts   // Dark theme config
        └─── lightTheme.ts  // Light theme config
        └─── colors.ts      // Color theme
        └─── mixins         // Reusable styling configs
        └─── components
            └─── index.ts           // Exporting all component style configs
            └─── [Component].ts     // Base style configs for each component
          
```

## Styling
### Configs
✅ Create an own config file for each component in the components folder and export it in the index.ts file.

⛔ Do not use colors directly from the color theme. You can find the Figma variable names of colors in the dark and light mode configs. **If you can't find a color there talk to a designer first!**


## Testing
TBD
