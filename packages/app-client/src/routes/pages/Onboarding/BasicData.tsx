import { DropdownCard } from '@app/core/web/ui';
import { setI18nextCookie } from '@app/shared/i18n';
import { Button, Card, CardHeader, Headline } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Flex, useToast } from '@chakra-ui/react';
import { findKey, toPairs } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuthPrivate } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { APP_REGION, LANDING_URL, languages } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

export const BasicData = () => {
  const { userSettings, setUserSettings } = useAuthPrivate();
  const userSettingsUpdateMutation = trpc.user.settingsUpdate.useMutation({
    onError: error => {
      /* ToDo saving error should block next button, best way probably requires card component changes */
      toast({
        title: t('error.failedToUpdateUserLanguage'),
        description: error.message,
        status: 'error',
      });
    },
  });
  const settingsLanguageCode =
    findKey(languages, v => v === userSettings.language.toLowerCase()) || 'en';
  const [languageCode, setLanguageCode] = useState(settingsLanguageCode);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const handleLanguageSelect = (lng: string) => {
    if (lng === languageCode) return;
    setI18nextCookie(LANDING_URL, lng);
    setLanguageCode(lng);
    const oldUserSettings = userSettings;
    setUserSettings({
      ...userSettings,
      language: languages[lng].toUpperCase(),
    });
    userSettingsUpdateMutation.mutate(
      {
        language: languages[lng].toUpperCase(),
      },
      {
        onSuccess: data => {
          setUserSettings(data.userSettings);
          toast({
            title: t('success.successfullyUpdatedUserLanguage'),
            status: 'success',
          });
        },
        onError: error => {
          setUserSettings(oldUserSettings);
          toast({
            title: t('error.failedToUpdateUserLanguage'),
            description: error.message,
            status: 'error',
          });
        },
      },
    );
  };
  const languageChoices = useMemo(
    () =>
      toPairs(languages).map(([key, value]) => ({
        id: key,
        name: t(`system.${value}`),
      })),
    [t, languages],
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Flex
      ref={containerRef}
      className={'onboarding__basic-data'}
      direction={'column'}
      alignItems={'center'}
    >
      <Headline
        className={'welcome'}
        size={3}
        fontWeight={FONT_WEIGHT.SEMI_BOLD}
      >
        {t('onboarding.welcome')}
      </Headline>
      <DropdownCard
        label={t('system.language')}
        defaultId={languageCode}
        onChange={({ id }) => {
          handleLanguageSelect(id);
        }}
        menuItems={languageChoices}
      />
      <Card
        readOnly
        header={<CardHeader>{t(`system.${APP_REGION}`)}</CardHeader>}
      />
      <Button
        className="btn-next"
        onClick={() => navigate('/onboarding/account')}
      >
        {t('system.next')}
      </Button>
    </Flex>
  );
};
