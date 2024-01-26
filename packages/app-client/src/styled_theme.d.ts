import { StyledTheme } from '@app/shared/ui/theme';

/* Following code does not work
 * Supposed to enable styled's css prop, but it clashes with emotion's css
 *   and because of monorepo and storybook we can't remove emotion

declare module 'react' {
  interface Attributes {
    css?: CSSProp<StyledTheme>;
  }
  interface DOMAttributes<_T> {
    css?: CSSProp<StyledTheme>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CSSProp<StyledTheme>;
    }
  }
}
*/

declare module 'styled-components' {
  export interface DefaultTheme extends StyledTheme {}
}
