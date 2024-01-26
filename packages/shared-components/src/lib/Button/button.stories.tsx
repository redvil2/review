import { Container, HStack, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../Icon/Icon';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components / Button',
  decorators: [
    Story => (
      <Container mt="40px" display="flex" flexWrap="nowrap" gap="4">
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const WithVariants = () => (
  <HStack spacing="24px">
    <Button variant="primary" onClick={text => console.log(text)}>
      Button
    </Button>
    <Button variant="secondary">Button</Button>
    <Button variant="link">Button</Button>
  </HStack>
);

export const WithSizes = () => (
  <HStack spacing="24px">
    <Button size="small">Button</Button>
    <Button size="medium">Button</Button>
    <Button size="large">Button</Button>
    <Button size="xlarge">Button</Button>
  </HStack>
);

export const WithIcons = () => (
  <HStack spacing="24px">
    <VStack spacing="24px">
      <Button
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="small"
      >
        Button
      </Button>
      <Button
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
      >
        Button
      </Button>
      <Button
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="large"
      >
        Button
      </Button>
      <Button
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="xlarge"
      >
        Button
      </Button>
    </VStack>
    <VStack spacing="24px">
      <Button
        variant="secondary"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="small"
      >
        Button
      </Button>
      <Button
        variant="secondary"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
      >
        Button
      </Button>
      <Button
        variant="secondary"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="large"
      >
        Button
      </Button>
      <Button
        variant="secondary"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="xlarge"
      >
        Button
      </Button>
    </VStack>
    <VStack spacing="24px">
      <Button
        variant="link"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="small"
      >
        Button
      </Button>
      <Button
        variant="link"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
      >
        Button
      </Button>
      <Button
        variant="link"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="large"
      >
        Button
      </Button>
      <Button
        variant="link"
        leftIcon={<Icon>add</Icon>}
        rightIcon={<Icon>arrow_forward</Icon>}
        size="xlarge"
      >
        Button
      </Button>
    </VStack>
  </HStack>
);

export const WithDisabled = () => (
  <HStack spacing="24px">
    <Button isDisabled>Button</Button>
    <Button variant="secondary" isDisabled>
      Button
    </Button>
    <Button variant="link" isDisabled>
      Button
    </Button>
  </HStack>
);
