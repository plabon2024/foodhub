import { cookies } from 'next/headers';

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();

      console.log('=== Session Debug ===');
      console.log('Auth URL:', process.env.BETTER_AUTH_URL);
      console.log('Cookies:', cookieString);

      const res = await fetch(`${process.env.BETTER_AUTH_URL}/get-session`, {
        headers: {
          Cookie: cookieString,
        },
        cache: "no-store",
      });
      console.log('Auth URL:', process.env.BETTER_AUTH_URL);
      console.log('Response status:', res.status);

      if (!res.ok) {
        console.error('Response not OK:', res.statusText);
        return {
          data: null,
          error: { message: `HTTP ${res.status}: ${res.statusText}` }
        };
      }

      const session = await res.json();
      console.log('Session response:', JSON.stringify(session, null, 2));

      // Adjust this based on what you see in the logs
      if (!session || session === null || !session.user) {
        return { data: null, error: { message: "Session is missing." } };
      }

      return { data: session, error: null };
    } catch (err) {
      console.error('Session error:', err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};