import {
  Card,
  CardHeader,
  Icon,
  Loader,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { PublicClientApplication } from '@azure/msal-browser';
import { Flex, useToast } from '@chakra-ui/react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { ReactComponent as Microsoft } from '../../../assets/icons/microsoft.svg';
import { ReactComponent as WeChat } from '../../../assets/icons/wechat.svg';
import {
  MS_SSO_AUTHORITY,
  MS_SSO_CLIENT_ID,
  MS_SSO_REDIRECT_URI,
  WECHAT_SSO_ENABLE,
} from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import { i18n } from '../../../i18n';

export const SignupLoginProviderPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { onLogin } = useAuth();
  const { t } = useTranslation();

  const verifyMicrosoftToken = trpc.token.verifyMicrosoft.useMutation({
    onSuccess: data => {
      onLogin(data);
    },
    onError: error => {
      toast({
        title: t('error.anErrorOccurred'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const myMSALObj = new PublicClientApplication({
    auth: {
      clientId: MS_SSO_CLIENT_ID,
      authority: MS_SSO_AUTHORITY,
      redirectUri: MS_SSO_REDIRECT_URI,
    },
  });

  const handleMicrosoftLogin = async () => {
    await myMSALObj.loginRedirect({ scopes: ['User.Read'] });
  };

  const handlePageLoad = async () => {
    const loginResponse = await myMSALObj.handleRedirectPromise();
    if (loginResponse) {
      verifyMicrosoftToken.mutate({
        accessToken: loginResponse.accessToken,
        languageCode: i18n.language,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    handlePageLoad();
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return loading || verifyMicrosoftToken.isLoading ? (
    <Flex>
      <Loader />
    </Flex>
  ) : (
    <Flex
      ref={containerRef}
      direction="column"
      gap="1rem"
      align="stretch"
      w="100%"
    >
      <Card
        onClick={handleMicrosoftLogin}
        header={<CardHeader leftIcon={<Microsoft />}>Microsoft</CardHeader>}
      />

      <Card
        onClick={() => navigate('/signin/number')}
        header={
          <CardHeader
            leftIcon={<Icon className={'al-login-icon-phone'}>Call</Icon>}
          >
            Mobile Phone
          </CardHeader>
        }
      />

      {!!WECHAT_SSO_ENABLE && (
        <Card
          onClick={() => navigate('/signin/wechat')}
          header={<CardHeader leftIcon={<WeChat />}>WeChat</CardHeader>}
        />
      )}

      <Flex
        mt={8}
        mx="auto"
        width="14rem"
        flexDir="column"
        justifyContent="center"
      >
        <Paragraph
          size={2}
          fontWeight={FONT_WEIGHT.REGULAR}
          textAlign={'center'}
        >
          <Trans
            i18nKey="signin.processDisclaimer"
            components={{
              ref: (
                <a className="link-terms" onClick={() => navigate('/terms')} />
              ),
            }}
          />
        </Paragraph>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.BOLD} textAlign="center">
          <a className="link-terms" onClick={() => navigate('/privacy')}>
            Privacy Page
          </a>
        </Paragraph>
      </Flex>
    </Flex>
  );
};
