import {
  Headline,
  PageHeader,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, ListItem, UnorderedList, useColorMode } from '@chakra-ui/react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledPrivacyPage } from './StyledPrivacyPage';

export const PrivacyPage = () => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledPrivacyPage $colorMode={colorMode}>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={t('system.back')}
          onBtnClick={() => navigate(-1)}
        />
        <Box mt={8} mb={10}>
          <Headline
            size={3}
            fontWeight={FONT_WEIGHT.SEMI_BOLD}
            textAlign={'center'}
          >
            Privacy Policy
          </Headline>
        </Box>
        <Box mb={10}>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            Thank you for visiting our website. The protection of your personal
            data is important to us. In this Policy, we would like to inform you
            about how we handle your data in accordance with Art. 13 of the
            General Data Protection Regulation (GDPR). <br />
            Here you will find our privacy policy for the social media pages we
            use: Privacy policy for our social media pages - see below
            <br />
            <br />
            <b>
              Information about the responsible party (referred to as the
              “controller” in the GDPR)
            </b>
            <br />
            The data processing controller on this website is:
            <br />
            <br />
            All4Labels Group GmbH <br />
            Möllner Landstraße 15, 22969 Witzhave Germany <br />
            Phone: +49 (0)4104 / 693-0 <br />
            Fax: +49 (0)4104 / 693-110 <br />
            E-mail: <a href="mailto:info@all4labels.com">
              info@all4labels.com
            </a>{' '}
            <br />
            <br />
            The controller is the natural person or legal entity that
            single-handedly or jointly with others makes decisions as to the
            purposes of and resources for the processing of personal data (e.g.
            names, e-mail addresses, etc.).
            <br />
            <br />
            <b>Designation of a data protection officer as mandated by law</b>
            <br />
            We have appointed a data protection officer for our company:
            <br />
            <br />
            datenschutz nord GmbH
            <br />
            Sechslingspforte 2 22087 Hamburg (Deutschland)
            <br />
            Telefon: +49 (0)40 – 593 616 0400
            <br />
            E-Mail:dataprotection@qrmarketing.com
            <br />
            <br />
            <b>Usage Data</b>
            <br />
            When you visit our website, our web server temporarily evaluates
            usage data for statistical purposes in order to improve the quality
            of our website. This data consists of the following data categories:
            <br />
            <UnorderedList>
              <ListItem>
                the name and address of the requested content,
              </ListItem>
              <ListItem>the date and time of the query,</ListItem>
              <ListItem>of the transferred data volume,</ListItem>
              <ListItem>
                the access status (content transferred, content not found),
              </ListItem>
              <ListItem>
                the description of the used web browser and operating system,
              </ListItem>
              <ListItem>
                the referral link, which indicates from which page you reached
                ours,
              </ListItem>
              <ListItem>
                the IP address of the requesting computer, which is shortened in
                such a way that a personal reference can no longer be
                established.
              </ListItem>
            </UnorderedList>
            <br />
            The above-mentioned log data will only be evaluated anonymously.
            <br />
            <br />
            <b>Necessary Cookies</b>
            <br />
            We do not use cookies.
            <br />
            <b>Contact Form</b>
            <br />
            You may contact us via our contact form. In order to use our contact
            form, we will require you to provide the data marked as mandatory.
            <br />
            The legal basis for this processing is Art. 6 (1) (f) GDPR, being
            our legitimate interest to respond to your request. Your data will
            only be used to process your request. We delete your data if they
            are no longer required and there are no legal obligations to retain
            them. Where the processing of your data is based on legitimate
            interest in accordance with Art. 6 (1) (f) GDPR, you have the right
            to object to that processing at any time. To do so, please use the
            email address provided in the imprint.
            <br />
            <br />
            <b>Storage Period</b>
            <br />
            Unless otherwise specified, we will delete your personal data if
            they are no longer required for the relevant processing purposes and
            no legal retention obligations oppose deletion.
            <br />
            <br />
            <b>Data Processors</b>
            <br />
            We transfer your data to service providers who support us in the
            operation of our websites and related processes. These service
            providers are usually data processors within the meaning of Art. 28
            GDPR. Our service providers are strictly bound by contracts and our
            instructions.
            <br />
            Any processors who may not have been previously disclosed are listed
            below. If data is transferred outside the EU or the EEA, we will
            also provide information on the adequate level of data protection.
            <br />
            Service Provider/Processor: Amazon Web; Purpose: Webhosting;
            Adequate level of data protection: Processing within EU/EEA
            <br />
            <br />
            <b>Your rights as a data subject</b>
            <br />
            When processing your personal data, the GDPR grants you certain
            rights as a data subject:
            <br />
            <br />
            Right of access by the data subject (Art. 15 GDPR)
            <br />
            You have the right to obtain confirmation as to whether personal
            data concerning you are being processed; if this is the case, you
            have the right to be informed of this personal data and to receive
            the information specified in Art. 15 GDPR.
            <br />
            <br />
            Right to rectification (Art. 16 GDPR)
            <br />
            You have the right to rectification of inaccurate personal data
            concerning you and, taking into account the purposes of the
            processing, the right to have incomplete personal data completed,
            including by means of providing a supplementary statement without
            delay.
            <br />
            <br />
            Right to erasure (Art. 17 GDPR)
            <br />
            You have the right to obtain the erasure of personal data concerning
            you without undue delay if one of the reasons listed in Art. 17 GDPR
            applies.
            <br />
            <br />
            Right to restriction of processing (Art. 18 GDPR)
            <br />
            You have the right to request the restriction of processing if one
            of the conditions listed in Art. 18 GDPR is met, e.g. if you have
            objected to the processing, for the duration of our examination.
            <br />
            <br />
            Right to data portability (Art. 20 GDPR)
            <br />
            In certain cases, which are listed in detail in Art. 20 GDPR, you
            have the right to receive the personal data concerning you in a
            structured, commonly used and machine-readable format, or to request
            that this data be transferred to a third party.
            <br />
            <br />
            Right to withdraw consent (Art. 7 GDPR)
            <br />
            If the processing of data is based on your consent, you are entitled
            to withdraw your consent to the use of your personal data at any
            time in accordance with Art. 7 (3) GDPR. Please note that the
            withdrawal is only effective for the future. Processing that took
            place before the withdrawal is not affected.
            <br />
            <br />
            Right to object (Art. 21 GDPR)
            <br />
            If data is collected on the basis of Art. 6 (1) 1 f GDPR (data
            processing for the purpose of our legitimate interests) or on the
            basis of Art. 6 (1) 1 e GDPR (data processing for the purpose of
            protecting public interests or in the exercise of official
            authority), you have the right to object to the processing at any
            time for reasons arising from your particular situation. We will
            then no longer process the personal data unless there are compelling
            legitimate grounds for the processing which override your interests,
            rights and freedoms or if data is still needed for the
            establishment, exercise or defence of legal claims.
            <br />
            <br />
            Right to lodge a complaint with a supervisory authority (Art. 77
            GDPR)
            <br />
            According to Art. 77 GDPR, you have the right to lodge a complaint
            with a supervisory authority if you believe that the processing of
            your data violates data protection regulations. This right may be
            asserted in particular with a supervisory authority in the Member
            State of your habitual residence, your place of work or the place of
            the suspected infringement.
            <br />
            <br />
            Asserting your rights
            <br />
            Unless otherwise described above, please contact us to assert your
            rights. You will find our contact details in our imprint.
            <br />
            <br />
            <b>Contact details for the data protection representative</b>
            <br />
            Our external data protection officer is available to provide you
            with information on data protection.
            <br />
            Please contact:
            <br />
            <br />
            datenschutz nord GmbH Sechslingspforte 2, 22087 Hamburg
            (Deutschland)
            <br />
            Phone: +49 (0)40 – 593 616 0400
            <br />
            Web: <a href="www.dsn-group.de">www.dsn-group.de</a>
            <br />
            E-Mail:{' '}
            <a href="mailto:office@datenschutz-nord.de">
              office@datenschutz-nord.de
            </a>
            <br />
            Please contact first:
            <br />
            E-Mail:{' '}
            <a href="mailto:dataprotection@qrmarketing.com">
              dataprotection@qrmarketing.com
            </a>
            <br />
            <br />
            If you contact our data protection officer, please also indicate the
            responsible office mentioned in the legal notice.
            <br />
          </Paragraph>
        </Box>
      </PageWrapper>
    </StyledPrivacyPage>
  );
};
