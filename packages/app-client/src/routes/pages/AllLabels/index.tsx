import {
  AnimatedBox,
  AnimationVideoPlayer,
  RevealingText,
} from '@app/core/web/ui';
import {
  Button,
  Card,
  CardHeader,
  Icon,
  LinkUnlinkIcon,
  Loader,
  PageHeader,
  PageWrapper,
} from '@app/shared/ui/components';
import { FONT_WEIGHT, switchColor, useTheme } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode, useToast } from '@chakra-ui/react';
import { differenceBy } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LabelConfettiVideo from '@app/client/assets/video/label_confetti.webm';
import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { FALLBACK_URL } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledAllLabels } from './StyledAllLabels';

export const AllLabelsPage = () => {
  const { onLogout } = useAuth();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    data: createdProjects,
    error,
    isLoading,
    isError,
  } = trpc.project.listOwn.useQuery();
  const { data: sharedProjects } = trpc.project.listAccessible.useQuery();
  const toast = useToast();
  const [animationStates, setAnimationStates] = useState([false, false, false]);
  const triggerAnimation = index => {
    setAnimationStates(prevStates =>
      prevStates.map((state, idx) => (idx === index ? true : state)),
    );
  };
  useEffect(() => {
    if (isError && error) {
      toast({
        title: t('error.failedToFetchLabels'),
        description: error.message,
        status: 'error',
      });
    }
  }, [isError, error, toast]);

  const handleLogout = () => {
    onLogout();
    navigate('/signin');
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  const allProjects = differenceBy(
    sharedProjects?.projects || [],
    createdProjects?.projects || [],
    'id',
  ).concat(createdProjects?.projects || []);

  return (
    <StyledAllLabels $colorMode={colorMode} $theme={theme}>
      <PageWrapper>
        <Flex
          ref={containerRef}
          direction={'column'}
          minHeight={'calc(100vh - 1rem)'}
        >
          {!isLoading && !allProjects.length && (
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
          )}
          <PageHeader
            contextMenu={[
              {
                id: 'settings',
                name: t('system.settings'),
                icon: <Icon>settings</Icon>,
                onClick: () => navigate('/settings'),
              },
              {
                id: 'imprint',
                name: t('system.imprint'),
                icon: <Icon>info</Icon>,
                onClick: () => navigate('/imprint'),
              },
              {
                id: 'logout',
                name: t('system.logout'),
                icon: <Icon>logout</Icon>,
                onClick: handleLogout,
              },
            ]}
            actionSlot={
              <Button
                leftIcon={<Icon>add</Icon>}
                onClick={() => navigate('/labels/add')}
              />
            }
            mainTitle
          >
            {t('allLabels.labels')}
          </PageHeader>
          {isLoading && (
            <Flex
              width={'100%'}
              height={'100%'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Loader />
            </Flex>
          )}
          {!isLoading && allProjects.length && (
            <Box pt={'2rem'}>
              {allProjects.map(project => (
                <Card
                  key={project.id}
                  header={
                    <CardHeader
                      genericSlot={
                        <LinkUnlinkIcon
                          isLinked={
                            !project.lastOrderUrl?.includes(FALLBACK_URL)
                          }
                        />
                      }
                    >
                      <p>{project.title}</p>
                      {(project.labelCustomer || project.printProvider) && (
                        <p
                          style={{
                            color: switchColor(colorMode).secondary,
                            fontWeight: 400,
                            fontSize: 14,
                            fontFamily: 'Jost',
                          }}
                        >
                          {[project.labelCustomer, project.printProvider]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </CardHeader>
                  }
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
            </Box>
          )}

          {!isLoading && !allProjects.length && (
            <Flex
              flex={'1 0 auto'}
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              zIndex={10}
            >
              <RevealingText
                text={t('intro.subline')}
                revealSpeed={50}
                fontWeight={FONT_WEIGHT.REGULAR}
                color={switchColor(colorMode).onPrimaryContainer}
                fontSize="2rem"
                startAnimation={animationStates[1]}
              />
              <AnimatedBox isVisible={animationStates[2]}>
                <Button onClick={() => navigate('/labels/add')}>
                  + {t('intro.cta')}
                </Button>
              </AnimatedBox>
            </Flex>
          )}
        </Flex>
      </PageWrapper>
    </StyledAllLabels>
  );
};
