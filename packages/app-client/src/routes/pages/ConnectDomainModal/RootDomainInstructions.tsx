import {
  Button,
  Card,
  Icon,
  Paragraph,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type RootDomainInstructionsProps = {
  data: { [key: string]: string | string[] };
  copyToClipboard: (value: string) => void;
};
export const RootDomainInstructions = ({
  data,
  copyToClipboard,
}: RootDomainInstructionsProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction={'column'} justifyContent={'center'} mt={10}>
      <Subline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
        {t('system.instructions')}
      </Subline>
      <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
        {t('projectPage.domainVerificationNameserverInstructions')}
      </Paragraph>
      <Flex mt={4} mb={4}>
        <Box mr={2}>
          <Icon>info</Icon>
        </Box>
        <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.domainVerificationNameserverNote')}
        </Paragraph>
      </Flex>
      <Card>
        <VStack mb={4} spacing={1} align={'flex-start'}>
          <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}></Paragraph>
          {(data?.hostedZoneNameServers as string[])?.map(
            (nameServer: string) => (
              <Flex gap={4} key={nameServer}>
                {nameServer}
                <Button
                  leftIcon={<Icon>content_copy</Icon>}
                  onClick={() => copyToClipboard(nameServer)}
                  variant={'link'}
                />
              </Flex>
            ),
          )}
        </VStack>
      </Card>
    </Flex>
  );
};
