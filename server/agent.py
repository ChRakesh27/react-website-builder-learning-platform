import os
from pydantic_ai import Agent

try:
    from .database import (
        get_projects,
        create_project,
        create_employee,
        get_tasks,
        create_task,
        assign_user_to_project,
        update_task_status,
    )
except ImportError:
    from database import (
        get_projects,
        create_project,
        create_employee,
        get_tasks,
        create_task,
        assign_user_to_project,
        update_task_status
    )

model = 'openai:gpt-4o-mini'

# Create the agent
agent = Agent(
    model,
system_prompt=(
        "You are an AI assistant integrated into a project management application. "
        "You help users manage their projects, tasks, and team members. "
        "You can create projects, create employees, create tasks, assign users, and fetch information "
        "about existing projects, employees, and tasks. When the user wants to create an employee, "
        "use the employee creation tool. When the user wants to assign an employee to a project, "
        "prefer an existing employee record and use name or email to resolve it. Always be concise and helpful."
    )
)

# Register tools with the agent
# Note: These are the underlying python functions from the FastMCP tools
agent.tool_plain(get_projects)
agent.tool_plain(create_project)
agent.tool_plain(create_employee)
agent.tool_plain(get_tasks)
agent.tool_plain(create_task)
agent.tool_plain(assign_user_to_project)
agent.tool_plain(update_task_status)
