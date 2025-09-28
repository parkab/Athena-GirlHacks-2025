import jwt from 'jsonwebtoken';
import type { IUser } from './user';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const JWT_EXPIRES_IN = '7d';

export function generateToken(user: IUser) {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string; iat?: number; exp?: number };
  } catch (err) {
    return null;
  }
}