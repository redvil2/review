import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';

import { Paragraph, UserListItemSkeleton } from '@app/shared/ui/components';

import { ComboField } from './ComboField';

const meta: Meta<typeof ComboField> = {
  component: ComboField,
  title: 'Components/ComboField',
};

export default meta;

type Story = StoryObj<typeof ComboField>;

export const Default: Story = {
  args: {
    placeholder: 'Add 4-5 chars to see list...',
  },
  render: args => {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [list, setList] = useState<number[]>([]);
    const [listHasBeenFetched, setListHasBeenFetched] = useState(false);
    const apiMock = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setListHasBeenFetched(true);
        if (value.length >= 3 && value.length < 5) {
          setList([1, 2]);
        }
      }, 2000);
    };

    useEffect(() => {
      setList([]);
      setListHasBeenFetched(false);
    }, [value]);
    return (
      <ComboField
        {...args}
        value={value}
        isLoading={isLoading}
        onInput={ev => setValue((ev.target as HTMLInputElement).value)}
        invokeCall={apiMock}
        showBody={value.length >= 3}
      >
        {isLoading && <UserListItemSkeleton />}
        {!isLoading && !!list.length && <div>Show list here</div>}
        {!list.length && !isLoading && listHasBeenFetched && (
          <Paragraph
            size={1}
            fontWeight={FONT_WEIGHT.MEDIUM}
            textAlign={'center'}
          >
            No result
          </Paragraph>
        )}
      </ComboField>
    );
  },
};
