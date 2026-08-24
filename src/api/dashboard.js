import { projectsApi } from './projects.js';
import { employeesApi } from './employees.js';
import { tasksApi } from './tasks.js';

export async function loadDashboard() {
  const [projects, employees, tasks] = await Promise.all([projectsApi.list(), employeesApi.list(), tasksApi.list()]);
  return {
    projects,
    employees,
    tasks
  };
}
