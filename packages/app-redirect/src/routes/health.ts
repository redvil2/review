import asyncHandler from 'express-async-handler';

import { pool } from '../external/database';

export const health = asyncHandler(async function redirect(req, res) {
  await pool.query('SELECT 1 FROM orders');

  res.send({
    database: {
      healthy: true,
    },
  });
});
