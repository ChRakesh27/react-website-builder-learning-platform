import { supabase } from '../lib/supabaseClient.js';

export const projectsApi = {
  list: async () => supabase.from('projects').select('*, teams(*), tasks(*, subtasks(*))').order('created_at', { ascending: false }),
  get: async (id) => supabase.from('projects').select('*, teams(*), tasks(*, subtasks(*))').eq('id', id).single(),
  create: async (payload) => supabase.from('projects').insert(payload).select().single(),
  update: async (id, payload) => supabase.from('projects').update(payload).eq('id', id).select().single(),
  remove: async (id) => supabase.from('projects').delete().eq('id', id)
};
