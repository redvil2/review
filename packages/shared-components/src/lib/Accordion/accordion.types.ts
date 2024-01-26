import React from 'react';

export interface AccordionProps {
  children: React.ReactNode;
  index?: number | null;
  onChange?: (index: number) => void;
  defaultIndex?: number;
}

export interface AccordionHeaderProps {
  children: string | React.ReactNode;
  accordionIcon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  subtitle?: string | React.ReactNode;
}

export interface AccordionBodyItemProps {
  children: React.ReactNode;
  subline?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  noPointer?: boolean;
}
