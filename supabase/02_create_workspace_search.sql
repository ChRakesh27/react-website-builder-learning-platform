create index if not exists projects_search_document_idx on public.projects using gin (search_document);
create index if not exists tasks_search_document_idx on public.tasks using gin (search_document);
create index if not exists employees_search_document_idx on public.employees using gin (search_document);
create index if not exists subtasks_search_document_idx on public.subtasks using gin (search_document);

create index if not exists projects_name_trgm_idx on public.projects using gin (name gin_trgm_ops);
create index if not exists projects_owner_trgm_idx on public.projects using gin (owner gin_trgm_ops);
create index if not exists projects_status_trgm_idx on public.projects using gin (status gin_trgm_ops);

create index if not exists tasks_title_trgm_idx on public.tasks using gin (title gin_trgm_ops);
create index if not exists tasks_assignee_trgm_idx on public.tasks using gin (assignee gin_trgm_ops);
create index if not exists tasks_status_trgm_idx on public.tasks using gin (status gin_trgm_ops);

create index if not exists employees_name_trgm_idx on public.employees using gin (name gin_trgm_ops);
create index if not exists employees_role_trgm_idx on public.employees using gin (role gin_trgm_ops);

create index if not exists projects_search_query_idx on public.projects using gin (search_document);
create index if not exists tasks_search_query_idx on public.tasks using gin (search_document);
create index if not exists employees_search_query_idx on public.employees using gin (search_document);
create index if not exists subtasks_search_query_idx on public.subtasks using gin (search_document);

create or replace function public.search_workspace(search_query text, match_limit integer default 20)
returns table (
  entity text,
  id text,
  title text,
  name text,
  key text,
  content text,
  description text,
  status text,
  priority text,
  project_id text,
  task_id text,
  score real,
  rank integer
)
language sql
stable
as $$
  with q as (
    select websearch_to_tsquery('english', search_query) as tsq,
           lower(trim(search_query)) as term
  ),
  projects_result as (
    select
      'project'::text as entity,
      p.id::text as id,
      p.name as title,
      p.name,
      p.key,
      coalesce(p.description, p.owner, p.status) as content,
      p.description,
      p.status,
      null::text as priority,
      null::text as project_id,
      null::text as task_id,
      greatest(
        ts_rank_cd(p.search_document, q.tsq),
        similarity(coalesce(p.name, ''), q.term),
        similarity(coalesce(p.key, ''), q.term),
        similarity(coalesce(p.owner, ''), q.term)
      )::real as score,
      1 as rank
    from public.projects p
    cross join q
    where p.owner_id = auth.uid()
      and (
        p.search_document @@ q.tsq
        or coalesce(p.name, '') % q.term
        or coalesce(p.key, '') % q.term
        or coalesce(p.owner, '') % q.term
        or coalesce(p.status, '') % q.term
      )
  ),
  tasks_result as (
    select
      'task'::text as entity,
      t.id::text as id,
      t.title,
      null::text as name,
      null::text as key,
      coalesce(t.assignee, t.status, t.priority) as content,
      null::text as description,
      t.status,
      t.priority,
      t.project_id::text as project_id,
      null::text as task_id,
      greatest(
        ts_rank_cd(t.search_document, q.tsq),
        similarity(coalesce(t.title, ''), q.term),
        similarity(coalesce(t.assignee, ''), q.term)
      )::real as score,
      2 as rank
    from public.tasks t
    cross join q
    where t.owner_id = auth.uid()
      and (
        t.search_document @@ q.tsq
        or coalesce(t.title, '') % q.term
        or coalesce(t.assignee, '') % q.term
        or coalesce(t.status, '') % q.term
        or coalesce(t.priority, '') % q.term
      )
  ),
  employees_result as (
    select
      'employee'::text as entity,
      emp.id::text as id,
      emp.name as title,
      emp.name,
      null::text as key,
      emp.role as content,
      null::text as description,
      null::text as status,
      null::text as priority,
      null::text as project_id,
      null::text as task_id,
      greatest(
        ts_rank_cd(emp.search_document, q.tsq),
        similarity(coalesce(emp.name, ''), q.term),
        similarity(coalesce(emp.role, ''), q.term)
      )::real as score,
      3 as rank
    from public.employees emp
    cross join q
    where emp.owner_id = auth.uid()
      and (
        emp.search_document @@ q.tsq
        or coalesce(emp.name, '') % q.term
        or coalesce(emp.role, '') % q.term
      )
  ),
  subtasks_result as (
    select
      'subtask'::text as entity,
      s.id::text as id,
      s.title,
      null::text as name,
      null::text as key,
      null::text as content,
      null::text as description,
      null::text as status,
      null::text as priority,
      null::text as project_id,
      s.task_id::text as task_id,
      greatest(
        ts_rank_cd(s.search_document, q.tsq),
        similarity(coalesce(s.title, ''), q.term)
      )::real as score,
      4 as rank
    from public.subtasks s
    cross join q
    where s.owner_id = auth.uid()
      and (
        s.search_document @@ q.tsq
        or coalesce(s.title, '') % q.term
      )
  )
  select * from projects_result
  union all
  select * from tasks_result
  union all
  select * from employees_result
  union all
  select * from subtasks_result
  order by score desc, rank asc, id desc
  limit match_limit;
$$;
