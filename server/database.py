import os
from dotenv import load_dotenv
from supabase import create_client, Client, ClientOptions
import re
from contextvars import ContextVar

ctx_owner_id: ContextVar[str | None] = ContextVar("ctx_owner_id", default=None)
ctx_access_token: ContextVar[str | None] = ContextVar("ctx_access_token", default=None)

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    or os.environ.get("SUPABASE_SECRET_KEY", "")
    or os.environ.get("SUPABASE_KEY", "")
)
uses_service_role = bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SECRET_KEY"))
supabase: Client = create_client(supabase_url, supabase_key)


def _is_uuid(value: str | None) -> bool:
    if not value:
        return False
    return bool(re.fullmatch(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", str(value).strip()))


def create_supabase_client(access_token: str | None = None) -> Client:
    """Create a Supabase client scoped to the current user's JWT when provided."""
    token = access_token or ctx_access_token.get()
    
    # Filter out invalid tokens (like "None", "null", or missing dots) to avoid PostgREST PGRST301
    if token and (token in ("None", "null", "undefined") or len(str(token).split(".")) != 3):
        token = None

    if token:
        print("[db] creating user-scoped supabase client with access token")
        return create_client(
            supabase_url,
            supabase_key,
            options=ClientOptions(
                headers={
                    "Authorization": f"Bearer {token}",
                }
            ),
        )

    print("[db] creating default supabase client without access token")
    return supabase

def get_projects(
    owner_id: str | None = None,
    status: str | None = None,
    field_name: str | None = None,
    field_value: str | None = None
) -> list:
    """Fetch all projects from the database."""
    query = create_supabase_client().table("projects").select("*")
    if _is_uuid(owner_id):
        query = query.eq("owner_id", owner_id)
    elif owner_id:
        print(f"[db] ignoring invalid project owner_id filter: {owner_id!r}")
        
    if status is not None:
        query = query.eq("status", status)
    if field_name and field_value:
        if field_name == "title":
            field_name = "name"
        query = query.ilike(field_name, f"%{field_value}%")
        
    response = query.execute()
    if getattr(response, "error", None):
        raise RuntimeError(f"Failed to fetch projects: {response.error}")
    print("==>",response.data)
    return response.data or []

def resolve_employee_id(employee_ref: str | int) -> int | None:
    """Resolve an employee identifier from either a numeric id, email, or name."""
    if isinstance(employee_ref, int):
        return employee_ref

    text = str(employee_ref).strip()
    if text.isdigit():
        return int(text)

    response = (
        create_supabase_client().table("employees")
        .select("id")
        .or_(f"email.eq.{text},name.eq.{text}")
        .limit(1)
        .execute()
    )
    if response.data:
        return response.data[0]["id"]
    return None

def resolve_project_id(project_id: str | int) -> int | None:
    """Resolve a project identifier from either a numeric id, key, or name."""
    if isinstance(project_id, int):
        return project_id

    text = str(project_id).strip()
    if text.isdigit():
        return int(text)

    response = (
        create_supabase_client().table("projects")
        .select("id")
        .or_(f"name.eq.{text},key.eq.{text}")
        .limit(1)
        .execute()
    )
    if response.data:
        return response.data[0]["id"]
    return None

def create_project(title: str, description: str, owner_id: str | None = None, status: str = "Planning") -> dict:
    """Create a new project."""
    owner = owner_id or ctx_owner_id.get()
    response = create_supabase_client().table("projects").insert({
        "name": title,
        "description": description,
        "key": title.upper().replace(" ", "-"),
        "owner_id": owner,
        "status": status
    }).execute()
    return response.data[0] if response.data else {}

def get_project(project_id: str | int, owner_id: str | None = None) -> dict:
    """Fetch a single project by id."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        return {}
    query = create_supabase_client().table("projects").select("*").eq("id", resolved_project_id)
    if _is_uuid(owner_id):
        query = query.eq("owner_id", owner_id)
    response = query.limit(1).execute()
    return response.data[0] if response.data else {}

def update_project(
    project_id: str | int,
    owner_id: str,
    title: str | None = None,
    description: str | None = None,
    status: str | None = None
) -> dict:
    """Update a project record."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        raise RuntimeError(f"Project not found: {project_id}")
    payload = {k: v for k, v in {
        "name": title,
        "description": description,
        "status": status,
    }.items() if v is not None}
    if title:
        payload["key"] = title.upper().replace(" ", "-")
    response = create_supabase_client().table("projects").update(payload).eq("id", resolved_project_id).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def delete_project(project_id: str | int, owner_id: str) -> dict:
    """Delete a project record."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        raise RuntimeError(f"Project not found: {project_id}")
    response = create_supabase_client().table("projects").delete().eq("id", resolved_project_id).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def get_employees(
    owner_id: str | None = None, 
    role: str | None = None,
    field_name: str | None = None,
    field_value: str | None = None,
    access_token: str | None = None
) -> list:
    """Fetch all employees from the database."""
    client = create_supabase_client(access_token)
    query = client.table("employees").select("*")
    if _is_uuid(owner_id):
        query = query.eq("owner_id", owner_id)
    elif owner_id:
        print(f"[db] ignoring invalid employee owner_id filter: {owner_id!r}")
        
    if role is not None:
        query = query.eq("role", role)
    if field_name and field_value:
        query = query.ilike(field_name, f"%{field_value}%")
        
    response = query.execute()
    if getattr(response, "error", None):
        raise RuntimeError(f"Failed to fetch employees: {response.error}")
    print("[db] get_employees response:", response.data)
    return response.data or []

def get_employee(employee_id: str | int, owner_id: str | None = None, access_token: str | None = None) -> dict:
    """Fetch a single employee by id."""
    client = create_supabase_client(access_token)
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        return {}
    query = client.table("employees").select("*").eq("id", resolved_employee_id)
    if _is_uuid(owner_id):
        query = query.eq("owner_id", owner_id)
    elif owner_id:
        print(f"[db] ignoring invalid employee owner_id filter: {owner_id!r}")
    response = query.limit(1).execute()
    return response.data[0] if response.data else {}

def create_employee(
    name: str,
    owner_id: str | None = None,
    role: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    avatar_url: str | None = None,
    access_token: str | None = None,
) -> dict:
    """Create a new employee record."""
    owner = owner_id or ctx_owner_id.get()
    token = access_token or ctx_access_token.get()
    
    print("[db] create_employee called:", {
        "name": name,
        "owner_id": owner,
        "role": role,
        "email": email,
        "phone": phone,
        "avatar_url": avatar_url,
        "has_access_token": bool(token),
        "uses_service_role": uses_service_role,
    })
    if not owner:
        raise RuntimeError("owner_id is required to create an employee")
    client = create_supabase_client(token)
    try:
        response = client.table("employees").insert({
            "name": name,
            "role": role,
            "email": email,
            "phone": phone,
            "avatar_url": avatar_url,
            "owner_id": owner,
        }).execute()
        print("[db] create_employee response:", response.data)
    except Exception as exc:
        print("[db] create_employee error:", repr(exc))
        raise
    return response.data[0] if response.data else {}

def update_employee(
    employee_id: str | int,
    owner_id: str,
    name: str | None = None,
    role: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    avatar_url: str | None = None,
) -> dict:
    """Update an employee record."""
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        raise RuntimeError(f"Employee not found: {employee_id}")
    payload = {k: v for k, v in {
        "name": name,
        "role": role,
        "email": email,
        "phone": phone,
        "avatar_url": avatar_url,
    }.items() if v is not None}
    response = create_supabase_client().table("employees").update(payload).eq("id", resolved_employee_id).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def delete_employee(employee_id: str | int, owner_id: str) -> dict:
    """Delete an employee record."""
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        raise RuntimeError(f"Employee not found: {employee_id}")
    response = create_supabase_client().table("employees").delete().eq("id", resolved_employee_id).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def get_tasks(
    project_id: str | int | None = None,
    status: str | None = None,
    field_name: str | None = None,
    field_value: str | None = None
) -> list:
    """Fetch all tasks, optionally filtered by project or other fields."""
    query = create_supabase_client().table("tasks").select("*")
    if project_id is not None:
        resolved_project_id = resolve_project_id(project_id)
        if resolved_project_id is not None:
            query = query.eq("project_id", resolved_project_id)
    if status is not None:
        query = query.eq("status", status)
    if field_name and field_value:
        if field_name == "name":
            field_name = "title"
        query = query.ilike(field_name, f"%{field_value}%")
    
    response = query.execute()
    return response.data or []

def create_task(title: str, project_id: str, status: str = "Todo", task_type: str = "Task", priority: str = "Medium", assignee: str | None = None, start_date: str | None = None, deadline: str | None = None) -> dict:
    """Create a new task under a project."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        raise RuntimeError(f"Project not found: {project_id}")
        
    owner = ctx_owner_id.get()
    if not owner:
        raise RuntimeError("owner_id context is missing")
        
    response = create_supabase_client().table("tasks").insert({
        "title": title,
        "project_id": resolved_project_id,
        "status": status,
        "type": task_type,
        "priority": priority,
        "assignee": assignee,
        "start_date": start_date,
        "deadline": deadline,
        "owner_id": owner
    }).execute()
    return response.data[0] if response.data else {}

def get_task(task_id: str | int) -> dict:
    """Fetch a single task by id."""
    if isinstance(task_id, int) or str(task_id).isdigit():
        response = create_supabase_client().table("tasks").select("*").eq("id", int(task_id)).limit(1).execute()
        return response.data[0] if response.data else {}
    return {}

def update_task(
    task_id: str | int,
    owner_id: str,
    title: str | None = None,
    status: str | None = None,
    task_type: str | None = None,
    priority: str | None = None,
    assignee: str | None = None,
    project_id: str | int | None = None,
    start_date: str | None = None,
    deadline: str | None = None,
) -> dict:
    """Update a task record."""
    payload = {k: v for k, v in {
        "title": title,
        "status": status,
        "type": task_type,
        "priority": priority,
        "assignee": assignee,
        "start_date": start_date,
        "deadline": deadline,
    }.items() if v is not None}
    if project_id is not None:
        resolved_project_id = resolve_project_id(project_id)
        if resolved_project_id is None:
            raise RuntimeError(f"Project not found: {project_id}")
        payload["project_id"] = resolved_project_id
    response = create_supabase_client().table("tasks").update(payload).eq("id", int(task_id)).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def delete_task(task_id: str | int, owner_id: str) -> dict:
    """Delete a task record."""
    response = create_supabase_client().table("tasks").delete().eq("id", int(task_id)).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def assign_user_to_project(project_id: str, employee_id: str, role: str = "Member") -> dict:
    """Assign an employee/user to a project."""
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        raise RuntimeError(f"Employee not found: {employee_id}")
    
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        raise RuntimeError(f"Project not found: {project_id}")
    
    # We need the employee's name/email to satisfy project_members constraints
    employee = get_employee(resolved_employee_id)
    if not employee:
        raise RuntimeError(f"Failed to fetch employee details for ID: {resolved_employee_id}")

    owner = ctx_owner_id.get()
    if not owner:
        raise RuntimeError("owner_id context is missing")

    response = create_supabase_client().table("project_members").insert({
        "project_id": resolved_project_id,
        "employee_id": resolved_employee_id,
        "role": role,
        "name": employee.get("name", "Unknown"),
        "email": employee.get("email"),
        "owner_id": owner
    }).execute()
    return response.data[0] if response.data else {}

def get_employee_projects(employee_id: str | int) -> list:
    """Fetch all projects assigned to an employee."""
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        return []
    
    response = create_supabase_client().table("project_members").select("project_id").eq("employee_id", resolved_employee_id).execute()
    if not response.data:
        return []
    
    project_ids = [row["project_id"] for row in response.data]
    projects_response = create_supabase_client().table("projects").select("*").in_("id", project_ids).execute()
    return projects_response.data or []

def get_project_members(project_id: str | int) -> list:
    """Fetch all employees assigned to a project."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        return []
    
    response = create_supabase_client().table("project_members").select("employee_id, role, name, email").eq("project_id", resolved_project_id).execute()
    return response.data or []

def update_task_status(task_id: str, status: str) -> dict:
    """Update the status of a task."""
    response = create_supabase_client().table("tasks").update({"status": status}).eq("id", task_id).execute()
    return response.data[0] if response.data else {}

def get_subtasks(task_id: str | int | None = None) -> list:
    """Fetch subtasks, optionally filtered by task."""
    query = create_supabase_client().table("subtasks").select("*")
    if task_id is not None:
        query = query.eq("task_id", int(task_id))
    response = query.execute()
    return response.data or []

def create_subtask(title: str, task_id: str, status: str | None = None, priority: str | None = None) -> dict:
    """Create a subtask under a task."""
    owner = ctx_owner_id.get()
    if not owner:
        raise RuntimeError("owner_id context is missing")
        
    response = create_supabase_client().table("subtasks").insert({
        "title": title,
        "task_id": int(task_id),
        "status": status,
        "priority": priority,
        "owner_id": owner
    }).execute()
    return response.data[0] if response.data else {}

def update_subtask(
    subtask_id: str | int,
    owner_id: str,
    title: str | None = None,
    status: str | None = None,
    priority: str | None = None,
    task_id: str | int | None = None,
) -> dict:
    """Update a subtask record."""
    payload = {k: v for k, v in {
        "title": title,
        "status": status,
        "priority": priority,
    }.items() if v is not None}
    if task_id is not None:
        payload["task_id"] = int(task_id)
    response = create_supabase_client().table("subtasks").update(payload).eq("id", int(subtask_id)).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def delete_subtask(subtask_id: str | int, owner_id: str) -> dict:
    """Delete a subtask record."""
    response = create_supabase_client().table("subtasks").delete().eq("id", int(subtask_id)).eq("owner_id", owner_id).execute()
    return response.data[0] if response.data else {}

def search_workspace(search_query: str, match_limit: int = 20, access_token: str | None = None) -> list:
    """
    Search the workspace using vector database (projects, tasks, employees, subtasks).
    Uses full-text search and trigram similarity to find matching records.
    """
    client = create_supabase_client(access_token)
    response = client.rpc(
        "search_workspace",
        {"search_query": search_query, "match_limit": match_limit}
    ).execute()
    if getattr(response, "error", None):
        raise RuntimeError(f"Search failed: {response.error}")
    return response.data or []

