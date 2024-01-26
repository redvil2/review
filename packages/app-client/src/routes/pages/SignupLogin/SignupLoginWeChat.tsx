import { Flex } from '@chakra-ui/react';
import WechatLogin from '@dmatora/react-wechat-login';
import { nanoid } from 'nanoid';
import React, { FC, useRef } from 'react';

import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { WECHAT_SSO_APP_ID, WECHAT_SSO_REDIRECT_URL } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import { i18n } from '../../../i18n';

export const SignupLoginWeChat: FC = () => {
  const { onLogin } = useAuth();
  const token = nanoid();
  trpc.token.onWechatCalledBack.useSubscription(
    { token, languageCode: i18n.language },
    {
      onData(data) {
        onLogin(data);
      },
    },
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Flex ref={containerRef} direction="column" w="100%" align="center">
      <WechatLogin
        appid={WECHAT_SSO_APP_ID}
        redirectUri={WECHAT_SSO_REDIRECT_URL}
        state={token}
      />
    </Flex>
  );
};
