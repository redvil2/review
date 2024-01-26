import {
  PageWrapper,
  Headline,
  Button,
  Icon,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Flex, useColorMode } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledImprint } from './StyledImprint';

export const ImprintPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledImprint $colorMode={colorMode}>
      <PageWrapper>
        <Flex ref={containerRef} direction="column" alignItems="center">
          <Button
            className="btn-back"
            variant="link"
            leftIcon={<Icon>keyboard_backspace</Icon>}
            onClick={() => navigate('/labels')}
          >
            {t('system.allLabels')}
          </Button>
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('system.imprint')}
          </Headline>
          <Flex direction="column" gap={5}>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Website provider
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              All4Labels Group GmbH
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Moellner Landstraße 15, 22969 Witzhave, Germany
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Phone: +49 (0)4104 / 693-0
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Fax: +49 (0)4104 / 693-110
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Email: info@all4labels.com
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Represented by the managing directors: Magnus Milatz, Gunnar
              Zuehlke, Dr. Guenther Weymans
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Registration court and registration number: Luebeck HRB 289 AH,
              VAT ID no. DE 135 110 146
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              For journalistic-editorial content according to § 18 Guenther
              Weymans responsible.Responsible in the sense of § 18 paragraph 2
              Media State Treaty: Dr. Guenther Weymans, Moellner Landstrasse 15,
              22969 Witzhave, Germany
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Copyright
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              The content, such as B. Texts and photos on this website are
              protected by copyright. Reproduction of this content, in whole or
              in part, in any form on any medium without the prior express
              permission of All4Labels Group GmbH is prohibited.
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Privacy policy for the website
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              The data protection declaration of All4Labels Group GmbH can be
              found under data protection declaration
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              External links
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              All4Labels Group GmbH is not responsible for the content of
              external websites. The respective providers are responsible for
              the content of third parties accessed via hyperlinks.
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              Out-of-court dispute resolution in consumer matters
            </Paragraph>
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              According to applicable law, All4Labels Group GmbH is obliged to
              inform consumers of the existence of the European online dispute
              resolution platform, which was set up by the EU Commission to
              resolve disputes. The European online dispute resolution platform
              can be found here . Contact details of the official dispute
              resolution bodies can be found under the following link:
              https://webgate.ec.europa.eu/odr/main/index.cfm . In the absence
              of a legal obligation to participate in dispute settlement
              proceedings before a consumer arbitration board, All4Labels Group
              GmbH is neither obliged nor willing to participate in such dispute
              settlement proceedings. The e-mail address of All4Labels Group
              GmbH can be found above
            </Paragraph>
          </Flex>
        </Flex>
      </PageWrapper>
    </StyledImprint>
  );
};
