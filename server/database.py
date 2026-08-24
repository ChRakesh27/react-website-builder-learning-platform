import os
from dotenv import load_dotenv
from supabase import create_client, Client, ClientOptions

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL", "")
supabase_key = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    or os.environ.get("SUPABASE_SECRET_KEY", "")
    or os.environ.get("SUPABASE_KEY", "")
)
uses_service_role = bool(os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SECRET_KEY"))
supabase: Client = create_client(supabase_url, supabase_key)


def create_supabase_client(access_token: str | None = None) -> Client:
    """Create a Supabase client scoped to the current user's JWT when provided."""
    if access_token:
        print("[db] creating user-scoped supabase client with access token")
        return create_client(
            supabase_url,
            supabase_key,
            options=ClientOptions(
                headers={
                    "Authorization": f"Bearer {access_token}",
                }
            ),
        )

    print("[db] creating default supabase client without access token")
    return supabase

def get_projects(owner_id: str | None = None) -> list:
    """Fetch all projects from the database."""
    query = supabase.table("projects").select("*")
    if owner_id:
        query = query.eq("owner_id", owner_id)
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
        supabase.table("employees")
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
        supabase.table("projects")
        .select("id")
        .or_(f"name.eq.{text},key.eq.{text}")
        .limit(1)
        .execute()
    )
    if response.data:
        return response.data[0]["id"]
    return None

def create_project(title: str, description: str, owner_id: str, status: str = "Planning") -> dict:
    """Create a new project."""
    response = supabase.table("projects").insert({
        "name": title,
        "description": description,
        "key": title.upper().replace(" ", "-"),
        "owner_id": owner_id,
        "status": status
    }).execute()
    return response.data[0] if response.data else {}

def create_employee(
    name: str,
    owner_id: str,
    role: str | None = None,
    email: str | None = None,
    phone: str | None = None,
    avatar_url: str | None = None,
    access_token: str | None = None,
) -> dict:
    """Create a new employee record."""
    print("[db] create_employee called:", {
        "name": name,
        "owner_id": owner_id,
        "role": role,
        "email": email,
        "phone": phone,
        "avatar_url": avatar_url,
        "has_access_token": bool(access_token),
        "uses_service_role": uses_service_role,
    })
    if not owner_id:
        raise RuntimeError("owner_id is required to create an employee")
    client = create_supabase_client(access_token)
    try:
        response = client.table("employees").insert({
            "name": name,
            "role": role,
            "email": email,
            "phone": phone,
            "avatar_url": avatar_url,
            "owner_id": owner_id,
        }).execute()
        print("[db] create_employee response:", response.data)
    except Exception as exc:
        print("[db] create_employee error:", repr(exc))
        raise
    return response.data[0] if response.data else {}

def get_tasks(project_id: str) -> list:
    """Fetch all tasks for a given project."""
    resolved_project_id = resolve_project_id(project_id)
    if resolved_project_id is None:
        return []
    response = supabase.table("tasks").select("*").eq("project_id", resolved_project_id).execute()
    return response.data

def create_task(title: str, project_id: str, status: str = "Todo", task_type: str = "Task", priority: str = "Medium", assignee: str | None = None) -> dict:
    """Create a new task under a project."""
    response = supabase.table("tasks").insert({
        "title": title,
        "project_id": project_id,
        "status": status,
        "type": task_type,
        "priority": priority,
        "assignee": assignee
    }).execute()
    return response.data[0] if response.data else {}

def assign_user_to_project(project_id: str, employee_id: str, role: str = "Member") -> dict:
    """Assign an employee/user to a project."""
    resolved_employee_id = resolve_employee_id(employee_id)
    if resolved_employee_id is None:
        raise RuntimeError(f"Employee not found: {employee_id}")
    response = supabase.table("project_members").insert({
        "project_id": project_id,
        "employee_id": resolved_employee_id,
        "role": role
    }).execute()
    return response.data[0] if response.data else {}

def update_task_status(task_id: str, status: str) -> dict:
    """Update the status of a task."""
    response = supabase.table("tasks").update({"status": status}).eq("id", task_id).execute()
    return response.data[0] if response.data else {}
