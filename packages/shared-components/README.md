# shared-ui-components
## Project

### Description
This is a shared component library that can be used across the entire monorepo. It implements [Chakra UI](https://chakra-ui.com/) to provide a fast way to build components, but with a customized theme. The theme is a separate project. 

### Using the components
```js
import { ComponentName } from '@app/shared/ui/components';
```

### Tech stack
- This library was generated with [Nx](https://nx.dev).

- [Eslint](https://eslint.org/): Highlights and enforces code quality and style guidelines, helping catch errors early and improve code maintainability.

- [Typescript](https://www.typescriptlang.org/): Adds static type checking, reducing runtime errors and improving code clarity and documentation.

- [Styled-components](https://styled-components.com/docs): Enables modular styling, simplifying styling and reducing conflicts across components.

- [Vite](https://vitejs.dev/): Provides a fast and efficient build tool, reducing development and build times.

- [React Hook Form](https://www.react-hook-form.com/): Provides a simple and flexible solution for form validation, reducing development time and improving user experience.

- [Google Material Icons]((https://fonts.google.com/icons)): Provides a large library of high-quality icons, reducing the need for custom icon creation and improving consistency.

- [Chakra UI](https://chakra-ui.com/): Offers a comprehensive component library with customizable styling, reducing development time and improving consistency and accessibility.

- [Cypress](https://www.cypress.io/app/): Offers an end-to-end testing solution that is easy to set up and use, reducing development time and ensuring quality.

- [Storybook](https://storybook.js.org/): Provides a powerful documentation and testing platform for UI components, improving collaboration and reducing the risk of bugs and inconsistencies.


## Prerequisites
- Node Version > 18
- NX must be installed

## Installation
```bash
yarn install
```

## Usage
### Running storybook
```bash
nx run shared-ui-components:storybook
```

### Running unit tests
Execute the unit tests via [Vitest](https://vitest.dev/)
```bash
nx test shared-ui-components
```

## Project structure
```
src
│   vite.config.ts         // Vite configuration
│   tsconfig               // Typescript configuration
│   project.json           // NX configuration
│   .eslintrs.json         // Linter configuration
│
└─── .storybook     // Storybook configurations
│
└─── src
    └─── index.ts   // Exporting all components
    └─── lib     
        └─── [component]
            └─── [component].stories.tsx    // Storybook story for this component
            └─── [component].style.ts       // All styled components styles
            └─── [Component].tsx            // Functional component
            └─── [component].types.ts       // All types
```

## Styling
### Chakra UI and styled-components
✅ Use chakra components as base where it can speed up working on functionality.

✅ Change the base styles of Chakra components in the theme project.

⛔ Do not write basic styles into the component styles. Chakra components itself are styled via the extendTheme function. Only child components have to be styled in this project.

**Example**:
The badge component uses the chakra component as a base. The styles of the badge are changed in the theme project. The new child components our Badge contains such as Icon or dot are styled in the component's styles.


### Icons
Google Material Icon set can be seen [here](https://fonts.google.com/icons)


## Testing
TBD
