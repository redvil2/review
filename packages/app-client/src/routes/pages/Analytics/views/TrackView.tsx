import {
  AnimatedBox,
  AnimationVideoPlayer,
  RevealingText,
} from '@app/core/web/ui';
import { Button, Icon } from '@app/shared/ui/components';
import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { Flex, useColorMode, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LabelConfettiVideo from '@app/client/assets/video/label_confetti.webm';

export const TrackView = () => {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const [animationStates, setAnimationStates] = useState([false, false, false]);
  const triggerAnimation = index => {
    setAnimationStates(prevStates =>
      prevStates.map((state, idx) => (idx === index ? true : state)),
    );
  };
  return (
    <VStack
      w={'100%'}
      h={'100%'}
      justifyContent={'center'}
      position={'fixed'}
      left={0}
    >
      <AnimationVideoPlayer
        source={LabelConfettiVideo}
        timecodeEvents={[
          {
            timecode: 1.35,
            callback: () => triggerAnimation(0),
          },
          {
            timecode: 2,
            callback: () => triggerAnimation(1),
          },
          {
            timecode: 2.5,
            callback: () => triggerAnimation(2),
          },
        ]}
      />
      <Flex
        flex={'1 0 auto'}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        zIndex={10}
      >
        <RevealingText
          text={t('analytics.activateTrack', { newline: '\n' })}
          revealSpeed={50}
          fontWeight={FONT_WEIGHT.REGULAR}
          color={switchColor(colorMode).onPrimaryContainer}
          fontSize="2rem"
          startAnimation={animationStates[1]}
        />
        <AnimatedBox isVisible={animationStates[2]}>
          <Button leftIcon={<Icon>add</Icon>} isDisabled>
            {t('analytics.activate')}
          </Button>
        </AnimatedBox>
      </Flex>
    </VStack>
  );
};
