ALTER TABLE public.project_members 
ADD COLUMN IF NOT EXISTS employee_id bigint references public.employees(id) on delete set null;

-- This command forces the Supabase API to reload its schema cache
NOTIFY pgrst, 'reload schema';
