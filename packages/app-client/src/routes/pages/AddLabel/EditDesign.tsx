import { DropdownCard } from '@app/core/web/ui';
import {
  Button,
  Card,
  CardHeader,
  CardInput,
  Headline,
  Icon,
  PageHeader,
  Paragraph,
  Subline,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, useToast } from '@chakra-ui/react';
import cn from 'classnames';
import React, { ChangeEvent, MouseEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as QrCodeSquare } from '../../../assets/icons/qr-code-square.svg';
import { ReactComponent as QrCode } from '../../../assets/icons/qr-code.svg';
import { DownloadFormat, Shape } from '../../../constants';
import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';
import {
  defaultAddLabelState,
  useGlobalState,
} from '../../InterimContext/ContextProvider';

const downloadFormats: { id: DownloadFormat; name: string }[] = [
  { name: 'PNG', id: 'PNG' },
  /**
   * Disable dropdown menu for export format until implemented on backend.
   * TODO: Uncomment when functionality available
   * { name: 'PDF', id: 'PDF' },
   * { name: 'SVG', id: 'SVG' },
   * */
];

/**
 * @description This component allows users to customize the design of a QR code. It is step 2 out of 5 of the add label flow.
 *
 * @returns {JSX.Element} A JSX element rendering the QR code design editing interface.
 *
 * @function EditDesign
 */
export const EditDesign = () => {
  const [isColorValid, setColorValid] = useState(true);
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const imageUploadRef = React.useRef<HTMLInputElement>(null);
  const toast = useToast();

  const isValidHexColor = (color: string) => {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleImageUploadClick = () => {
    imageUploadRef.current?.click();
  };

  const shapes: { name: string; id: Shape }[] = [
    { name: t('addLabelFlow.round'), id: 'ROUND' },
    { name: t('addLabelFlow.square'), id: 'SQUARE' },
  ];

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGlobalState({
          ...globalState,
          addLabels: {
            ...globalState.addLabels,
            image: {
              name: file.name,
              dataUri: reader.result as string,
            },
          },
        });
      };

      reader.onerror = () => {
        toast({
          title: 'An error occurred reading the file:',
          description: String(reader.error),
          status: 'error',
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const resetUploadedImage = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (imageUploadRef.current?.value) {
      imageUploadRef.current.value = '';
    }
    setGlobalState({
      ...globalState,
      addLabels: {
        ...globalState.addLabels,
        image: null,
      },
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <Box ref={containerRef}>
      <PageHeader
        btnLabel={t('addLabelFlow.selectType')}
        btnRoute={'/labels/add'}
        xRoute={'/labels'}
        onX={() =>
          setGlobalState({ ...globalState, addLabels: defaultAddLabelState })
        }
      />
      <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
        {t('addLabelFlow.editQrCodeDesign')}
      </Headline>
      <Flex direction={'column'} alignItems={'center'} mb={'3rem'}>
        <Subline
          className={'add-flow'}
          size={2}
          fontWeight={FONT_WEIGHT.MEDIUM}
        >
          {t('addLabelFlow.preview')}
        </Subline>
        <Box bg={'white'} p={'1rem'} borderRadius={8} position={'relative'}>
          {globalState.addLabels.shape === 'ROUND' ? (
            <QrCode
              className={'al-preview'}
              style={{ color: globalState.addLabels.color }}
            />
          ) : (
            <QrCodeSquare
              className={'al-preview square'}
              style={{ color: globalState.addLabels.color }}
            />
          )}
          {globalState.addLabels.image?.dataUri && (
            <Box
              className={'al-preview-image'}
              position={'absolute'}
              bg={'white'}
              zIndex={1}
              borderRadius={
                globalState.addLabels.shape === 'ROUND' ? 8 : undefined
              }
            >
              <img
                src={globalState.addLabels.image.dataUri}
                alt={globalState.addLabels.image?.name}
              />
            </Box>
          )}
        </Box>
      </Flex>
      <Card
        input={
          <CardInput
            genericSlot={
              <Flex alignItems={'center'}>
                <Box
                  className={'al-shape al-shape__color'}
                  bg={`#${globalState.addLabels.color}`}
                />
              </Flex>
            }
            input={{
              inputValue: `#${globalState.addLabels.color}`,
              label: t('addLabelFlow.color'),
              onChange: e => {
                setColorValid(isValidHexColor(e.target.value.slice(0, 7)));
                setGlobalState({
                  ...globalState,
                  addLabels: {
                    ...globalState.addLabels,
                    color: e.target.value.replace('#', '').slice(0, 6),
                  },
                });
              },
              errorMessage: isColorValid ? '' : 'Invalid hex color',
            }}
            isInvalid={!isColorValid}
          />
        }
      />
      <DropdownCard
        defaultId={globalState.addLabels.shape ?? ('ROUND' satisfies Shape)}
        leftIcon={
          <Box
            className={cn('al-shape __left-icon', {
              'al-shape__round': globalState.addLabels.shape === 'ROUND',
            })}
            bg={`#${globalState.addLabels.color}`}
          />
        }
        label={t('addLabelFlow.shape')}
        menuItems={shapes}
        onChange={({ id }) => {
          setGlobalState({
            ...globalState,
            addLabels: { ...globalState.addLabels, shape: id },
          });
        }}
      />
      <Card
        onClick={handleImageUploadClick}
        header={
          <CardHeader
            leftIcon={
              globalState.addLabels.image?.dataUri ? undefined : (
                <Icon>image</Icon>
              )
            }
            xlIcon
            subtitle={globalState.addLabels.image?.name || t('system.none')}
            rightIcon={{
              name: globalState.addLabels.image?.dataUri ? 'delete' : 'upload',
              onClick: resetUploadedImage,
            }}
            genericSlot={
              globalState.addLabels.image?.dataUri && (
                <img
                  className={'al-image'}
                  src={globalState.addLabels.image?.dataUri}
                  alt="custom element embedded in qr code"
                />
              )
            }
          >
            {t('addLabelFlow.image')}
          </CardHeader>
        }
      />
      <input
        type="file"
        className={'al-image-upload'}
        ref={imageUploadRef}
        name="image"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {/**
      * Disable dropdown menu for export format until implemented on backend.
      * TODO: Uncomment if functionality available
      <DropdownCard
        defaultId={
          globalState.addLabels.format ?? ('PNG' satisfies DownloadFormat)
        }
        label={t('system.saveAs')}
        leftIcon="download"
        menuItems={downloadFormats}
        onChange={({ id }) => {setGlobalState({...globalState, addLabels: { ...globalState.addLabels, format: id },});}}
      /> * */}
      <div>
        <div className={'al-edit-info'}>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('addLabelFlow.backgroundColor')}{' '}
            <span>{t('addLabelFlow.transparent')}</span>
          </Paragraph>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('addLabelFlow.fileType')} <span>PNG</span>
          </Paragraph>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {t('addLabelFlow.imageSize')} <span>53x53</span>
          </Paragraph>
        </div>
      </div>
      <Flex my={'2rem'} justifyContent={'center'}>
        <Button
          onClick={() => navigate('/labels/add/connect')}
          isDisabled={!isColorValid}
        >
          {t('system.next')}
        </Button>
      </Flex>
    </Box>
  );
};
