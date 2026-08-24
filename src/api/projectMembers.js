import { supabase } from '../lib/supabaseClient.js';
import { auth } from './auth.js';

export const projectMembersApi = {
  list: async (projectId) => {
    const { data: user } = await auth.currentUser();
    return supabase
      .from('project_members')
      .select('*, employees(*)')
      .eq('owner_id', user?.id || '')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
  },
  listByEmployee: async (employeeId) => {
    const { data: user } = await auth.currentUser();
    return supabase
      .from('project_members')
      .select('*, projects(*)')
      .eq('owner_id', user?.id || '')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });
  },
  create: async (payload) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('project_members').insert({ ...payload, owner_id: user?.id || null }).select().single();
  },
  remove: async (id) => {
    const { data: user } = await auth.currentUser();
    return supabase.from('project_members').delete().eq('id', id).eq('owner_id', user?.id || '');
  }
};
