import { render } from '@testing-library/react';
import React from 'react';

import { Index } from './index';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
});

describe('Index', () => {
  it.skip('should render successfully', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = {};
    const { getByText } = render(<Index {...props} />);
    expect(getByText(/Welcome to websites-landing!/gi)).toBeTruthy();
  });
});
