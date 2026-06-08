import { Route, Routes } from "react-router-dom";
import GuidesRoute from "./routes/GuidesRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/*" element={<GuidesRoute />} />
    </Routes>
  );
}
