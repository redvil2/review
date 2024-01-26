import { Paragraph } from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Container, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { StyledImprint } from './StyledImprint';

export const ImprintContent = () => {
  const { colorMode } = useColorMode();

  return (
    <StyledImprint $colorMode={colorMode}>
      <Container>
        <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
          <b>Provider of the website</b>
          <br />
          <b>All4Labels Group GmbH</b>
          <br />
          Möllner Landstrasse 15, 22969 Witzhave Germany <br />
          Phone: +49 (0)4104 / 693-0 <br />
          Fax: +49 (0)4104 / 693-110 <br />
          E-Mail: <a href="mailto:info@all4labels.com">info@all4labels.com</a>
          <br />
          <br />
          Represented by the Managing Directors: Magnus Milatz, Gunnar Zühlke,
          Dr. Günther Weymans
          <br />
          Register court and register number: Lübeck HRB 289 AH, VAT number DE
          135 110 146
          <br />
          Responsible person according to Section 18 para. 2 of the German State
          Media Treaty (“Mediendienstestaatsvertrag”): Dr. Günther Weymans,
          Möllner Landstraße 15, 22969 Witzhave, Germany
          <br />
          <br />
          <b>Copyright</b>
          <br />
          The content, such as texts and photos, of this website is protected by
          copyright law. Reproduction of this content in whole or in part is
          prohibited in any form on any medium without the prior express
          permission of All4Labels Group GmbH.
          <br />
          <br />
          <b>Privacy policy for the website</b>
          <br />
          The privacy policy of All4Labels Group GmbH can be found at{' '}
          <a href="https://all4labels.com/wp-content/uploads/2022/09/2022-All4Labels_Privacy-policy_Website.pdf">
            privacy policy
          </a>
          .
          <br />
          <br />
          <b>External links</b>
          <br />
          All4Labels Group GmbH is not responsible for the content of external
          websites. The respective providers are responsible for the content of
          third parties accessed via hyperlinks.
          <br />
          <br />
          <b>Out-of-court dispute resolution in consumer matters</b>
          <br />
          According to applicable law, All4Labels Group GmbH is obliged to
          inform consumers about the existence of the European Online Dispute
          Resolution Platform, which has been set up by the EU Commission for
          the resolution of disputes. The European Online Dispute Resolution
          Platform can be found{' '}
          <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.chooseLanguage">
            here
          </a>
          . Contact details of the official dispute resolution bodies can be
          found under the following link:{' '}
          <a href="https://webgate.ec.europa.eu/odr/main/index.cfm">
            https://webgate.ec.europa.eu/odr/main/index.cfm
          </a>
          . In the absence of a legal obligation to participate in dispute
          resolution proceedings before a consumer arbitration board, All4Labels
          Group GmbH is not obliged or willing to participate in such dispute
          resolution proceedings. <br />
          The e-mail address of All4Labels Group GmbH can be found above.
          <br />
          <br />
          <b>Social media profiles</b>
          <br />
          This imprint also applies to the following social media profiles
          operated by All4Labels Group GmbH: <br />
          Linkedin: <br />
          <a href="https://www.linkedin.com/company/all4labelsgroup/">
            https://www.linkedin.com/company/all4labelsgroup/
          </a>{' '}
          <br />
          Xing: <br />
          <a href="https://www.xing.com/pages/all4labels-globalpackaginggroup">
            https://www.xing.com/pages/all4labels-globalpackaginggroup
          </a>{' '}
          <br />
          Instagram: <br />
          <a href="https://www.instagram.com/lifeatall4labels/">
            https://www.instagram.com/lifeatall4labels/
          </a>
        </Paragraph>
      </Container>
    </StyledImprint>
  );
};
