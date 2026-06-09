import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth.js';

export const teamsApi = {
  list: async () => {
    const { data: user } = await auth.currentUser();
    return supabase.from('teams').select('*').eq('owner_id', user?.id || '').order('created_at', { ascending: false });
  },
  get: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('teams').select('*').eq('id', id).eq('owner_id', user?.id || '').single();
  },
  create: async (payload) => supabase.from('teams').insert(payload).select().single(),
  update: async (id, payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('teams').update(payload).eq('id', id).eq('owner_id', user?.id || '').select().single();
  },
  remove: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('teams').delete().eq('id', id).eq('owner_id', user?.id || '');
  }
};
