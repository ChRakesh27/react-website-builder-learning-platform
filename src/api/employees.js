import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth.js';

export const employeesApi = {
  list: async () => {
    const { data: user } = await auth.currentUser();
    return supabase.from('employees').select('*').eq('owner_id', user?.id || '').order('created_at', { ascending: false });
  },
  get: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('employees').select('*').eq('id', id).eq('owner_id', user?.id || '').single();
  },
  create: async (payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('employees').insert({ ...payload, owner_id: user?.id || null }).select().single();
  },
  update: async (id, payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('employees').update(payload).eq('id', id).eq('owner_id', user?.id || '').select().single();
  },
  remove: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('employees').delete().eq('id', id).eq('owner_id', user?.id || '');
  }
};
