alter table public.tasks 
add column if not exists start_date date,
add column if not exists deadline date;