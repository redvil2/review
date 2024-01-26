import { DropdownCard } from '@app/core/web/ui';
import { setI18nextCookie } from '@app/shared/i18n';
import {
  Button,
  Card,
  CardHeader,
  Input,
  InputContainer,
  InputErrorMessage,
  InputField,
  PageSectionLabel,
} from '@app/shared/ui/components';
import { switchColor } from '@app/shared/ui/theme';
import {
  Card as CCard,
  Divider,
  Flex,
  HStack,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { findKey, toPairs } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuthPrivate } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { APP_REGION, LANDING_URL, languages } from '../../../../constants';

export type SettingsForm = {
  firstName: string;
  lastName: string;
  mobilePhone: string;
  email: string;
  companyName: string;
  language: string;
};

export const AccountView = () => {
  const { userSettings, user, setUserSettings } = useAuthPrivate();
  const userUpdateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      toast({
        title: t('success.successfullyUpdatedUserProfile'),
        status: 'success',
      });
    },
    onError: error => {
      toast({
        title: t('error.failedToUpdateUserProfile'),
        description: error.message,
        status: 'error',
      });
    },
  });
  const userSettingsUpdateMutation = trpc.user.settingsUpdate.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm<SettingsForm>();

  const settingsLanguageCode =
    findKey(languages, v => v === userSettings.language.toLowerCase()) || 'en';
  const [languageCode, setLanguageCode] = useState(settingsLanguageCode);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const watchedFields = watch();

  useEffect(() => {
    if (user?.firstName) setValue('firstName', user.firstName);
    if (user?.lastName) setValue('lastName', user.lastName);
    if (user?.mobilePhone) setValue('mobilePhone', user.mobilePhone);
    if (user?.email) setValue('email', user.email);
    if (user?.companyName) setValue('companyName', user.companyName);
  }, [user, setValue]);

  useEffect(() => {
    const currentValues = getValues();
    const isChanged =
      user?.firstName !== currentValues.firstName ||
      user?.lastName !== currentValues.lastName ||
      user?.mobilePhone !== currentValues.mobilePhone ||
      user?.email !== currentValues.email ||
      user?.companyName !== currentValues.companyName;

    setHasFormChanged(isChanged);
  }, [watchedFields, user]);

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

  const handleSave = async (form: SettingsForm) => {
    const update: {
      firstName?: string;
      lastName?: string;
      email?: string;
      companyName?: string;
    } = {};

    if (form.firstName.length && form.firstName !== user?.firstName)
      update.firstName = form.firstName as string;
    if (form.lastName.length && form.lastName !== user?.lastName)
      update.lastName = form.lastName as string;
    if (form.email.length && form.email !== user?.email)
      update.email = form.email as string;
    if (form.companyName.length && form.companyName !== user?.companyName)
      update.companyName = form.companyName as string;
    if (!Object.keys(update).length) return;

    userUpdateMutation.mutate({
      ...update,
    });
  };
  const languageChoices = useMemo(
    () =>
      toPairs(languages).map(([key, value]) => ({
        id: key,
        name: t(`system.${value}`),
      })),
    [t, languages],
  );

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(handleSave)}
      direction="column"
      w="100%"
      alignItems="center"
      mt={8}
    >
      <Flex direction={'column'} w="100%" alignItems="stretch" gap="0.75rem">
        <PageSectionLabel>{t('settingsPage.myDetails')}</PageSectionLabel>
        <CCard>
          <InputContainer isInvalid={!!errors.firstName}>
            <Input
              defaultValue={user?.firstName ?? ''}
              placeholder={t('account.firstName')}
              {...register('firstName', {
                required: t('formMessages.firstNameIsRequired'),
              })}
            />
            <InputErrorMessage>{errors.firstName?.message}</InputErrorMessage>
          </InputContainer>
        </CCard>
        <CCard>
          <InputContainer isInvalid={!!errors.lastName}>
            <Input
              defaultValue={user?.lastName ?? ''}
              placeholder={t('account.lastName')}
              {...register('lastName', {
                required: t('formMessages.lastNameIsRequired'),
              })}
            />
            <InputErrorMessage>{errors.lastName?.message}</InputErrorMessage>
          </InputContainer>
        </CCard>
        {user?.mobilePhone && (
          <Card readOnly noPadding>
            <InputField>
              <InputContainer isInvalid={!!errors.mobilePhone} isDisabled>
                <Input
                  defaultValue={`+${user?.mobilePhone.replace(/\+/g, '')}`}
                  placeholder={t('account.mobileNumber')}
                />
                <InputErrorMessage>
                  {errors.mobilePhone?.message}
                </InputErrorMessage>
              </InputContainer>
            </InputField>
          </Card>
        )}
        <CCard>
          <InputContainer isInvalid={!!errors.email}>
            <Input
              defaultValue={user?.email ?? ''}
              placeholder={t('account.workEmail')}
              {...register('email', {
                required: t('formMessages.workEmailIsRequired'),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t('formMessages.workEmailIsInvalid'),
                },
              })}
            />
            <InputErrorMessage>{errors.email?.message}</InputErrorMessage>
          </InputContainer>
        </CCard>
        <CCard>
          <InputContainer isInvalid={!!errors.companyName}>
            <Input
              defaultValue={user?.companyName ?? ''}
              placeholder={t('account.companyName')}
              {...register('companyName', {})}
            />
            <InputErrorMessage>{errors.companyName?.message}</InputErrorMessage>
          </InputContainer>
        </CCard>
        <Divider
          sx={{
            borderColor: switchColor(colorMode).outlineVariant,
            marginY: '1rem',
            opacity: 1,
          }}
        />
        <HStack justifyContent={'space-between'}>
          <Card
            header={
              <CardHeader
                toggle={{
                  isChecked: colorMode === 'dark',
                  onChange: () => toggleColorMode(),
                }}
              >
                {t('system.darkMode')}
              </CardHeader>
            }
          />
        </HStack>
        <DropdownCard
          defaultId={languageCode}
          onChange={({ id }) => {
            handleLanguageSelect(id);
          }}
          menuItems={languageChoices}
        />
        <Card
          readOnly
          header={<CardHeader disabled>{t(`system.${APP_REGION}`)}</CardHeader>}
        />
      </Flex>
      <Flex gap="1rem" mt={8}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/labels')}
        >
          {t('system.cancel')}
        </Button>
        <Button type="submit" isDisabled={!hasFormChanged}>
          {t('system.save')}
        </Button>
      </Flex>
    </Flex>
  );
};
