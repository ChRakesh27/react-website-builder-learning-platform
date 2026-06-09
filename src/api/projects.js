import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth.js';

export const projectsApi = {
  list: async () => {
    const { data: user } = await auth.currentUser();
    return supabase.from('projects').select('*, tasks(*, subtasks(*))').eq('owner_id', user?.id || '').order('created_at', { ascending: false });
  },
  get: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('projects').select('*, tasks(*, subtasks(*))').eq('id', id).eq('owner_id', user?.id || '').single();
  },
  create: async (payload) => supabase.from('projects').insert(payload).select().single(),
  update: async (id, payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('projects').update(payload).eq('id', id).eq('owner_id', user?.id || '').select().single();
  },
  remove: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('projects').delete().eq('id', id).eq('owner_id', user?.id || '');
  }
};
