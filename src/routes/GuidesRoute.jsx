import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import ChecklistPage from "../pages/guildesPages/ChecklistPage.jsx";
import CodeLabPage from "../pages/guildesPages/CodeLabPage.jsx";
import DeploymentPage from "../pages/guildesPages/DeploymentPage.jsx";
import GuidesPage from "../pages/guildesPages/GuidesPage.jsx";
import Home from "../pages/guildesPages/Home.jsx";
import LayoutsPage from "../pages/guildesPages/LayoutsPage.jsx";
import NamingRulesPage from "../pages/guildesPages/NamingRulesPage.jsx";
import PromptLibraryPage from "../pages/guildesPages/PromptLibraryPage.jsx";
import SectionDetailsPage from "../pages/guildesPages/SectionDetailsPage.jsx";
import SectionsPage from "../pages/guildesPages/SectionsPage.jsx";
import SeoSitemapPage from "../pages/guildesPages/SeoSitemapPage.jsx";
import StyleGuidePage from "../pages/guildesPages/StyleGuidePage.jsx";
import TypographyPage from "../pages/guildesPages/TypographyPage.jsx";

function GuidesRoute() {
  return (
    <Routes>
      <Route path="/">
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
