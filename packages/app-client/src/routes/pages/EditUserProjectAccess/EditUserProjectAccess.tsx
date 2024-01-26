import { DropdownCard } from '@app/core/web/ui';
import {
  Button,
  Headline,
  Icon,
  PageHeader,
  PageWrapper,
  Paragraph,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import { HStack, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { StyledEditUserProjectAccess } from '@app/client/routes/pages/EditUserProjectAccess/editUserProjectAccess.style';
import { trpc } from '@app/client/trpc';

type roleOptions = 'READ' | 'WRITE';

export const EditUserProjectAccess = () => {
  const { t } = useTranslation();
  const { projectId, accessId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const trpcUtils = trpc.useContext();
  const [role, setRole] = React.useState<roleOptions | ''>('');

  const { data: accessData } = trpc.access.getById.useQuery({
    id: Number(accessId),
  });

  const accessRevokeMutation = trpc.access.delete.useMutation({
    onSuccess: async () => {
      navigate(`/project/${projectId}/share`);
    },
    onError: error => {
      toast({
        title: t('system.errorRemovingAccess'),
        description: error.message,
        status: 'error',
      });
    },
  });

  const updateAccessMutation = trpc.access.update.useMutation({
    onSuccess: async () => {
      await trpcUtils.access.getById.invalidate();
      navigate(`/project/${projectId}/share`);
    },
  });

  useEffect(() => {
    if (accessData?.access && role === '') {
      setRole(accessData?.access.accessType);
    }
  });

  const handleRevokeAccess = () => {
    accessRevokeMutation.mutate({ id: Number(accessId) });
  };

  const handleSave = () => {
    updateAccessMutation.mutate({
      id: Number(accessId),
      furtherSharing: role === 'WRITE',
      accessType: role as roleOptions,
    });
  };
  return (
    <StyledEditUserProjectAccess>
      <PageWrapper>
        <PageHeader xRoute={`/project/${projectId}/share`} />
        <VStack w={'100%'} gap={4} mt={12}>
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {`${accessData?.access?.receivingUser.firstName} ${accessData?.access?.receivingUser.lastName}`}
          </Headline>
          <Paragraph size={2} fontWeight={FONT_WEIGHT.REGULAR}>
            {t(
              `onboarding.${accessData?.access?.receivingUser.userSettings.position}`,
            )}
          </Paragraph>
        </VStack>
        <VStack w={'100%'} gap={8} mt={8}>
          {role !== '' && (
            <DropdownCard
              label={t('addTeamFlow.updateRole')}
              defaultId={role}
              menuItems={[
                { id: 'READ', name: 'Viewer' },
                { id: 'WRITE', name: 'Editor' },
              ]}
              onChange={item => setRole(item.id as roleOptions)}
              rightIcon={<Icon className="__right-icon">expand_more</Icon>}
            />
          )}
          <HStack justifyContent={'space-between'} w={'100%'}>
            <Button
              variant={'secondary'}
              onClick={handleRevokeAccess}
              leftIcon={<Icon>group_remove</Icon>}
            >
              {t('system.remove')}
            </Button>
            <Button
              isDisabled={role === accessData?.access.accessType}
              onClick={handleSave}
            >
              {t('system.save')}
            </Button>
          </HStack>
        </VStack>
      </PageWrapper>
    </StyledEditUserProjectAccess>
  );
};
