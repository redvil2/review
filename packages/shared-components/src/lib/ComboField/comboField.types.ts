import { FormEvent, ReactNode } from 'react';

export interface ComboFieldPropTypes {
  placeholder?: string;
  isLoading?: boolean;
  value?: string;
  debounce?: number;
  onInput?: (event: FormEvent<HTMLInputElement>) => void;
  minCharLength?: number;
  children?: ReactNode;
  showBody?: boolean;
  invokeCall?: () => void;
}
