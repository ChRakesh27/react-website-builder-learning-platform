import { supabase } from '../lib/supabaseClient.js';

export const subtasksApi = {
  list: async () => supabase.from('subtasks').select('*').order('created_at', { ascending: false }),
  create: async (payload) => supabase.from('subtasks').insert(payload).select().single(),
  update: async (id, payload) => supabase.from('subtasks').update(payload).eq('id', id).select().single(),
  remove: async (id) => supabase.from('subtasks').delete().eq('id', id)
};
