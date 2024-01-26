import { FocusEvent, useEffect, useState } from 'react';

export const useInputIcon = <T, I extends string = string>({
  customIcon,
}: { customIcon?: I } = {}) => {
  type Event = FocusEvent<T>;
  const [isInputFocused, setIsInputFocused] = useState<boolean | null>(null);
  const [icon, setIcon] = useState<'none' | 'edit' | 'check' | I>('edit');
  useEffect(() => {
    if (isInputFocused === null) {
      return;
    }
    if (isInputFocused) {
      setIcon('none');
    } else {
      if (customIcon) {
        setIcon(customIcon);
        return;
      }
      setIcon('check');
      const t = setTimeout(() => {
        setIcon('edit');
      }, 3000);
      return () => {
        clearTimeout(t);
      };
    }
  }, [isInputFocused, customIcon]);

  return {
    register: (
      opts: {
        onFocus?: (e: Event) => void;
        onBlur?: (e: Event) => void;
      } = {},
    ) => ({
      onFocus: (ev: Event) => {
        setIsInputFocused(true);
        opts.onFocus?.(ev);
      },
      onBlur: (ev: Event) => {
        setIsInputFocused(false);
        opts.onBlur?.(ev);
      },
    }),
    icon,
  };
};
