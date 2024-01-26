import {
  Button,
  Card,
  CardHeader,
  CardInput,
  CardSelectWrapper,
  Headline,
  Icon,
  PageHeader,
  Paragraph,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { PrintingMethod, QrType } from '@prisma/client';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as AllLabels } from '../../../assets/icons/all-labels.svg';
import { ReactComponent as QrStack } from '../../../assets/icons/ctsm-qr-bulk.svg';
import { ReactComponent as Digital } from '../../../assets/icons/digital-press-printer.svg';
import { ReactComponent as Flexo } from '../../../assets/icons/flexo.svg';
import { ReactComponent as Industrial } from '../../../assets/icons/industrial-inkjet-printer.svg';
import { ReactComponent as Offset } from '../../../assets/icons/offset-printer.svg';
import { add10Percent, addDelimiter, removeDelimiter } from '../../../helper';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import {
  defaultAddLabelState,
  useGlobalState,
} from '../../InterimContext/ContextProvider';

/**
 *
 * @description Component for selecting and managing various label options in the QR label creation process. It is step 4 out of 5 of the add label flow.
 *
 * @returns {JSX.Element} A JSX element rendering the interface for setting label options.
 *
 * @function LabelOptions
 */
export const LabelOptions = () => {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isOffset = globalState.addLabels.printingMethod === 'OFFSET';
  const isFlexo = globalState.addLabels.printingMethod === 'FLEXO';
  const isDigital = globalState.addLabels.printingMethod === 'DIGITAL';
  const isIndustrial = globalState.addLabels.printingMethod === 'FLEXO_INKJET';

  const togglePrintingMethod = (id: PrintingMethod) => {
    if (globalState.addLabels.printingMethod === id) {
      setGlobalState({
        ...globalState,
        addLabels: { ...globalState.addLabels, printingMethod: null },
      });
    } else {
      const newState = {
        ...globalState,
        addLabels: { ...globalState.addLabels, printingMethod: id },
      };
      if (id === 'OFFSET' || id === 'FLEXO') {
        newState.addLabels.qrType = null;
      }
      setGlobalState(newState);
    }
  };

  const toggleQrType = (id: QrType) => {
    if (globalState.addLabels.qrType === id) {
      setGlobalState({
        ...globalState,
        addLabels: { ...globalState.addLabels, qrType: null },
      });
    } else {
      setGlobalState({
        ...globalState,
        addLabels: { ...globalState.addLabels, qrType: id },
      });
    }
  };

  const showPreview = () =>
    globalState.addLabels.amount &&
    (isOffset ||
      isFlexo ||
      ((isDigital || isIndustrial) && globalState.addLabels.qrType));

  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Box ref={containerRef}>
      <PageHeader
        btnLabel={t('addLabelFlow.connectQrCode')}
        btnRoute={'/labels/add/connect'}
        xRoute={'/labels'}
        onX={() =>
          setGlobalState({ ...globalState, addLabels: defaultAddLabelState })
        }
      />
      <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
        {t('addLabelFlow.labelOptions')}
      </Headline>
      <Card
        input={
          <CardInput
            leftIcon={<AllLabels className={'icon-all-labels'} />}
            input={{
              placeholder: t('addLabelFlow.amountOfLabels'),
              inputValue: globalState.addLabels.amount,
              onChange: e =>
                setGlobalState({
                  ...globalState,
                  addLabels: {
                    ...globalState.addLabels,
                    amount: addDelimiter(e.target.value),
                  },
                }),
            }}
          />
        }
      />
      {!globalState.addLabels.printingMethod && (
        <Subline size={2} fontWeight={FONT_WEIGHT.MEDIUM}>
          {t('addLabelFlow.printingMethod')}
        </Subline>
      )}
      <CardSelectWrapper defaultSelected={globalState.addLabels.printingMethod}>
        {(selected, onCardSelect, prevSelectedCard) => (
          <>
            <Card
              id={'OFFSET'}
              first={prevSelectedCard === 'OFFSET'}
              selected={selected}
              onSelect={(id: PrintingMethod) => {
                onCardSelect(id);
                togglePrintingMethod(id);
              }}
              header={
                <CardHeader
                  genericSlot={<Offset />}
                  rightIcon={
                    selected === 'OFFSET' ? { name: 'edit' } : undefined
                  }
                >
                  {t('addLabelFlow.offset')}
                </CardHeader>
              }
            />
            <Card
              id={'FLEXO' satisfies PrintingMethod}
              first={prevSelectedCard === 'FLEXO'}
              selected={selected}
              onSelect={(id: PrintingMethod) => {
                onCardSelect(id);
                togglePrintingMethod(id);
              }}
              header={
                <CardHeader
                  genericSlot={<Flexo />}
                  rightIcon={
                    selected === 'FLEXO' ? { name: 'edit' } : undefined
                  }
                >
                  {t('addLabelFlow.flexo')}
                </CardHeader>
              }
            />
            <Card
              id={'DIGITAL' satisfies PrintingMethod}
              first={prevSelectedCard === 'DIGITAL'}
              selected={selected}
              onSelect={(id: PrintingMethod) => {
                onCardSelect(id);
                togglePrintingMethod(id);
              }}
              header={
                <CardHeader
                  genericSlot={<Digital />}
                  rightIcon={
                    selected === 'DIGITAL' ? { name: 'edit' } : undefined
                  }
                >
                  {t('addLabelFlow.digital')}
                </CardHeader>
              }
            />
            <Card
              id={'FLEXO_INKJET' satisfies PrintingMethod}
              first={prevSelectedCard === 'FLEXO_INKJET'}
              selected={selected}
              onSelect={(id: PrintingMethod) => {
                onCardSelect(id);
                togglePrintingMethod(id);
              }}
              header={
                <CardHeader
                  genericSlot={<Industrial />}
                  rightIcon={
                    selected === 'FLEXO_INKJET' ? { name: 'edit' } : undefined
                  }
                >
                  {t('addLabelFlow.flexoInkjet')}
                </CardHeader>
              }
            />
          </>
        )}
      </CardSelectWrapper>
      {(isDigital || isIndustrial) && !globalState.addLabels.qrType && (
        <Subline
          className={'add-flow'}
          size={2}
          fontWeight={FONT_WEIGHT.MEDIUM}
        >
          {t('addLabelFlow.qrType')}
        </Subline>
      )}
      {(isDigital || isIndustrial) && (
        <CardSelectWrapper defaultSelected={globalState.addLabels.qrType}>
          {(selected, onCardSelect, prevSelectedCard) => (
            <>
              <Card
                id={'SINGLE' satisfies QrType}
                first={prevSelectedCard === 'SINGLE'}
                selected={selected}
                onSelect={(id: QrType) => {
                  onCardSelect(id);
                  toggleQrType(id);
                }}
                header={
                  <CardHeader
                    leftIcon={<Icon>qr_code_2</Icon>}
                    xlIcon
                    subtitle={
                      selected === 'SINGLE'
                        ? ''
                        : t('addLabelFlow.everyLabelSharesTheSameQrCode')
                    }
                    rightIcon={
                      selected === 'SINGLE' ? { name: 'edit' } : undefined
                    }
                  >
                    {`${t('addLabelFlow.single')} ${
                      selected === 'SINGLE' ? t('addLabelFlow.qrType') : ''
                    }`}
                  </CardHeader>
                }
              />
              <Card
                id={'SERIAL' satisfies QrType}
                first={prevSelectedCard === 'SERIAL'}
                selected={selected}
                onSelect={(id: QrType) => {
                  onCardSelect(id);
                  toggleQrType(id);
                }}
                header={
                  <CardHeader
                    leftIcon={<QrStack />}
                    subtitle={
                      selected === 'SERIAL'
                        ? ''
                        : t('addLabelFlow.everyLabelHasAUniqueQrCode')
                    }
                    rightIcon={
                      selected === 'SERIAL' ? { name: 'edit' } : undefined
                    }
                  >
                    {`${t('addLabelFlow.serial')} ${
                      selected === 'SERIAL' ? t('addLabelFlow.qrType') : ''
                    }`}
                  </CardHeader>
                }
              />
            </>
          )}
        </CardSelectWrapper>
      )}
      {showPreview() && (
        <Box className={'al-preview-container'} mt={'2rem'} pt={'1rem'}>
          <Subline
            className={'add-flow'}
            size={2}
            fontWeight={FONT_WEIGHT.MEDIUM}
          >
            {t('addLabelFlow.preview')}
          </Subline>
          <Card className={'al-preview-card'}>
            <HStack>
              <Flex alignItems={'center'} mr={'1rem'}>
                <AllLabels className={'icon-all-labels'} />
                <Paragraph size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
                  {globalState.addLabels.amount}
                </Paragraph>
              </Flex>
              <Flex alignItems={'center'}>
                {globalState.addLabels.qrType !== 'SERIAL' ? (
                  <Icon className={'icon-preview-qr'}>qr_code_2</Icon>
                ) : (
                  <QrStack className={'icon-preview-qr'} />
                )}
                <Paragraph size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
                  {(isOffset || isFlexo) && '1'}
                  {(isDigital || isIndustrial) &&
                    add10Percent(
                      removeDelimiter(globalState.addLabels.amount),
                      true,
                    )}
                </Paragraph>
              </Flex>
            </HStack>
          </Card>
          {(isDigital || isIndustrial) && (
            <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
              {t(
                'addLabelFlow.10MoreQrCodesAddedByDefaultToCoverPotentialLabelWaste',
              )}
            </Paragraph>
          )}
          <Flex my={'2rem'} justifyContent={'center'}>
            <Button onClick={() => navigate('/labels/add/name')}>
              {t('system.next')}
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
