from fastmcp import FastMCP
from database import (
    get_projects,
    create_project,
    get_tasks,
    create_task,
    assign_user_to_project,
    update_task_status
)

mcp = FastMCP("PmsAgent")

# FastMCP might mutate functions, so we wrap them for FastMCP
@mcp.tool()
def mcp_get_projects(owner_id: str | None = None) -> list:
    return get_projects(owner_id)

@mcp.tool()
def mcp_create_project(title: str, description: str, owner_id: str, status: str = "Planning") -> dict:
    return create_project(title, description, owner_id, status)

@mcp.tool()
def mcp_get_tasks(project_id: str) -> list:
    return get_tasks(project_id)

@mcp.tool()
def mcp_create_task(title: str, description: str, project_id: str, status: str = "Todo") -> dict:
    return create_task(title, description, project_id, status)

@mcp.tool()
def mcp_assign_user_to_project(project_id: str, employee_id: str, role: str = "Member") -> dict:
    return assign_user_to_project(project_id, employee_id, role)

@mcp.tool()
def mcp_update_task_status(task_id: str, status: str) -> dict:
    return update_task_status(task_id, status)
