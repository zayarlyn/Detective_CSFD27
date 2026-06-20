import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
  userId: string;
  isAdmin: boolean;
};

const sessionOptions = {
  cookieName: 'csfd27_session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function getSessionData(): Promise<SessionData | null> {
  const session = await getSession();
  if (!session.userId) return null;
  return { userId: session.userId, isAdmin: session.isAdmin };
}

export async function setSession(data: SessionData): Promise<void> {
  const session = await getSession();
  session.userId = data.userId;
  session.isAdmin = data.isAdmin;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}
