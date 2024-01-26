import {
  Card,
  CardHeader,
  Headline,
  PageHeader,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box } from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as QrCode } from '../../../assets/icons/qr-code.svg';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import {
  defaultAddLabelState,
  useGlobalState,
} from '../../InterimContext/ContextProvider';

/**
 * @description Component for selecting the type of label in the QR label creation process. It is step 1 of 5.
 *
 * @returns {JSX.Element} A JSX element rendering the interface for selecting the label type.
 *
 * @function SelectType
 */
export const SelectType = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Box ref={containerRef}>
      <PageHeader
        btnLabel={t('system.allLabels')}
        btnRoute={'/labels'}
        xRoute={'/labels'}
        onX={() =>
          setGlobalState({ ...globalState, addLabels: defaultAddLabelState })
        }
      />
      <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
        {t('addLabelFlow.selectType')}
      </Headline>
      <Card
        onClick={() => navigate('/labels/add/edit')}
        header={
          <CardHeader genericSlot={<QrCode />}>
            {t('addLabelFlow.qrCode')}
          </CardHeader>
        }
      />
    </Box>
  );
};
