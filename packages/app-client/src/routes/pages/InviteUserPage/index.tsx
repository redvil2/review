import { DropdownCard } from '@app/core/web/ui';
import {
  Button,
  Card,
  Icon,
  Input,
  Loader,
  Headline,
  PageHeader,
  PageWrapper,
  InputField,
  InputAddon,
  InputContainer,
  Subline,
  InputErrorMessage,
} from '@app/shared/ui/components';
import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { VStack, useToast, Divider, useColorMode } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledInviteUserPage } from './InviteUserPage.style';

export const INVITE_MODE = {
  TRANSFER: 'transfer', //transfer ownership
  ADD: 'add', // add members to team
  EDIT: 'edit', // edit team
  SHARE: 'share', // share project
  CREATE: 'create', // create team
};
export const InviteUserPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teamId, projectId, mode } = useParams();
  const project = trpc.project.getById.useQuery({ id: Number(projectId) });
  const { colorMode } = useColorMode();
  const backLabel = () => {
    switch (mode) {
      case INVITE_MODE.TRANSFER:
        return t('projectPage.transfer');
      case INVITE_MODE.ADD:
        return t('addTeamFlow.addMembers');
      case INVITE_MODE.EDIT:
        return t('editTeamPage.editTeam');
      case INVITE_MODE.SHARE:
        return `${t('projectPage.share')} ${project.data?.project.title}`;
      case INVITE_MODE.CREATE:
        return t('addTeamFlow.teamName');
      default:
        return t('projectPage.share');
    }
  };
  const backRoute = (onSuccess?: boolean): string => {
    switch (mode) {
      case INVITE_MODE.TRANSFER:
        return `/project/${projectId}/transfer`;
      case INVITE_MODE.ADD:
        return `/project/${projectId}/teams/add/${teamId}/members`;
      case INVITE_MODE.EDIT:
        return `/project/${projectId}/teams/${teamId}/edit`;
      case INVITE_MODE.SHARE:
        return `/project/${projectId}/share`;
      case INVITE_MODE.CREATE:
        return onSuccess
          ? `/project/${projectId}/teams/add/${teamId}/members`
          : `/project/${projectId}/teams/add/${teamId}`;
      default:
        return `/project/${projectId}`;
    }
  };

  const xRoute = () => {
    switch (mode) {
      case INVITE_MODE.CREATE:
        return `project/${projectId}/share/teams`;
      default:
        return backRoute();
    }
  };

  const userInvitation = trpc.invitation.createForProject.useMutation();
  const userTeaminvitationMutation =
    trpc.invitation.createForTeam.useMutation();
  const toast = useToast();
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const trpcUtils = trpc.useContext();

  const sendInvitation = async (email: string) => {
    return new Promise((resolve, reject) => {
      if (teamId) {
        userTeaminvitationMutation.mutate(
          {
            teamId: Number(teamId),
            recipientEmail: email,
            membershipRole: (role === 'editor' && 'EDITOR') || 'VIEWER',
          },
          {
            onSuccess: () => {
              toast({ status: 'success', title: t('system.inviteSent') });
              navigate(backRoute() as string);
            },
            onError: error => {
              toast({
                status: 'error',
                title: t('system.errorSendingInvite'),
                description: error.message,
              });
            },
          },
        );
      } else {
        userInvitation.mutate(
          {
            projectId: Number(projectId),
            recipientEmail: email,
            accessType: (role === 'editor' && 'WRITE') || 'READ',
          },
          {
            onSuccess: () => {
              trpcUtils.invitation.listByProjectId.invalidate();
              resolve(true);
            },
            onError: error => {
              reject(error);
            },
          },
        );
      }
    });
  };

  const sendInvitations = async contacts => {
    const failedMails: string[] = [];
    for (const email of contacts) {
      try {
        await sendInvitation(email);
      } catch (error) {
        failedMails.push(email);
      }
    }
    if (failedMails.length > 0) {
      toast({
        status: 'error',
        title: `${t('system.errorSendingInvite')} ${failedMails.join(', ')}`,
      });
    } else {
      toast({ status: 'success', title: t('system.inviteSent') });
    }
    navigate(backRoute(true) as string);
  };
  const handleInvite = async () => {
    if (validEmails.every(value => value)) {
      await sendInvitations([...contacts].filter(str => str !== ''));
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  const maxEmails = 10;
  const [contacts, setContacts] = useState<string[]>(
    new Array(maxEmails).fill(''),
  );
  const [validEmails, setValidEmails] = useState<boolean[]>(
    new Array(maxEmails).fill(true),
  );
  const filledCount = contacts.filter(v => v).length;

  const updateContacts = (index: number, value: string) => {
    let newContacts = [...contacts];
    newContacts[index] = value;
    newContacts = newContacts
      .map(str => str.trim())
      .sort((a, b) => {
        if (a === '' && b !== '') return 1;
        if (b === '' && a !== '') return -1;
        return 0;
      });
    setContacts(newContacts);
  };

  const updateValidEmail = (index: number, email: string) => {
    const newValidEmails = [...validEmails];

    newValidEmails[index] =
      /^(?!\.)(?!.*\.{2})[\p{L}0-9\p{P}_+\-]{1,64}(?<!\.)@(?!\.)(?!.*\.{2})[\p{L}0-9\p{P}_\-]+\.[a-zA-Z]{2,}$/u.test(
        email,
      ) || email === '';
    setValidEmails(newValidEmails);
  };

  return (
    <StyledInviteUserPage>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={backLabel()}
          btnRoute={backRoute()}
          xRoute={xRoute()}
        />
        <VStack spacing={8} width="100%">
          <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
            {t('system.inviteUser')}
          </Headline>
          <form className="w100">
            <VStack spacing={8} width="100%" alignItems="center">
              <VStack spacing={0} width="100%" alignItems="flex-start" gap={1}>
                <Subline
                  className={'al-select-role-title'}
                  size={2}
                  fontWeight={FONT_WEIGHT.MEDIUM}
                  textAlign="left"
                >
                  {t('system.selectRole')}
                </Subline>
                <DropdownCard
                  defaultId={'editor'}
                  menuItems={[
                    { id: 'editor', name: 'Editor' },
                    { id: 'viewer', name: 'Viewer' },
                  ]}
                  leftIcon={null}
                  onChange={({ id }) => {
                    setRole(id);
                  }}
                />
              </VStack>
              <Divider
                sx={{
                  borderColor: switchColor(colorMode).outlineVariant,
                  opacity: 1,
                }}
              />
              <VStack spacing={3} width="100%" alignItems="flex-start">
                {contacts.map(
                  (value, index) =>
                    (value || index <= (filledCount < 2 ? 1 : filledCount)) && (
                      <Card className="w100" key={index}>
                        <InputField>
                          <InputAddon className="prefix-input">
                            <Icon className="__email-icon">email</Icon>
                          </InputAddon>
                          <InputContainer isInvalid={!validEmails[index]}>
                            <Input
                              key={index}
                              value={value}
                              onBlur={e =>
                                updateValidEmail(index, e.target.value)
                              }
                              onFocus={() => updateValidEmail(index, '')}
                              onChange={e =>
                                updateContacts(index, e.target.value)
                              }
                              placeholder={t('system.emailAddress')}
                            />
                            <InputErrorMessage>
                              {t('formMessages.invalidEmailFormat')}
                            </InputErrorMessage>
                          </InputContainer>
                          <InputAddon className="edit-icon-addon">
                            <Icon
                              onClick={() => {
                                if (contacts[index] !== '') {
                                  updateContacts(index, '');
                                }
                              }}
                              className="edit-icon"
                            >
                              {value === '' ? 'edit' : 'delete'}
                            </Icon>
                          </InputAddon>
                        </InputField>
                      </Card>
                    ),
                )}
              </VStack>
              <Button
                type="button"
                leftIcon={
                  userInvitation.isLoading ? (
                    <Loader size="1.25rem" />
                  ) : (
                    <Icon>person_add</Icon>
                  )
                }
                isDisabled={
                  contacts.join('') === '' ||
                  validEmails.some(value => !value) ||
                  userInvitation.isLoading
                }
                onClick={handleInvite}
              >
                {t('system.sendInvitation')}
              </Button>
            </VStack>
          </form>
        </VStack>
      </PageWrapper>
    </StyledInviteUserPage>
  );
};
