import os
from pydantic_ai import Agent

try:
    from .database import (
        get_projects,
        get_project,
        get_employees,
        get_employee,
        create_project,
        update_project,
        delete_project,
        create_employee,
        update_employee,
        delete_employee,
        get_tasks,
        get_task,
        create_task,
        update_task,
        delete_task,
        get_subtasks,
        create_subtask,
        update_subtask,
        delete_subtask,
        assign_user_to_project,
        update_task_status,
        search_workspace,
        get_employee_projects,
        get_project_members,
    )
except ImportError:
    from database import (
        get_projects,
        get_project,
        get_employees,
        get_employee,
        create_project,
        update_project,
        delete_project,
        create_employee,
        update_employee,
        delete_employee,
        get_tasks,
        get_task,
        create_task,
        update_task,
        delete_task,
        get_subtasks,
        create_subtask,
        update_subtask,
        delete_subtask,
        assign_user_to_project,
        update_task_status,
        search_workspace,
        get_employee_projects,
        get_project_members,
    )

model = 'openai:gpt-4o-mini'

# Create the agent
agent = Agent(
    model,
system_prompt=(
        "You are an AI assistant integrated into a project management application. "
        "You help users manage their projects, tasks, and team members. "
        "You can create, read, update, and delete projects, employees, tasks, and subtasks. "
        "You can also assign users to projects and fetch information about existing records. "
        "To find out which projects an employee works on, use get_employee_projects. "
        "To find out who is working on a project, use get_project_members. "
        "When the user wants to search for something across the workspace, use the search_workspace tool, which uses a vector database for fuzzy text search. "
        "When the user wants to create an employee, use the employee creation tool. "
        "When the user wants to assign an employee to a project, prefer an existing employee record "
        "and use name or email to resolve it. Always be concise and helpful. Never guess assignments; use the tools to check."
    )
)

# Register tools with the agent
# Note: These are the underlying python functions from the FastMCP tools
agent.tool_plain(get_projects)
agent.tool_plain(get_project)
agent.tool_plain(get_employees)
agent.tool_plain(get_employee)
agent.tool_plain(create_project)
agent.tool_plain(update_project)
agent.tool_plain(delete_project)
agent.tool_plain(create_employee)
agent.tool_plain(update_employee)
agent.tool_plain(delete_employee)
agent.tool_plain(get_tasks)
agent.tool_plain(get_task)
agent.tool_plain(create_task)
agent.tool_plain(update_task)
agent.tool_plain(delete_task)
agent.tool_plain(get_subtasks)
agent.tool_plain(create_subtask)
agent.tool_plain(update_subtask)
agent.tool_plain(delete_subtask)
agent.tool_plain(assign_user_to_project)
agent.tool_plain(update_task_status)
agent.tool_plain(search_workspace)
agent.tool_plain(get_employee_projects)
agent.tool_plain(get_project_members)

