import {
  Button,
  Headline,
  Input,
  InputContainer,
  InputErrorMessage,
  PageHeader,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Card, Flex, useToast } from '@chakra-ui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@app/client/auth';
import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

export type AccountDataForm = {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
};

export const AccountData = () => {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm<AccountDataForm>();
  const [formIsDisabled, setFormIsDisabled] = useState(false);

  const watchedFields = watch();

  useEffect(() => {
    const updateFormChangeStatus = () => {
      const currentValues = getValues();
      const isEmpty =
        !currentValues.firstName &&
        !currentValues.lastName &&
        !currentValues.email;
      setFormIsDisabled(isEmpty);
    };

    updateFormChangeStatus();
  }, [watchedFields, user]);

  const userUpdateMutation = trpc.user.update.useMutation({
    onSuccess: data => {
      setUser(data.user);
      navigate('/onboarding/company');
    },
    onError: error => {
      /* ToDo better error parsing */
      toast({
        title: t('error.failedToUpdateUserProfile'),
        description: error.message,
        status: 'error',
      });
    },
  });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const handleUserUpdate = async ({
    firstName,
    lastName,
    email,
    companyName,
  }: AccountDataForm) => {
    if (
      firstName !== user?.firstName ||
      lastName !== user?.lastName ||
      email !== user?.email ||
      companyName !== user?.companyName
    ) {
      userUpdateMutation.mutate({
        email,
        firstName,
        lastName,
        companyName,
      });
    } else {
      navigate('/onboarding/company');
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Fragment>
      <PageHeader btnLabel={t('onboarding.welcome')} btnRoute={'/onboarding'} />
      <Flex ref={containerRef} direction={'column'} alignItems={'center'}>
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('onboarding.setUpYourAccount')}
        </Headline>
        <Flex
          as={'form'}
          onSubmit={handleSubmit(handleUserUpdate)}
          direction="column"
          w="100%"
          alignItems="center"
          gap="2rem"
        >
          <Flex direction="column" justifyContent="stretch" w="100%" gap="1rem">
            <Card>
              <InputContainer isInvalid={!!errors.firstName}>
                <Input
                  defaultValue={user?.firstName ?? ''}
                  placeholder={t('account.firstName')}
                  {...register('firstName', {
                    required: t('formMessages.firstNameIsRequired'),
                  })}
                />
                <InputErrorMessage>
                  {errors.firstName?.message}
                </InputErrorMessage>
              </InputContainer>
            </Card>
            <Card>
              <InputContainer isInvalid={!!errors.lastName}>
                <Input
                  defaultValue={user?.lastName ?? ''}
                  placeholder={t('account.lastName')}
                  {...register('lastName', {
                    required: t('formMessages.lastNameIsRequired'),
                  })}
                />
                <InputErrorMessage>
                  {errors.lastName?.message}
                </InputErrorMessage>
              </InputContainer>
            </Card>

            <Card>
              <InputContainer isInvalid={!!errors.email}>
                <Input
                  defaultValue={user?.email ?? ''}
                  placeholder={t('account.workEmail')}
                  {...register('email', {
                    required: t('formMessages.workEmailIsRequired'),
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: t('formMessages.workEmailIsInvalid'),
                    },
                  })}
                />
                <InputErrorMessage>{errors.email?.message}</InputErrorMessage>
              </InputContainer>
            </Card>

            <Card>
              <InputContainer isInvalid={!!errors.companyName}>
                <Input
                  defaultValue={user?.companyName ?? ''}
                  placeholder={t('account.companyName')}
                  {...register('companyName', {})}
                />
                <InputErrorMessage>
                  {errors.companyName?.message}
                </InputErrorMessage>
              </InputContainer>
            </Card>
          </Flex>
          <Button type="submit" isDisabled={formIsDisabled}>
            {t('system.next')}
          </Button>
        </Flex>
      </Flex>
    </Fragment>
  );
};
