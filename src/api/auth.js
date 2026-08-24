import { supabase } from "../lib/supabaseClient.js";

export const auth = {
  currentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data: data?.user || null, error };
  },
  get: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data: { user: data?.session?.user || null }, error };
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
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
