'use server';

import { cookies } from 'next/headers';
import type { User } from './auth';

const SESSION_COOKIE_NAME = 'vehicle_app_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface SessionData {
  userId: string;
  email: string;
  name: string;
  expiresAt: number;
}

// Set session
export async function setSession(user: User) {
  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
}

// Get session
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) return null;
  
  try {
    const sessionData: SessionData = JSON.parse(sessionCookie.value);
    
    if (sessionData.expiresAt < Date.now()) {
      await clearSession();
      return null;
    }
    
    return sessionData;
  } catch {
    return null;
  }
}

// Clear session
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Update password in session
export async function updateSessionUser(updates: Partial<User>) {
  const session = await getSession();
  if (!session) return;
  
  const sessionData: SessionData = {
    userId: session.userId,
    email: updates.email || session.email,
    name: updates.name || session.name,
    expiresAt: Date.now() + SESSION_DURATION,
  };
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
  });
}
