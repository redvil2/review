import {
  BarDiagram,
  BarDiagramItem,
  Card,
  LineChart,
  LineChartItem,
  Loader,
  Paragraph,
  PieChart,
  PieChartItem,
  Subline,
  Tab,
  TAB_MENU_VARIANTS,
  TabList,
  TabMenu,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { Box, Flex, HStack, useToast } from '@chakra-ui/react';
import { RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  filterItems,
  getLabels,
  getPeriod,
  LineChartFilters,
  aggregateAndFillData,
  calculatePercentageChange,
} from '@app/client/routes/pages/Analytics/AnalyticsHelper';
import { GrowthIndicator } from '@app/client/routes/pages/Analytics/GrowthIndicator';
import { trpc } from '@app/client/trpc';

export const EngageView = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const tabMenuItems = [
    {
      label: t('analytics.filterDay'),
      filter: LineChartFilters.FILTER_DAY,
    },
    {
      label: t('analytics.filterWeek'),
      filter: LineChartFilters.FILTER_WEEK,
    },
    {
      label: t('analytics.filterMonth'),
      filter: LineChartFilters.FILTER_MONTH,
    },
    {
      label: t('analytics.filterHalfYear'),
      filter: LineChartFilters.FILTER_HALF_YEAR,
    },
    {
      label: t('analytics.filterMax'),
      filter: LineChartFilters.FILTER_MAX,
    },
  ];

  interface StateType {
    tabIndex: number;
    isSingleQRCode: boolean;
  }

  const [state, setState] = useState<StateType>({
    tabIndex: 2,
    isSingleQRCode: false,
  });
  const { orderId } = useParams();
  const {
    data,
    error,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    refetch: refetchAnalytics,
  } = trpc.analytics.order.useQuery({
    orderId: Number(orderId),
    periodUnit: Object(
      ['HOUR', 'DAY', 'DAY', 'MONTH', 'MONTH'][state.tabIndex],
    ),
    periodLength: [24, 7, 31, 6, 24][state.tabIndex],
  });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const isSingleQRCode = analyticsData?.projectQrType === 'SINGLE';

  useEffect(() => {
    setAnalyticsData(null);
  }, [state.tabIndex]);

  useEffect(() => {
    if (!analyticsData) {
      setAnalyticsData(data);
      refetchAnalytics({
        orderId: Number(orderId),
        periodUnit: Object(
          ['HOUR', 'DAY', 'DAY', 'MONTH', 'MONTH'][state.tabIndex],
        ),
        periodLength: [24, 7, 31, 6, 24][state.tabIndex] * 2,
      } as unknown as RefetchOptions & RefetchQueryFilters<unknown>);
    }
  }, [data, analyticsData]);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: t('error.failedToFetchLabels'),
        description: error.message,
        status: 'error',
      });
    }
  }, [t, isError, error, toast, analyticsData, isSuccess]);

  /**
   * @description Calculates the starting date of a previous period based on the current period selection.
   *
   * @returns {Date|null} The calculated start date of the previous period, or null if the period unit is unsupported or undefined.
   *
   * @function getPreviousPeriodDate
   */
  const getPreviousPeriodDate = () => {
    const today = new Date();
    const selectedPeriodUnit = ['HOUR', 'DAY', 'DAY', 'HALF_YEAR', 'CUSTOM'][
      state.tabIndex
    ];
    const selectedPeriodLength = [24, 7, 31, 6, 24][state.tabIndex] - 1;
    let previousDate = new Date(today);

    switch (selectedPeriodUnit) {
      case 'HOUR':
        previousDate.setHours(today.getHours() - selectedPeriodLength);
        break;
      case 'DAY':
        previousDate.setDate(today.getDate() - selectedPeriodLength);
        break;
      case 'MONTH':
        previousDate.setMonth(today.getMonth() - selectedPeriodLength);
        break;
      case 'HALF_YEAR':
        previousDate.setMonth(today.getMonth() - selectedPeriodLength);
        previousDate.setDate(1);
        previousDate.setHours(0, 0, 0, 0);
        break;
      case 'CUSTOM':
        if (analyticsData?.visitsSegmentation.length) {
          previousDate = new Date(analyticsData?.visitsSegmentation[0]?.key);
        } else {
          previousDate = today;
        }
        break;
      default:
        return null;
    }
    return previousDate;
  };

  const lineChartItems =
    (analyticsData?.visitsSegmentation &&
      (filterItems(
        tabMenuItems[state.tabIndex].filter,
        analyticsData?.visitsSegmentation,
      ) as LineChartItem[])) ||
    [];

  const aggregatedData = aggregateAndFillData(
    lineChartItems,
    tabMenuItems[state.tabIndex].filter,
  );

  /**
   * @description Calculates the trend as a percentage change between the counts of two time periods.
   *
   * @returns {number} The percentage change representing the trend between the previous and current periods.
   *
   * @function getTrend
   */
  const getTrend = () => {
    const previousDate = getPreviousPeriodDate();
    const previousCount = data?.visitsSegmentation
      .filter(visit => new Date(visit.key) <= (previousDate as Date))
      .reduce((acc, curr) => {
        acc += curr.count;
        return acc;
      }, 0);
    const currentCount = analyticsData?.visitsSegmentation.reduce(
      (acc, curr) => {
        acc += curr.count;
        return acc;
      },
      0,
    );
    return calculatePercentageChange(previousCount, currentCount);
  };

  return (
    <>
      <TabMenu
        variant={TAB_MENU_VARIANTS.SMALL}
        onChange={item =>
          setState(prevState => ({ ...prevState, tabIndex: Number(item) }))
        }
        defaultIndex={state.tabIndex}
      >
        <TabList>
          {tabMenuItems.map((item, index) => (
            <Tab key={index} data-filter={item.filter}>
              {item.label}
            </Tab>
          ))}
        </TabList>
      </TabMenu>
      {isLoading ? (
        <Flex
          width={'100%'}
          height={'100%'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          {<Loader />}
        </Flex>
      ) : (
        <>
          {isSingleQRCode && (
            <Card>
              <Subline
                className={'order-no'}
                size={2}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
              >
                {analyticsData &&
                  t('analytics.headlineSingle', {
                    num: analyticsData.amount.toLocaleString(
                      navigator.language,
                    ),
                  })}
              </Subline>
            </Card>
          )}
          {!isSingleQRCode && (
            <Card>
              <Subline
                className={'order-no'}
                size={1}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
              >
                {t('analytics.headlineCodes', {
                  num: analyticsData?.amount.toLocaleString(navigator.language),
                })}
              </Subline>
              <PieChart
                center={false}
                items={
                  (analyticsData?.serialsSegmentation
                    ?.filter(seg => seg.key !== 'unusable')
                    .map(seg =>
                      seg.key === 'unused' && seg.count === analyticsData.amount
                        ? { ...seg, initial: true }
                        : seg,
                    ) as PieChartItem[]) || []
                }
              ></PieChart>
            </Card>
          )}
          <Card>
            <Box mb={1} className={'al-analytics-card-title'}>
              <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
                {t('analytics.headlineScans')}
              </Paragraph>
            </Box>
            <Box mb={'1rem'}>
              <Subline
                size={1}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
                className={'al-qr-scans-data-headline'}
              >
                {!analyticsData?.visitsSegmentation.length
                  ? t('analytics.noData')
                  : analyticsData?.visitsSegmentation.reduce((acc, curr) => {
                      acc = acc + curr.count;
                      return acc;
                    }, 0)}
                {!isFetching && !!analyticsData ? (
                  <GrowthIndicator trend={getTrend()} />
                ) : (
                  <GrowthIndicator trend={0} />
                )}
              </Subline>
              <Paragraph
                size={2}
                fontWeight={FONT_WEIGHT.SEMI_BOLD}
                className={'al-period-subline'}
              >
                {state.tabIndex === 0
                  ? 'Today'
                  : getPeriod(getPreviousPeriodDate() as Date, new Date())}{' '}
              </Paragraph>
            </Box>
            <Box pl={4}>
              <LineChart
                items={aggregatedData as LineChartItem[]}
                labels={getLabels(tabMenuItems[state.tabIndex].filter)}
              />
            </Box>
          </Card>
          {isSingleQRCode && (
            <Card>
              <Box mb={'1rem'} className={'al-connect__description'}>
                <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
                  {t('analytics.headlineApp')}
                </Paragraph>
              </Box>
              <PieChart
                center={false}
                items={
                  (analyticsData?.scanAppSegmentation as PieChartItem[]) || []
                }
              ></PieChart>
            </Card>
          )}

          {isSingleQRCode && (
            <Card>
              <Box mb={'1rem'} className={'al-connect__description'}>
                <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
                  {t('analytics.headlineUserType')}
                </Paragraph>
              </Box>
              <PieChart
                center={false}
                items={
                  (analyticsData?.userTypeSegmentation as PieChartItem[]) || []
                }
              ></PieChart>
            </Card>
          )}
          <Card>
            <Box mb={'1rem'} className={'al-connect__description'}>
              <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
                {t('analytics.headlineBrowserType')}
              </Paragraph>
            </Box>
            {analyticsData?.browserSegmentation.length ? (
              <BarDiagram
                items={analyticsData?.browserSegmentation as BarDiagramItem[]}
                center={false}
              />
            ) : (
              <HStack>
                <Paragraph
                  size={2}
                  fontWeight={FONT_WEIGHT.MEDIUM}
                  className={'al-no-data'}
                >
                  {t('analytics.noData')}
                </Paragraph>
                <BarDiagram
                  items={[{ count: 0, key: '' }] as BarDiagramItem[]}
                  center={false}
                />
              </HStack>
            )}
          </Card>
          <Card>
            <Box mb={'1rem'} className={'al-connect__description'}>
              <Paragraph size={1} fontWeight={FONT_WEIGHT.REGULAR}>
                {t('analytics.headlineCity')}
              </Paragraph>
            </Box>
            {analyticsData?.citySegmentation.length ? (
              <BarDiagram
                items={analyticsData?.citySegmentation as BarDiagramItem[]}
                center={false}
              />
            ) : (
              <HStack>
                <Paragraph
                  size={2}
                  fontWeight={FONT_WEIGHT.MEDIUM}
                  className={'al-no-data'}
                >
                  {t('analytics.noData')}
                </Paragraph>
                <BarDiagram
                  items={[{ count: 0, key: '' }] as BarDiagramItem[]}
                  center={false}
                />
              </HStack>
            )}
          </Card>
        </>
      )}
    </>
  );
};
