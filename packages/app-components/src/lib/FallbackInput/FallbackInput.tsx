import {
  Card,
  FormErrorMessage,
  Icon,
  Paragraph,
  ResizableTextArea,
  Switch,
  validateUrl,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import {
  Control,
  FieldError,
  FieldErrors,
  Path,
  useController,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FallbackWrapper } from './fallbackInput.style';

const DEFAULT_FALLBACK_URL = `${import.meta.env.VITE_CORE_WEB_URL}/fallback`;

export const useFallbackInput = <T extends { fallback: string | null }, C>(
  control: Control<T, C>,
  errors: FieldErrors<T>,
) => {
  const { field } = useController({
    name: 'fallback' as Path<T>,
    control,
    rules: {
      validate: value => (value === null ? undefined : validateUrl(value)),
    },
  });
  return { ...field, error: errors?.fallback };
};

export const FallbackInput = ({
  value,
  onChange,
  onBlur,
  name,
  error,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  onBlur: () => void;
  name: string;
  error: FieldError | undefined;
}) => {
  const [showError, setShowError] = useState(false);
  const { t } = useTranslation();
  return (
    <FallbackWrapper>
      <Box mb={4} mt={8}>
        <VStack>
          <HStack width="100%" justifyContent="space-between">
            <Paragraph size={1} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
              Add Custom Fallback Link
            </Paragraph>
            <Switch
              isChecked={value !== null}
              onChange={({ target: { checked } }) => {
                onChange(checked ? '' : null);
              }}
            />
          </HStack>
          <Paragraph
            className={'al-fallback-annotation'}
            size={1}
            fontWeight={FONT_WEIGHT.REGULAR}
          >
            In case your target URL is down or empty, we redirect to a fallback
            URL: {DEFAULT_FALLBACK_URL}
          </Paragraph>
        </VStack>
      </Box>
      {value !== null ? (
        <Card
          className="__fallback-input"
          input={
            <HStack>
              <Icon className="__left-icon">alt_route</Icon>
              <VStack spacing={0} width="100%" alignItems="flex-start">
                <ResizableTextArea
                  {...{ name, value, onBlur }}
                  onChange={({ target: { value } }) => {
                    onChange(value);
                  }}
                  onBlur={() => {
                    setShowError(error !== undefined);
                  }}
                  onInput={() => {
                    setShowError(true);
                  }}
                  placeholder={t('addLabelFlow.fallbackLink')}
                />
                <FormErrorMessage>
                  {showError && error?.message}
                </FormErrorMessage>
              </VStack>
            </HStack>
          }
        />
      ) : null}
    </FallbackWrapper>
  );
};
