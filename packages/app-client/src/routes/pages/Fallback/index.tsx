import {
  Button,
  Headline,
  Icon,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useColorMode } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';

import { ReactComponent as AllLabelsEmptyState } from '../../../assets/icons/all-labels-empty.svg';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledFallbackPage } from './StyledFallbackPage';

export const FallbackPage: FC = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const projectId = queryParams.get('projectId');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate(`/project/${projectId}/order/${orderId}`);
    } else {
      navigate(`/signin?redirect=/project/${projectId}/order/${orderId}`);
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledFallbackPage $colorMode={colorMode}>
      <PageWrapper>
        <Flex
          ref={containerRef}
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          height={'80vh'}
        >
          <Box mb={16}>
            <Headline
              size={3}
              fontWeight={FONT_WEIGHT.SEMI_BOLD}
              textAlign={'center'}
            >
              {t('fallbackPage.yourQRCodeWorks')}
            </Headline>
          </Box>
          <Flex justifyContent={'center'} alignItems={'center'} mb={6}>
            <AllLabelsEmptyState />
          </Flex>
          <Paragraph
            size={1}
            fontWeight={FONT_WEIGHT.REGULAR}
            textAlign={'center'}
          >
            {t('fallbackPage.successDescription')}
          </Paragraph>
          {orderId && (
            <Flex mt={10}>
              <Button onClick={handleNavigate} leftIcon={<Icon>edit</Icon>}>
                {t('fallbackPage.cta')}
              </Button>
            </Flex>
          )}
        </Flex>
      </PageWrapper>
    </StyledFallbackPage>
  );
};
