ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS database_name text,
ADD COLUMN IF NOT EXISTS database_plan text,
ADD COLUMN IF NOT EXISTS account_name text;
