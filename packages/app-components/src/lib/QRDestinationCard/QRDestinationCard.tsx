import {
  Card,
  FormErrorMessage,
  Icon,
  ResizableTextArea,
  validateUrl,
} from '@app/shared/ui/components';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { ChangeEvent, Ref, forwardRef, useCallback, useState } from 'react';
import {
  FieldErrors,
  FieldError,
  UseFormRegister,
  Path,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { StyledQrDestination } from './QRDestinationCard.style';

export const registerDestinationInput = <T extends { target: string }>(
  register: UseFormRegister<T>,
  errors: FieldErrors<T>,
) => {
  const field = register('target' as Path<T>, {
    validate: (value: string) =>
      value === '' ? undefined : validateUrl(value),
  });

  return {
    ...field,
    error: errors?.target,
  };
};

export const QRDestinationCard = forwardRef(
  (
    {
      onChange,
      name,
      onBlur,
      error,
    }: {
      name?: string;
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
      onBlur: (e: ChangeEvent<HTMLTextAreaElement>) => void;
      error: FieldError | undefined;
    },
    ref: Ref<HTMLTextAreaElement>,
  ) => {
    const { t } = useTranslation();
    const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
    const refWrapper = useCallback(
      (e: HTMLTextAreaElement | null) => {
        if (typeof ref === 'function') {
          ref(e);
        }
        if (e !== null) {
          setIsEmpty(e.value === '');
        } else {
          setIsEmpty(null);
        }
      },
      [setIsEmpty, ref],
    );
    const onChangeWrapper = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e);
        if (e.target.value === '') {
          setIsEmpty(true);
        } else if (isEmpty) {
          setIsEmpty(false);
        }
      },
      [isEmpty, onChange, setIsEmpty],
    );

    return (
      <StyledQrDestination
        $isEmpty={isEmpty}
        mt={4}
        className={'al-connect-qr-destination'}
      >
        <Card>
          <HStack align="center" spacing={4}>
            <Icon className="__left-icon">subdirectory_arrow_right</Icon>
            <VStack
              align="flex-start"
              justify="stretch"
              spacing={0}
              flexGrow={1}
            >
              <Box>
                <span className={'card-input__text-field'}>
                  <label>{t('addLabelFlow.qrDestination')}</label>
                </span>
              </Box>
              <ResizableTextArea
                {...{ onBlur, onChange, name }}
                ref={refWrapper}
                onChange={onChangeWrapper}
                placeholder={`${t(
                  'addLabelFlow.example',
                )} https://www.mywebsite.com`}
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </VStack>
          </HStack>
        </Card>
      </StyledQrDestination>
    );
  },
);
