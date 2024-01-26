import { Badge, BADGE_VARIANTS } from '@app/shared/ui/components';
import React from 'react';

export const GrowthIndicator = ({ trend }) => {
  if (trend === 0)
    return (
      <Badge
        className={'al-trend-badge'}
        noDot
        iconName={'east'}
        variant={BADGE_VARIANTS.SURFACE_VARIANT}
      >
        {`${trend}%`}
      </Badge>
    );
  if (trend > 0)
    return (
      <Badge
        className={'al-trend-badge'}
        noDot
        iconName={'north_east'}
        variant={BADGE_VARIANTS.GRASS}
      >
        {`${trend}%`}
      </Badge>
    );
  if (trend < 0)
    return (
      <Badge
        className={'al-trend-badge'}
        noDot
        iconName={'south_east'}
        variant={BADGE_VARIANTS.TERTIARY}
      >
        {`${trend}%`}
      </Badge>
    );
};
