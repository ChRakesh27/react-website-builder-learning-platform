alter table if exists public.projects
  add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table if exists public.tasks
  add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table if exists public.subtasks
  add column if not exists owner_id uuid references auth.users(id) on delete cascade;

alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;

drop policy if exists projects_owner_access on public.projects;
create policy projects_owner_access on public.projects
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists projects_read_all on public.projects;
create policy projects_read_all on public.projects
for select
using (true);

drop policy if exists tasks_owner_access on public.tasks;
create policy tasks_owner_access on public.tasks
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists tasks_read_all on public.tasks;
create policy tasks_read_all on public.tasks
for select
using (true);

drop policy if exists subtasks_owner_access on public.subtasks;
create policy subtasks_owner_access on public.subtasks
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists subtasks_read_all on public.subtasks;
create policy subtasks_read_all on public.subtasks
for select
using (true);
