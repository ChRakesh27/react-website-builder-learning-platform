import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import LoginPage from './pages/authPages/LoginPage';
import HomePage from './pages/pmsPage/HomePage.jsx';
import ProjectsListPage from './pages/pmsPage/ProjectsListPage.jsx';
import ProjectCreatePage from './pages/pmsPage/ProjectCreatePage.jsx';
import ProjectDetailPage from './pages/pmsPage/ProjectDetailPage.jsx';
import TaskDetailPage from './pages/pmsPage/TaskDetailPage.jsx';
import EmployeesPage from './pages/pmsPage/EmployeesPage.jsx';
import EmployeeCreatePage from './pages/pmsPage/EmployeeCreatePage.jsx';
import EmployeeDetailPage from './pages/pmsPage/EmployeeDetailPage.jsx';
import WorkspaceSearchPage from './pages/pmsPage/WorkspaceSearchPage.jsx';
import AIPage from './pages/pmsPage/AIPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/new" element={<ProjectCreatePage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="projects/:id/tasks/:taskId" element={<TaskDetailPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/new" element={<EmployeeCreatePage />} />
        <Route path="employees/:id" element={<EmployeeDetailPage />} />
        <Route path="search" element={<WorkspaceSearchPage />} />
        <Route path="ai" element={<AIPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
