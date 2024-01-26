import asyncHandler from 'express-async-handler';
import sql from 'sql-template-strings';
import { load } from 'ts-dotenv';

import { pool } from '../external/database';
import { publishVisitNotification } from '../external/publishVisitNotification';
import { addFallbackVariables } from '../utils/addFallbackVariables';
import { addUtmVariables } from '../utils/addUtmVariables';

const { APP_CLIENT_URL, REDIRECT_DEFAULT_DOMAIN } = load({
  APP_CLIENT_URL: String,
  REDIRECT_DEFAULT_DOMAIN: String,
});

export const FALLBACK_URL = `${APP_CLIENT_URL}/fallback`;

export const redirect = asyncHandler(async function redirect(req, res) {
  const {
    rows: [order],
  } = await pool.query(sql`
    SELECT orders.*
    FROM orders
    LEFT JOIN domain_names
      ON domain_names.id = orders.qr_domain_name_id
    WHERE orders.slug = ${req.params.slug}
      AND (CASE
            WHEN domain_names.status = 'VERIFIED'
              THEN domain_names.value
            ELSE ${REDIRECT_DEFAULT_DOMAIN}
          END) = ${req.headers.host}
    LIMIT 1
  `);

  if (!order) {
    res.status(404).send('Not found');
    return;
  }

  const cookieKey = `returning-${req.params.slug}`;
  const returning = req.cookies[cookieKey] === '1';

  if (!returning) {
    res.cookie(cookieKey, '1');
  }

  const targetUrl =
    order.target_url ??
    order.fallback_url ??
    addFallbackVariables(FALLBACK_URL, {
      projectId: order.project_id,
      orderId: order.id,
    });

  const redirectUrl = addUtmVariables(targetUrl, {
    domainName: req.headers.host,
    slug: order.slug,
    serialNumber: req.params.serial,
  });

  res.redirect(redirectUrl);

  await publishVisitNotification({
    orderId: order.id,
    serialNumber: req.params.serial,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    returning,
    visitedAt: new Date(),
  });
});
