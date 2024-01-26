import { switchColor } from '@app/shared/ui/theme';
import {
  HStack,
  Skeleton,
  SkeletonCircle,
  useColorMode,
  VStack,
} from '@chakra-ui/react';

import { SwitchSkeleton } from '@app/shared/ui/components';

export const UserListItemSkeleton = () => {
  const { colorMode } = useColorMode();
  return (
    <HStack gap={4} pt={4}>
      <SkeletonCircle
        size="10"
        startColor={switchColor(colorMode).secondaryContainer}
      />
      <VStack gap={0.5} flexGrow={1} alignItems={'flex-start'}>
        <Skeleton
          height="16px"
          width="60%"
          startColor={switchColor(colorMode).secondaryContainer}
        />
        <Skeleton
          height="8px"
          width="40%"
          startColor={switchColor(colorMode).secondaryContainer}
        />
      </VStack>
      <SwitchSkeleton />
    </HStack>
  );
};
