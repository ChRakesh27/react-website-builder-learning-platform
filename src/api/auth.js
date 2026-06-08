import { supabase } from "../lib/supabaseClient.js";

export const auth = {
  get: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },
  update: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { data, error };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  signIn: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  signUp: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },
};
