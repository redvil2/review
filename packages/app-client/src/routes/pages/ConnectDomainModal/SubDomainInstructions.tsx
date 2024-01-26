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

type SubDomainInstructionsProps = {
  data: { [key: string]: string };
  copyToClipboard: (value: string) => void;
};

export const SubDomainInstructions = ({
  data,
  copyToClipboard,
}: SubDomainInstructionsProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction={'column'} justifyContent={'center'} mt={10}>
      <Subline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
        {t('system.instructions')}
      </Subline>
      <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
        {t('projectPage.domainVerificationInstructions')}
      </Paragraph>
      <Flex mt={4}>
        <Box mr={2}>
          <Icon>info</Icon>
        </Box>
        <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
          {t('projectPage.domainVerificationNote')}
        </Paragraph>
      </Flex>
      <Box mt={4}>
        <Card>
          <VStack mb={4} spacing={1} align={'flex-start'}>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordName')}
            </Paragraph>
            <Box mb={1} className={'value-wrapper'}>
              {data.ownershipName}
            </Box>
            <Button
              leftIcon={<Icon>content_copy</Icon>}
              onClick={() => copyToClipboard(data.ownershipName)}
              variant={'link'}
            >
              {t('system.copy')}
            </Button>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordValue')}
            </Paragraph>
            <Box>
              <Box className={'value-wrapper'} mb={1}>
                {data.ownershipValue}
              </Box>
              <Button
                leftIcon={<Icon>content_copy</Icon>}
                onClick={() => copyToClipboard(data.ownershipValue)}
                variant={'link'}
              >
                {t('system.copy')}
              </Button>
            </Box>
          </VStack>
        </Card>
      </Box>
      <Box mt={8}>
        <Card>
          <VStack mb={4} spacing={1} align={'flex-start'}>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordName')}
            </Paragraph>
            <Box mb={1} className={'value-wrapper'}>
              {data.certificateName}
            </Box>
            <Button
              leftIcon={<Icon>content_copy</Icon>}
              onClick={() => copyToClipboard(data.certificateName)}
              variant={'link'}
            >
              {t('system.copy')}
            </Button>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordValue')}
            </Paragraph>
            <Box>
              <Box mb={1} className={'value-wrapper'}>
                {data.certificateValue}
              </Box>
              <Button
                leftIcon={<Icon>content_copy</Icon>}
                onClick={() => copyToClipboard(data.certificateValue)}
                variant={'link'}
              >
                {t('system.copy')}
              </Button>
            </Box>
          </VStack>
        </Card>
      </Box>
      <Box mt={8}>
        <Card>
          <VStack mb={4} spacing={1} align={'flex-start'}>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordName')}
            </Paragraph>
            <Box mb={1} className={'value-wrapper'}>
              {data.redirectName}
            </Box>
            <Button
              leftIcon={<Icon>content_copy</Icon>}
              onClick={() => copyToClipboard(data.redirectName)}
              variant={'link'}
            >
              {t('system.copy')}
            </Button>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.MEDIUM}>
              {t('projectPage.cnameRecordValue')}
            </Paragraph>
            <Box>
              <Box mb={1} className={'value-wrapper'}>
                {data.redirectValue}
              </Box>
              <Button
                leftIcon={<Icon>content_copy</Icon>}
                onClick={() => copyToClipboard(data.redirectValue)}
                variant={'link'}
              >
                {t('system.copy')}
              </Button>
            </Box>
          </VStack>
        </Card>
      </Box>
    </Flex>
  );
};
