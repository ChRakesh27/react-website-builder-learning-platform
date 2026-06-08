import { supabase } from '../lib/supabaseClient.js';

export const teamsApi = {
  list: async () => supabase.from('teams').select('*').order('created_at', { ascending: false }),
  get: async (id) => supabase.from('teams').select('*').eq('id', id).single(),
  create: async (payload) => supabase.from('teams').insert(payload).select().single(),
  update: async (id, payload) => supabase.from('teams').update(payload).eq('id', id).select().single(),
  remove: async (id) => supabase.from('teams').delete().eq('id', id)
};
