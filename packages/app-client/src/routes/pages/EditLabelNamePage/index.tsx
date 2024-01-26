import {
  Button,
  Headline,
  InputContainer,
  InputField,
  Input,
  Loader,
  PageHeader,
  PageWrapper,
  InputErrorMessage,
} from '@app/shared/ui/components';
import { FONT_WEIGHT } from '@app/shared/ui/theme';
import {
  Box,
  Card as CCard,
  Flex,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { useSequentialFadeIn } from '../../../hooks/useSequentialFadeIn';

import { StyledEditLabelName } from './StyledEditLabelName';

export type ProjectNameForm = {
  title: string;
};

export const EditLabelNamePage = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const { projectId } = useParams();
  const {
    data: projectData,
    isLoading,
    isError,
    error,
  } = trpc.project.getById.useQuery({
    id: Number(projectId),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectNameForm>({
    defaultValues: {
      title: projectData?.project?.title || '',
    },
  });

  const updateProjectMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      toast({
        title: t('success.successfullyUpdatedLabelName'),
        status: 'success',
      });
      navigate(`/project/${projectId}`);
    },
    onError: error => {
      toast({
        title: t('error.failedToUpdateLabelName'),
        description: error.message,
        status: 'error',
      });
    },
  });

  useEffect(() => {
    if (projectData?.project?.title)
      setValue('title', projectData.project.title);
  }, [projectData]);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: t('error.failedToFetchLabel'),
        description: error.message,
        status: 'error',
      });
    }
  }, [isError, error, toast]);

  const handleSave = async ({ title }: ProjectNameForm) => {
    if (projectData?.project.title !== title) {
      updateProjectMutation.mutate({
        id: Number(projectId),
        title: title,
      });
    } else {
      navigate(`/project/${projectId}`);
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);

  useSequentialFadeIn(containerRef);

  return (
    <StyledEditLabelName $colorMode={colorMode}>
      <PageWrapper ref={containerRef}>
        <PageHeader
          btnLabel={projectData?.project?.title}
          btnRoute={`/project/${projectId}`}
          xRoute={`/project/${projectId}`}
        />
        <Headline size={3} fontWeight={FONT_WEIGHT.SEMI_BOLD}>
          {t('projectPage.renameLabel')}
        </Headline>
        {isLoading && <Loader />}
        {!isLoading && projectData?.project && (
          <form onSubmit={handleSubmit(handleSave)}>
            <CCard>
              <InputField>
                <InputContainer isInvalid={!!errors.title}>
                  <Input
                    autoFocus
                    placeholder={t('addLabelFlow.projectName')}
                    {...register('title', {
                      required: t('formMessages.projectNameIsRequired'),
                    })}
                    defaultValue="hacky"
                  />
                  <InputErrorMessage>{errors.title?.message}</InputErrorMessage>
                </InputContainer>
              </InputField>
            </CCard>

            <Flex my={'2rem'} justifyContent={'flex-end'}>
              <Box mr={4}>
                <Button
                  variant={'secondary'}
                  onClick={() => navigate(`/project/${projectId}`)}
                >
                  {t('system.cancel')}
                </Button>
              </Box>
              <Button type="submit">{t('system.save')}</Button>
            </Flex>
          </form>
        )}
      </PageWrapper>
    </StyledEditLabelName>
  );
};
