import { supabase } from '../lib/supabaseClient.js';

export const searchApi = {
  workspace: async (query, limit = 20) => supabase.rpc('search_workspace', { search_query: query, match_limit: limit })
};
