import { VStack, Card, Container, Select } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Dropdown } from '../Dropdown/Dropdown';
import { Icon } from '../Icon/Icon';

import { Input } from './Input';
import { InputAddon } from './InputAddon';
import { InputContainer } from './InputContainer';
import { InputErrorMessage } from './InputErrorMessage';
import { InputField } from './InputField';
import { InputHint } from './InputHint';
import { InputLabel } from './InputLabel';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Components / Input',
  decorators: [
    Story => (
      <Container size="sm" bg="#f5f5f5">
        <VStack p="10" spacing="10">
          <Story />
        </VStack>
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

const data = [
  { id: 1, name: 'First item' },
  { id: 2, name: 'Second longer item' },
  { id: 3, name: 'Third even longer item' },
];

export const InputExamples = () =>
  (
    <>
      <Card w="100%">
        <InputField>
          <Input placeholder="Placeholder" />
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer>
            <Input placeholder="Placeholder" />
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
          <Input placeholder="Placeholder" />
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputAddon>
            <Select>
              {data.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </InputAddon>
          <Input placeholder="Placeholder" />
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputAddon>
            <Dropdown menuItems={data} defaultItem={data[1]} />
          </InputAddon>
          <Input placeholder="Placeholder" />
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <Input placeholder="Placeholder" />
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
          <InputContainer>
            <InputLabel>Label</InputLabel>
            <Input placeholder="Placeholder" />
          </InputContainer>
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
          <InputAddon>
            <Icon>Mail</Icon>
          </InputAddon>
          <InputContainer>
            <InputLabel>Label</InputLabel>
            <Input defaultValue="User Input" />
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer>
            <InputLabel>Label</InputLabel>
            <Input defaultValue="User Input" />
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer isInvalid>
            <InputLabel>Label</InputLabel>
            <Input defaultValue="User Input" />
            <InputErrorMessage>Error Message</InputErrorMessage>
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer isInvalid>
            <Input defaultValue="User Input" />
            <InputErrorMessage>Error Message</InputErrorMessage>
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <Input defaultValue="User Input" />
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer>
            <Input defaultValue="User Input" />
            <InputHint>Hint</InputHint>
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer>
            <InputLabel>Wrap Test</InputLabel>
            <Input defaultValue="Lorem Ipsum is simply dummy text of the printing and typesetting industry." />
            <InputHint>Hint</InputHint>
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer isDisabled>
            <Input defaultValue="User Input Disabled" />
          </InputContainer>
        </InputField>
      </Card>

      <Card w="100%">
        <InputField>
          <InputContainer isReadOnly>
            <Input defaultValue="User Input Readonly" />
          </InputContainer>
        </InputField>
      </Card>
    </>
  ) as Story;
