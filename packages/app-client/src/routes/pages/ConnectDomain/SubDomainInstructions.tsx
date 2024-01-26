import {
  Card,
  Icon,
  Micro,
  Paragraph,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCopyToClipboard } from '@app/client/hooks/useCopyToClipboard';

export const SubDomainInstructions = ({ domain }) => {
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard();
  return (
    <VStack>
      <Paragraph
        size={2}
        fontWeight={FONT_WEIGHT.REGULAR}
        textAlign={'left'}
        className={'al-text'}
      >
        {t('connectDomainPage.subDescription')}
      </Paragraph>
      <Card>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.cnameRecordName')}
        </Paragraph>
        <HStack justifyContent={'space-between'} mb={4}>
          <Subline
            size={2}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            className={'al-value-wrapper'}
          >
            {domain.validationRecordName}
          </Subline>
          <Icon
            className={'al-icon'}
            onClick={() => copyToClipboard(domain.validationRecordName)}
          >
            content_copy
          </Icon>
        </HStack>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.cnameRecordValue')}
        </Paragraph>
        <HStack justifyContent={'space-between'}>
          <Subline
            size={2}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            className={'al-value-wrapper'}
          >
            {domain.validationRecordValue}
          </Subline>
          <Icon
            className={'al-icon'}
            onClick={() => copyToClipboard(domain.validationRecordValue)}
          >
            content_copy
          </Icon>
        </HStack>
      </Card>
      <Card>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.cnameRecordName')}
        </Paragraph>
        <HStack justifyContent={'space-between'} mb={4}>
          <Subline
            size={2}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            className={'al-value-wrapper'}
          >
            {domain.value}
          </Subline>
          <Icon
            className={'al-icon'}
            onClick={() => copyToClipboard(domain.value)}
          >
            content_copy
          </Icon>
        </HStack>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.cnameRecordValue')}
        </Paragraph>
        <HStack justifyContent={'space-between'}>
          <Subline
            size={2}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            className={'al-value-wrapper'}
          >
            {domain.cnameRecord}
          </Subline>
          <Icon
            className={'al-icon'}
            onClick={() => copyToClipboard(domain.cnameRecord)}
          >
            content_copy
          </Icon>
        </HStack>
      </Card>
      <HStack
        alignItems={'flex-start'}
        mt={2}
        justifyContent={'flex-start'}
        w={'100%'}
      >
        <Icon className={'al-footer-icon'}>privacy_tip</Icon>
        <Micro fontWeight={FONT_WEIGHT.REGULAR}>
          {t('connectDomainPage.subPrivacyTip')}
        </Micro>
      </HStack>
    </VStack>
  );
};
