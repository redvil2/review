import {
  Badge,
  Card,
  CardHeader,
  ComboField,
  Icon,
  Loader,
  PageHeader,
  PageSectionLabel,
  PageWrapper,
  Paragraph,
  Tab,
  TabList,
  TabMenu,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, HStack } from '@chakra-ui/react';
import moment from 'moment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { StyledOderDetailPage } from '@app/client/routes/pages/OrderDetailPage/StyledOderDetailPage';
import { trpc } from '@app/client/trpc';

export const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { projectId, orderId } = useParams();
  const FILTERS = {
    ALL: 'BOTH',
    NO_SCANS: 'UNSCANNED',
    SCANNED: 'SCANNED',
  };

  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);

  const { data: orderData } = trpc.order.getById.useQuery({
    id: Number(orderId),
  });

  const { data: idData, isFetching } =
    trpc.analytics.findSerialNumbers.useQuery({
      orderId: Number(orderId),
      scanType: filter as unknown as 'BOTH' | 'UNSCANNED' | 'SCANNED',
      searchQuery: searchValue,
    });

  const handleFilterClick = (newFilter: string) => {
    if (newFilter === filter) {
      setFilter(FILTERS.ALL);
    } else {
      setFilter(newFilter);
    }
  };

  const filterIndex = {
    [FILTERS.ALL]: 0,
    [FILTERS.NO_SCANS]: 1,
    [FILTERS.SCANNED]: 2,
  };

  return (
    <StyledOderDetailPage>
      <PageWrapper>
        <PageHeader
          btnRoute={`/project/${projectId}`}
          btnLabel={t('system.back')}
        >
          {`${t('orderDetailPage.title')} ${orderData?.order.orderLabel}`}
        </PageHeader>
        <HStack
          mb={4}
          mt={2}
          justifyContent={{ base: 'space-between', sm: 'flex-start' }}
        >
          <TabMenu index={filterIndex[filter]}>
            <TabList>
              <Tab onClick={() => handleFilterClick(FILTERS.ALL)}>
                {t('orderDetailPage.all')}
              </Tab>
              <Tab
                onClick={() => handleFilterClick(FILTERS.NO_SCANS)}
                iconRight={
                  filter === FILTERS.NO_SCANS ? <Icon>close</Icon> : undefined
                }
              >
                {t('orderDetailPage.noScans')}
              </Tab>
              <Tab
                onClick={() => handleFilterClick(FILTERS.SCANNED)}
                iconRight={
                  filter === FILTERS.SCANNED ? <Icon>close</Icon> : undefined
                }
              >
                {t('orderDetailPage.scanned')}
              </Tab>
            </TabList>
          </TabMenu>
        </HStack>
        <ComboField
          value={searchValue}
          placeholder={t('orderDetailPage.searchId')}
          onInput={ev => setSearchValue((ev.target as HTMLInputElement).value)}
        />
        {isFetching && (
          <HStack w={'100%'} mt={10} justifyContent={'center'}>
            <Loader />
          </HStack>
        )}
        {!isFetching && (
          <Box w={'100%'}>
            {idData && (
              <PageSectionLabel>
                {`${Number(idData?.matchingAmount)} ${t('orderDetailPage.id', {
                  count: Number(idData?.matchingAmount),
                })}`}
              </PageSectionLabel>
            )}
            {idData?.results.map((item, idx) => (
              <Card
                key={`${item.serialNumber}-${idx}`}
                className={'al-card_order-id-scan'}
                header={
                  <CardHeader
                    genericSlot={
                      <Badge noDot>{`${item.scans || '0'} ${t(
                        'orderDetailPage.scan',
                        {
                          count: item.scans,
                        },
                      )}`}</Badge>
                    }
                    subtitle={`${t('orderDetailPage.lastScan')}: ${
                      item?.lastVisitedAt
                        ? moment(item?.lastVisitedAt).format(
                            'MMM Do YYYY, h:mma',
                          )
                        : '-'
                    }`}
                  >
                    {item.serialNumber as string}
                  </CardHeader>
                }
              />
            ))}
            {!idData?.matchingAmount && (
              <Paragraph
                size={2}
                fontWeight={FONT_WEIGHT.REGULAR}
                textAlign={'center'}
              >
                {t('orderDetailPage.noResults')}
              </Paragraph>
            )}
          </Box>
        )}
      </PageWrapper>
    </StyledOderDetailPage>
  );
};
