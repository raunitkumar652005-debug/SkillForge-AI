import { auth } from '@/auth';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

/**
 * Converts a raw userId string into a MongoDB ObjectId safely.
 * Returns the ObjectId if valid, or the original raw string if not.
 */
export function toObjectId(rawId) {
  if (!rawId) return null;
  if (rawId instanceof ObjectId) return rawId;
  try {
    return new ObjectId(rawId);
  } catch {
    return rawId;
  }
}

/**
 * Standardizes MongoDB user ID for database writes and insertions.
 * Auth.js MongoDB Adapter stores user identifiers as ObjectIds.
 */
export function getUserIdForStorage(rawId) {
  return toObjectId(rawId);
}

/**
 * Returns a MongoDB query filter for userId that matches either
 * the ObjectId or the string representation.
 * This guarantees backwards and forwards compatibility without data loss.
 */
export function getUserQuery(rawId) {
  if (!rawId) return { userId: null };
  const objId = toObjectId(rawId);
  if (objId instanceof ObjectId) {
    return { userId: { $in: [objId, String(rawId)] } };
  }
  return { userId: String(rawId) };
}

/**
 * Server Component & Route Handler authentication helper.
 * Retrieves the current session and validates user identity.
 */
export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

/**
 * Route Handler authentication guard.
 * Returns { user, session } if authenticated, or a 401 NextResponse if not.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      session: null,
      user: null,
      errorResponse: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }
  return {
    session,
    user: session.user,
    errorResponse: null
  };
}
