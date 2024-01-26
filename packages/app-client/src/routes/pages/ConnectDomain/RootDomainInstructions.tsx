import {
  Card,
  CardHeader,
  Icon,
  Micro,
  PageSectionLabel,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCopyToClipboard } from '@app/client/hooks/useCopyToClipboard';

export const RootDomainInstructions = ({ domain }) => {
  const copyToClipboard = useCopyToClipboard();
  const { t } = useTranslation();
  return (
    <VStack>
      <Paragraph
        size={2}
        fontWeight={FONT_WEIGHT.REGULAR}
        textAlign={'left'}
        className={'al-list'}
      >
        <ol>
          <li>{t('connectDomainPage.listElem1')}</li>
          <li>{t('connectDomainPage.listElem2')}</li>
        </ol>
      </Paragraph>
      <PageSectionLabel>
        {t('connectDomainPage.NameFieldValue')}
      </PageSectionLabel>
      {domain.nameServers.map(serverName => (
        <Card
          header={
            <CardHeader
              rightIcon={{
                name: 'content_copy',
                onClick: () => copyToClipboard(serverName),
              }}
            >
              {serverName}
            </CardHeader>
          }
        />
      ))}
      <HStack alignItems={'flex-start'} mt={2} w={'100%'}>
        <Icon className={'al-footer-icon'}>privacy_tip</Icon>
        <Micro fontWeight={FONT_WEIGHT.REGULAR}>
          {t('connectDomainPage.rootPrivacyTip')}
        </Micro>
      </HStack>
    </VStack>
  );
};
