import {
  Avatar,
  AVATAR_VARIANTS,
  AvatarGroup,
  CardHeader,
  ContextMenuItem,
} from '@app/shared/ui/components';
import { switchColor } from '@app/shared/ui/theme';
import { useColorMode } from '@chakra-ui/react';
import { Team } from '@prisma/client';
import React, { FC, MouseEvent } from 'react';

import { trpc } from '@app/client/trpc';

import { StyledTeamCard } from './StyledTeamCard';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  rightIcon?: {
    name: string;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  };
  contextMenuItems?: ContextMenuItem[];
  contextMenuVariant?: 'blue' | 'alignLeft' | 'blueAndLeft';
}

const shuffleArray = array => {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const assignAvatarColors = members => {
  const colors = Object.values(AVATAR_VARIANTS).filter(
    color => color !== 'surface',
  );
  let shuffledColors = shuffleArray(colors);
  let lastColor = null;

  return members.map((member, index) => {
    if (index % colors.length === 0) {
      // When we've used all colors, shuffle them again
      shuffledColors = shuffleArray(colors);
      // Ensure the first color in the new shuffle isn't the same as the last color used
      if (shuffledColors[0] === lastColor) {
        // Swap the first color with another if it's the same as the last used color
        [shuffledColors[0], shuffledColors[1]] = [
          shuffledColors[1],
          shuffledColors[0],
        ];
      }
    }
    const color = shuffledColors[index % colors.length];
    lastColor = color; // Update the last color used
    return { ...member, color };
  });
};

export const TeamCard: FC<TeamCardProps> = ({
  team: { name, id },
  onClick,
  rightIcon,
  contextMenuItems,
  contextMenuVariant,
}) => {
  const { colorMode } = useColorMode();
  const { data: memberData } = trpc.membership.listByTeamId.useQuery({
    teamId: id,
  });

  return (
    <StyledTeamCard
      onClick={onClick && onClick}
      header={
        <CardHeader
          genericSlot={
            <AvatarGroup>
              {assignAvatarColors(memberData?.teamMemberships || []).map(
                ({ id, color, user: { firstName, lastName } }) => (
                  <Avatar
                    key={id}
                    variant={color}
                    borderColor={switchColor(colorMode).surface}
                  >{`${firstName} ${lastName}`}</Avatar>
                ),
              )}
            </AvatarGroup>
          }
          rightIcon={rightIcon && rightIcon}
          contextMenuItems={contextMenuItems}
          contextMenuVariant={contextMenuVariant}
        >
          {name}
        </CardHeader>
      }
    ></StyledTeamCard>
  );
};
