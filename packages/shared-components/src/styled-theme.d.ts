import { StyledTheme } from '@app/shared/ui/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends StyledTheme {}
}
