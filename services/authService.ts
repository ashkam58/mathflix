import { UserProfile } from '../types';

const API_URL = process.env.VITE_API_URL || '';

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const login = async (email: string, password: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loginWithGoogle = async (token: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const signup = async (name: string, email: string, password: string): Promise<UserProfile> => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Signup failed');
  }
  return await res.json();
};

export const logout = async (): Promise<void> => {
  await fetch(`${API_URL}/api/auth/logout`, { method: 'POST' });
  window.location.reload();
};

export const updateUserSubscription = async (isSubscribed: boolean): Promise<void> => {
  // This probably needs an API endpoint too, but sticking to basics first.
  // Assuming backend handles subscription status, we might not update it client-side directly.
  // But for now, let's just make it a no-op or a TODO, or implement a route if needed.
  // I'll leave it as a comment for now to not break the interface, or add a simple fetch if I add the route.
  console.log('Update subscription not fully implemented in backend yet');
};
