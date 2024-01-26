import type { FC } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AddDomain } from '@app/client/routes/pages/AddDomain/AddDomain';
import { EngageView } from '@app/client/routes/pages/Analytics/views/EngageView';
import { ProtectView } from '@app/client/routes/pages/Analytics/views/ProtectView';
import { TrackView } from '@app/client/routes/pages/Analytics/views/TrackView';
import { ConnectDomainPage } from '@app/client/routes/pages/ConnectDomain';
import { EditUserProjectAccess } from '@app/client/routes/pages/EditUserProjectAccess/EditUserProjectAccess';
import { OrderDetailPage } from '@app/client/routes/pages/OrderDetailPage';
import { AccountView } from '@app/client/routes/pages/Settings/Views/Account';
import { DomainsView } from '@app/client/routes/pages/Settings/Views/Domains';
import { SharedWithPage } from '@app/client/routes/pages/SharedWithPage/SharedWithPage';
import { ViewMembersPage } from '@app/client/routes/pages/ViewMembersPage/ViewMembersPage';

import { PrivateRoutes } from '../auth';

import { AddLabelPage } from './pages/AddLabel';
import { ConnectCode } from './pages/AddLabel/ConnectCode';
import { EditDesign } from './pages/AddLabel/EditDesign';
import { LabelName } from './pages/AddLabel/LabelName';
import { LabelOptions } from './pages/AddLabel/LabelOptions';
import { SelectType } from './pages/AddLabel/SelectType';
import { AddLabelsPage } from './pages/AddLabels';
import { AddTeam } from './pages/AddTeam';
import { TeamMembers } from './pages/AddTeam/TeamMembers';
import { TeamName } from './pages/AddTeam/TeamName';
import { AllLabelsPage } from './pages/AllLabels';
import { Analytics } from './pages/Analytics';
import { EditLabelNamePage } from './pages/EditLabelNamePage';
import { EditOrderPage } from './pages/EditOrderPage';
import { EditTeam } from './pages/EditTeam/EditTeam';
import { EditTeamMember } from './pages/EditTeamMember/EditTeamMember';
import { FallbackPage } from './pages/Fallback';
import { HomePage } from './pages/HomePage';
import { ImprintPage } from './pages/Imprint';
import { InviteUserPage } from './pages/InviteUserPage';
import { Onboarding } from './pages/Onboarding';
import { AccountData } from './pages/Onboarding/AccountData';
import { BasicData } from './pages/Onboarding/BasicData';
import { CompanyData } from './pages/Onboarding/CompanyData';
import { PositionData } from './pages/Onboarding/PositionData';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SettingsPage } from './pages/Settings';
import { ShareLabelPage } from './pages/ShareLabelPage';
import { ShareWithTeam } from './pages/ShareLabelPage/ShareWithTeam';
import { ShareWithUser } from './pages/ShareLabelPage/ShareWithUser';
import {
  SignupLoginPage,
  SignupLoginProviderPage,
  SignupLoginPhonePage,
} from './pages/SignupLogin';
import { SignupLoginWeChat } from './pages/SignupLogin/SignupLoginWeChat';
import { Terms } from './pages/Terms';
import { TransferOwnershipPage } from './pages/TransferOwnership';
import { Root } from './Root';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      ...['/signin', '/auth/microsoft/redirect'].map(path => ({
        path,
        element: <SignupLoginPage />,
        children: [
          {
            path: '',
            element: <SignupLoginProviderPage />,
          },
          {
            path: 'number',
            element: <SignupLoginPhonePage />,
          },
          {
            path: 'wechat',
            element: <SignupLoginWeChat />,
          },
          {
            path: 'number/confirm',
            element: <SignupLoginPhonePage />,
          },
        ],
      })),
      {
        path: '/terms',
        element: <Terms />,
      },
      {
        path: '/project/:projectId/order/:orderId/analytics',
        element: <Analytics />,
        children: [
          {
            path: '',
            element: <EngageView />,
          },
          {
            path: 'protect',
            element: <ProtectView />,
          },
          {
            path: 'track',
            element: <TrackView />,
          },
        ],
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/fallback',
        element: <FallbackPage />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: '/onboarding',
            element: <Onboarding />,
            children: [
              {
                path: '',
                element: <BasicData />,
              },
              {
                path: 'account',
                element: <AccountData />,
              },
              {
                path: 'company',
                element: <CompanyData />,
              },
              {
                path: 'position',
                element: <PositionData />,
              },
            ],
          },
          {
            path: '/labels',
            element: <AllLabelsPage />,
          },
          {
            path: '/labels/add',
            element: <AddLabelPage />,
            children: [
              {
                path: '/labels/add',
                element: <SelectType />,
              },
              {
                path: '/labels/add/edit',
                element: <EditDesign />,
              },
              {
                path: '/labels/add/connect',
                element: <ConnectCode />,
              },
              {
                path: '/labels/add/options',
                element: <LabelOptions />,
              },
              {
                path: '/labels/add/name',
                element: <LabelName />,
              },
            ],
          },
          {
            path: '/project/:projectId?/teams/add/:teamId?',
            element: <AddTeam />,
            children: [
              {
                path: ':mode?',
                element: <TeamName />,
              },
              {
                path: ':teamId/members',
                element: <TeamMembers />,
              },
              {
                path: ':teamId/members/:memberId/edit',
                element: <EditTeamMember />,
              },
            ],
          },
          {
            path: '/project/:projectId/teams/:teamId/edit',
            element: <EditTeam />,
          },
          {
            path: '/project/:projectId/teams/:teamId?/members/:memberId/:mode',
            element: <EditTeamMember />,
          },
          {
            path: 'project/:projectId/access/:accessId',
            element: <EditUserProjectAccess />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
            children: [
              {
                path: '',
                element: <AccountView />,
              },
              {
                path: 'domains',
                element: <DomainsView />,
              },
            ],
          },
          {
            path: '/domain/:domainId/connect',
            element: <ConnectDomainPage />,
          },
          {
            path: '/domain/add',
            element: <AddDomain />,
          },
          {
            path: '/imprint',
            element: <ImprintPage />,
          },
          {
            path: '/project/:projectId',
            element: <ProjectDetailPage />,
          },
          {
            path: 'project/:projectId/shared',
            element: <SharedWithPage />,
            children: [
              {
                path: '',
                element: <ShareWithUser viewOnly />,
              },
              { path: 'teams', element: <ShareWithTeam viewOnly /> },
            ],
          },
          {
            path: 'project/:projectId/shared/teams/:teamId/members',
            element: <ViewMembersPage />,
          },
          {
            path: 'project/:projectId/add',
            element: <AddLabelsPage />,
          },
          {
            path: 'project/:projectId/edit',
            element: <EditLabelNamePage />,
          },
          {
            path: 'project/:projectId/share',
            element: <ShareLabelPage />,
            children: [
              {
                path: '',
                element: <ShareWithUser />,
              },
              {
                path: 'teams',
                element: <ShareWithTeam />,
              },
            ],
          },
          {
            path: 'project/:projectId/invite/:mode/:teamId?',
            element: <InviteUserPage />,
          },
          {
            path: 'project/:projectId/order/:orderId',
            element: <EditOrderPage />,
          },
          {
            path: 'project/:projectId/transfer',
            element: <TransferOwnershipPage />,
          },
          {
            path: 'project/:projectId/order/:orderId/ids',
            element: <OrderDetailPage />,
          },
        ],
      },
    ],
  },
]);

export const Routes: FC = () => <RouterProvider router={routes} />;
