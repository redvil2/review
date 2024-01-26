import { Box, BoxProps } from '@chakra-ui/react';
import React, { forwardRef, ReactNode } from 'react';

type PageWrapperProps = BoxProps & {
  children: ReactNode;
};

export const PageWrapper = forwardRef<HTMLDivElement, PageWrapperProps>(
  (props, ref) => {
    const { children, ...rest } = props;
    return (
      <Box
        ref={ref}
        className={'al-page-wrapper'}
        maxWidth="768px"
        margin="0 auto"
        padding="0 1rem 1rem"
        minHeight="100vh"
        {...rest}
      >
        {children}
      </Box>
    );
  },
);
