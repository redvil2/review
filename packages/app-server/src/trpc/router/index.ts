import { routerFactory } from '../trpc';

import { accessRouter } from './access-router';
import { analyticsRouter } from './analytics-router';
import { contactRouter } from './contact-router';
import { domainNameRouter } from './domain-name-router';
import { invitationRouter } from './invitation-router';
import { membershipRouter } from './membership-router';
import { orderRouter } from './order-router';
import { projectRouter } from './project-router';
import { smsRouter } from './sms-router';
import { teamRouter } from './team-router';
import { tokenRouter } from './token-router';
import { userRouter } from './user-router';

export const coreRouter = routerFactory({
  analytics: analyticsRouter,
  domainName: domainNameRouter,
  token: tokenRouter,
  sms: smsRouter,
  user: userRouter,
  contact: contactRouter,
  project: projectRouter,
  order: orderRouter,
  team: teamRouter,
  membership: membershipRouter,
  invitation: invitationRouter,
  access: accessRouter,
});

export type CoreRouter = typeof coreRouter;
