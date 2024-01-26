import {
  Button,
  Input,
  InputAddon,
  InputContainer,
  InputField,
  useModularDropdown,
  InputErrorMessage,
  Loader,
} from '@app/shared/ui/components';
import { Flex, Card, useToast, HStack } from '@chakra-ui/react';
import callingCodes from 'country-calling-code';
import * as Flags from 'country-flag-icons/react/3x2';
import { sortBy, uniqBy } from 'lodash';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type CodeForm = {
  recipientNumber: string;
  smsCode: string;
};

export type CodeFormProps = {
  onSubmit: (code: string) => void;
  onSendCode: (mobileNumber: string) => void;
  isSubmitting: boolean;
  sent: boolean;
};

const codes = sortBy(
  uniqBy(callingCodes, 'countryCodes[0]'),
  'countryCodes[0]',
);

const menuItems = codes.map(codeItem => {
  const Flag = Flags[codeItem.isoCode2];
  return {
    id: codeItem.country,
    name: (
      <HStack align="baseline" spacing={1}>
        <div>+{codeItem.countryCodes[0]}</div>
        <div style={{ width: '1.2rem' }}>
          <Flag />
        </div>
        <div>{codeItem.country}</div>
      </HStack>
    ),
  };
});

export const CodeForm: FC<CodeFormProps> = ({
  sent,
  onSendCode,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<{ country: string; mobileNumber: string; code?: string }>();

  const { t } = useTranslation();

  const handleSendCode = () => {
    const values = getValues();
    const country = codes.find(({ country }) => country === values.country);
    if (country) {
      onSendCode(`${country.countryCodes[0]}${values.mobileNumber}`);
    } else {
      toast({
        title: t('formMessages.internalFormError'),
        status: 'error',
      });
    }
  };

  const { dropdown, menu: dropdownMenu } = useModularDropdown({
    menuItems,
    defaultItem: menuItems.find(({ id }) => id === 'China'),
    onChange: ({ id }) => {
      setValue('country', id as string);
    },
    displayValue: id => {
      const country = codes.find(item => id === item.country);
      if (!country) return '';
      return country.isoCode2;
    },
  });
  const toast = useToast();

  return (
    <Flex
      as={'form'}
      align="center"
      direction="column"
      gap="9"
      w="100%"
      onSubmit={handleSubmit(({ code }) => {
        if (!sent) handleSendCode();
        else onSubmit(code as string);
      })}
    >
      <Flex direction="column" gap="3" w="100%">
        <Card>
          <InputField>
            <InputAddon>{dropdown}</InputAddon>
            <InputContainer isInvalid={!!errors.mobileNumber}>
              <Input
                autoFocus
                placeholder={t('account.mobileNumber')}
                {...register('mobileNumber', {
                  required: t('formMessages.mobileNumberIsRequired'),
                  pattern: {
                    value: /^\d+$/,
                    message: t('formMessages.mobileNumberIsInvalid'),
                  },
                })}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    e.preventDefault();
                    handleSendCode();
                  }
                }}
              />
              <InputErrorMessage>
                {errors.mobileNumber?.message}
              </InputErrorMessage>
            </InputContainer>
          </InputField>
          {dropdownMenu}
        </Card>
        {sent ? (
          <Card>
            <InputContainer isInvalid={!!errors.code}>
              <Input
                autoFocus
                placeholder={t('signin.enterCode')}
                {...register('code', {
                  required: t('formMessages.codeIsRequired'),
                })}
              />
              <InputErrorMessage>{errors.code?.message}</InputErrorMessage>
            </InputContainer>
          </Card>
        ) : null}
      </Flex>
      {isSubmitting ? (
        <Loader />
      ) : (
        <Flex direction="column" gap="8">
          <Button type="submit" isDisabled={!isValid}>
            {t(sent ? 'system.submit' : 'signin.sendCode')}
          </Button>
          {sent ? (
            <Button type="button" variant="link" onClick={handleSendCode}>
              {t('signin.resendCode')}
            </Button>
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};
