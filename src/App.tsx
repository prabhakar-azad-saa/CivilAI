import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { NewProjectPage } from './pages/NewProjectPage';
import { RequirementsWizardPage } from './pages/RequirementsWizardPage';
import { DesignAlternativesPage } from './pages/DesignAlternativesPage';
import { DesignWorkspacePage } from './pages/DesignWorkspacePage';
import { ExportPackagePage } from './pages/ExportPackagePage';

// Subroute Redirectors to ensure deep-linking specified in prompt Section 6 works seamlessly
const DesignTabRedirect: React.FC<{ tab: string }> = ({ tab }) => {
  const location = useLocation();
  const basePath = location.pathname.replace(new RegExp(`/${tab}$`), '');
  return <Navigate to={`${basePath}?tab=${tab}`} replace />;
};

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  // Hide footer on design workspace & wizard for maximum drawing canvas space
  const isWorkspace =
    location.pathname.includes('/designs/') ||
    location.pathname.includes('/requirements') ||
    location.pathname.includes('/export');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!isWorkspace && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          {/* 1. Marketing Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Projects Workspace */}
          <Route path="/projects" element={<ProjectsPage />} />

          {/* 3. New Project Creation Dedicated Screen */}
          <Route path="/projects/new" element={<NewProjectPage />} />

          {/* 4. Requirements Wizard (10 Categories) */}
          <Route path="/projects/:id/requirements" element={<RequirementsWizardPage />} />

          {/* 5. Three Generated Design Alternatives */}
          <Route path="/projects/:id/designs" element={<DesignAlternativesPage />} />

          {/* 6. Selected Design Workspace (Overview, Plan, 3D, Chat, Cost) */}
          <Route path="/projects/:id/designs/:designId" element={<DesignWorkspacePage />} />

          {/* Deep link direct route aliases as requested in Section 6 */}
          <Route
            path="/projects/:id/designs/:designId/plan"
            element={<DesignTabRedirect tab="plan" />}
          />
          <Route
            path="/projects/:id/designs/:designId/3d"
            element={<DesignTabRedirect tab="3d" />}
          />
          <Route
            path="/projects/:id/designs/:designId/cost"
            element={<DesignTabRedirect tab="cost" />}
          />

          {/* 7. Final Export & Review Dossier */}
          <Route path="/projects/:id/export" element={<ExportPackagePage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
