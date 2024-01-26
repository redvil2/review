import { Flex, useToast } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatch, useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import { i18n } from '../../../i18n';

import { CodeForm } from './CodeForm';

export const SignupLoginPhonePage: FC = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const codeSent = Boolean(useMatch('/signin/number/confirm'));

  const { onLogin } = useAuth();

  const [mobileNumber, setMobileNumber] = useState<string | null>(null);

  useEffect(() => {
    if (codeSent && mobileNumber === null) {
      navigate('/signin/number');
    }
  }, [codeSent, mobileNumber]);

  const smsCodeSendMutation = trpc.sms.codeSend.useMutation({
    onError: error => {
      toast({
        title: t('error.anErrorOccurred'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const sendMobileNumber = (recipientNumber: string) => {
    smsCodeSendMutation.mutate(
      {
        recipientNumber,
      },
      {
        onSuccess: () => {
          setMobileNumber(recipientNumber);
          navigate('/signin/number/confirm');
        },
      },
    );
  };

  const smsCodeVerifyMutation = trpc.sms.codeVerify.useMutation({
    onSuccess: data => {
      onLogin(data);
    },
    onError: error => {
      if (error.message.includes('Invalid code')) {
        toast({
          title: t('error.incorrectCode'),
          description: t('error.pleaseTryAgain'),
          status: 'error',
        });
        return;
      }
      toast({
        title: t('error.anErrorOccurred'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const smsCodeVerify = (code: string) => {
    if (mobileNumber) {
      smsCodeVerifyMutation.mutate({
        code: parseInt(code || '0'),
        recipientNumber: mobileNumber,
        languageCode: i18n.language,
      });
    } else {
      toast({
        title: t('formMessages.internalFormError'),
        status: 'error',
      });
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Flex ref={containerRef} direction="column" w="100%">
      <CodeForm
        sent={codeSent}
        isSubmitting={
          smsCodeSendMutation.isLoading || smsCodeVerifyMutation.isLoading
        }
        onSubmit={smsCodeVerify}
        onSendCode={sendMobileNumber}
      />
    </Flex>
  );
};
