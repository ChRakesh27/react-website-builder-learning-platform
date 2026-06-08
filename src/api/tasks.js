import { supabase } from '../lib/supabaseClient.js';

export const tasksApi = {
  list: async () => supabase.from('tasks').select('*, subtasks(*)').order('created_at', { ascending: false }),
  get: async (id) => supabase.from('tasks').select('*, subtasks(*)').eq('id', id).single(),
  create: async (payload) => supabase.from('tasks').insert(payload).select().single(),
  update: async (id, payload) => supabase.from('tasks').update(payload).eq('id', id).select().single(),
  remove: async (id) => supabase.from('tasks').delete().eq('id', id)
};
