import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth';

const API_URL = import.meta.env.VITE_AI_API_URL || '/api';

export const aiApi = {
  chat: async (message, history = [], ownerId = null) => {
    const { data: session } = await supabase.auth.getSession();
    const { data: user } = await auth.currentUser();
    const resolvedOwnerId = ownerId || user?.id || null;
    const accessToken = session?.session?.access_token || null;
    
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        owner_id: resolvedOwnerId,
        access_token: accessToken,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get response from AI at ${API_URL}/chat`);
    }

    return response.json();
  }
};
