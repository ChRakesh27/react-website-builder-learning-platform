import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth.js';

export const subtasksApi = {
  list: async () => {
    const { data: user } = await auth.currentUser();
    return supabase.from('subtasks').select('*').eq('owner_id', user?.id || '').order('created_at', { ascending: false });
  },
  create: async (payload) => supabase.from('subtasks').insert(payload).select().single(),
  update: async (id, payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('subtasks').update(payload).eq('id', id).eq('owner_id', user?.id || '').select().single();
  },
  remove: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('subtasks').delete().eq('id', id).eq('owner_id', user?.id || '');
  }
};
