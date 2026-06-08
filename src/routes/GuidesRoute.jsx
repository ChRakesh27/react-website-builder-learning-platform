import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import ChecklistPage from "../pages/ChecklistPage.jsx";
import CodeLabPage from "../pages/CodeLabPage.jsx";
import DeploymentPage from "../pages/DeploymentPage.jsx";
import GuidesPage from "../pages/GuidesPage.jsx";
import Home from "../pages/Home.jsx";
import LayoutsPage from "../pages/LayoutsPage.jsx";
import NamingRulesPage from "../pages/NamingRulesPage.jsx";
import PromptLibraryPage from "../pages/PromptLibraryPage.jsx";
import SectionDetailsPage from "../pages/SectionDetailsPage.jsx";
import SectionsPage from "../pages/SectionsPage.jsx";
import SeoSitemapPage from "../pages/SeoSitemapPage.jsx";
import StyleGuidePage from "../pages/StyleGuidePage.jsx";
import TypographyPage from "../pages/TypographyPage.jsx";

function GuidesRoute() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="sections/:slug" element={<SectionDetailsPage />} />
        <Route path="layouts" element={<LayoutsPage />} />
        <Route path="guides" element={<GuidesPage />} />
        <Route path="typography" element={<TypographyPage />} />
        <Route path="naming-rules" element={<NamingRulesPage />} />
        <Route path="style-guide" element={<StyleGuidePage />} />
        <Route path="ui-checklist" element={<ChecklistPage />} />
        <Route path="seo-sitemap" element={<SeoSitemapPage />} />
        <Route path="deployment" element={<DeploymentPage />} />
        <Route path="prompt-library" element={<PromptLibraryPage />} />
        <Route path="code-lab" element={<CodeLabPage />} />
      </Route>
    </Routes>
  );
}

export default GuidesRoute;
