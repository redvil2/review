import {
  Icon,
  PageHeader,
  PageHeadline,
  PageSectionLabel,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Button, VStack } from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useCopyToClipboard } from '@app/client/hooks/useCopyToClipboard';
import { useSequentialFadeIn } from '@app/client/hooks/useSequentialFadeIn';
import {
  rootEmailText,
  subEmailText,
} from '@app/client/routes/pages/ConnectDomain/copyEmail';
import { RootDomainInstructions } from '@app/client/routes/pages/ConnectDomain/RootDomainInstructions';
import { StyledConnectDomain } from '@app/client/routes/pages/ConnectDomain/StyledConnectDomain';
import { SubDomainInstructions } from '@app/client/routes/pages/ConnectDomain/SubDomainInstructions';
import { trpc } from '@app/client/trpc';

export const ConnectDomainPage = () => {
  const { domainId } = useParams();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const copyToClipboard = useCopyToClipboard();

  const { data: domainData, isLoading } = trpc.domainName.getById.useQuery({
    id: Number(domainId),
  });

  const handleCopy = async () => {
    if (domainData?.domainName.nameServers.length) {
      await copyToClipboard(
        rootEmailText({
          domainName: domainData?.domainName.value,
          name1: domainData?.domainName.nameServers[0],
          name2: domainData?.domainName.nameServers[1],
          name3: domainData?.domainName.nameServers[2],
          name4: domainData?.domainName.nameServers[3],
        }),
      );
    } else {
      await copyToClipboard(
        subEmailText({
          domainName: domainData?.domainName.value,
          cname1: domainData?.domainName.validationRecordName,
          cvalue1: domainData?.domainName.validationRecordValue,
          cname2: domainData?.domainName.value,
          cvalue2: domainData?.domainName.cnameRecord,
        }),
      );
    }
  };

  useSequentialFadeIn(containerRef);

  return (
    <StyledConnectDomain>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnRoute={'/settings/domains'}
          btnLabel={t('system.back')}
        />
        <PageHeadline>
          {t('connectDomainPage.connectDomain', {
            newline: '\n',
            domainName: domainData?.domainName.value,
          })}
        </PageHeadline>
        <VStack gap={6} mb={'1.75rem'}>
          <Paragraph
            size={2}
            fontWeight={FONT_WEIGHT.MEDIUM}
            textAlign={'center'}
          >
            {t('connectDomainPage.description')}
          </Paragraph>
          <Button
            leftIcon={<Icon>content_copy</Icon>}
            onClick={() => handleCopy()}
          >
            {t('connectDomainPage.copyInstructions')}
          </Button>
        </VStack>
        <PageSectionLabel>
          {t('connectDomainPage.howToConnect')}
        </PageSectionLabel>
        {!isLoading && domainData?.domainName.nameServers.length ? (
          <RootDomainInstructions domain={domainData?.domainName} />
        ) : domainData?.domainName ? (
          <SubDomainInstructions domain={domainData?.domainName} />
        ) : null}
      </PageWrapper>
    </StyledConnectDomain>
  );
};
