import { projectsApi } from './projects.js';
import { teamsApi } from './teams.js';
import { tasksApi } from './tasks.js';

export async function loadDashboard() {
  const [projects, teams, tasks] = await Promise.all([projectsApi.list(), teamsApi.list(), tasksApi.list()]);
  return {
    projects,
    teams,
    tasks
  };
}
