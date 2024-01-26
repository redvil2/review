import jwt from 'jsonwebtoken';
import { load } from 'ts-dotenv';

const { JWT_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = load({
  JWT_SECRET: String,
  JWT_ACCESS_EXPIRATION: String,
  JWT_REFRESH_EXPIRATION: String,
});

export function decodeJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function refreshJwtTokens(refreshToken) {
  const { userId } = jwt.verify(refreshToken, JWT_SECRET);
  if (!userId) {
    throw new Error('userId is missing in refresh token');
  }

  return encodeJwtTokens(userId);
}

export function encodeJwtTokens(userId) {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION,
  });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });

  return { accessToken, refreshToken };
}
