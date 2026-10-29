import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Compass,
  Layers,
  Box,
  MessageSquare,
  IndianRupee,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  History,
  RotateCcw,
  Check,
  ArrowRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { Project } from '../types/project';
import { DesignConcept, CostEstimate } from '../types/design';
import { MockProjectService } from '../services/mockProjectService';
import { MockDesignService } from '../services/mockDesignService';
import { MockCostService } from '../services/mockCostService';
import { SvgFloorPlan } from '../components/floor-plan/SvgFloorPlan';
import { ThreeDConceptViewer } from '../components/three-d-viewer/ThreeDConceptViewer';
import { CostEstimatorView } from '../components/cost-estimator/CostEstimatorView';
import { AiRefinementChat } from '../components/chat/AiRefinementChat';
import { PlanTo3DConverterModal } from '../components/three-d-viewer/PlanTo3DConverterModal';

type WorkspaceTab = 'overview' | 'plan' | '3d' | 'chat' | 'cost';

export const DesignWorkspacePage: React.FC = () => {
  const { id, designId } = useParams<{ id: string; designId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [project, setProject] = useState<Project | null>(null);
  const [allDesigns, setAllDesigns] = useState<DesignConcept[]>([]);
  const [design, setDesign] = useState<DesignConcept | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpload2DModalOpen, setIsUpload2DModalOpen] = useState<boolean>(false);

  // Tab state (defaults to 'overview', or respects ?tab= URL param)
  const activeTab = (searchParams.get('tab') as WorkspaceTab) || 'overview';
  const setActiveTab = (tab: WorkspaceTab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    async function load() {
      if (!id || !designId) return;
      const p = await MockProjectService.getProjectById(id);
      if (p) {
        setProject(p);
        const dList = await MockDesignService.getDesignsForProject(id);
        setAllDesigns(dList);
        const current = dList.find((d) => d.id === designId) || dList[0];
        setDesign(current || null);
      }
      setLoading(false);
    }
    load();
  }, [id, designId]);

  const handleDesignSwitch = (newDesignId: string) => {
    navigate(`/projects/${id}/designs/${newDesignId}?tab=${activeTab}`);
  };

  const handleDesignUpdated = (updated: DesignConcept) => {
    setDesign(updated);
    setAllDesigns((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleCostUpdated = async (updatedCost: CostEstimate) => {
    if (!design) return;
    const { design: updated } = await MockDesignService.addRevision(
      design.id,
      `Adjusted preliminary cost parameters (Rate: ₹${updatedCost.ratePerSqFt}/sq ft)`,
      ['costEstimate'],
      { costEstimate: updatedCost }
    );
    handleDesignUpdated(updated);
  };

  if (loading || !design || !project) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-stone-600 font-mono text-sm">
          <Sparkles className="w-5 h-5 animate-spin text-olive-700" />
          <span>Opening design workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top Bar with Project Breadcrumb & Global Workspace Status */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumbs & Design Title */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <Link to="/projects" className="text-stone-500 hover:text-charcoal-900 font-medium">
              Projects
            </Link>
            <span className="text-stone-300">/</span>
            <Link
              to={`/projects/${project.id}/designs`}
              className="text-stone-600 hover:text-charcoal-900 truncate max-w-[150px] font-medium"
            >
              {project.name}
            </Link>
            <span className="text-stone-300">/</span>

            {/* Design Selector Switcher */}
            <div className="relative inline-block">
              <select
                value={design.id}
                onChange={(e) => handleDesignSwitch(e.target.value)}
                className="bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-md font-semibold text-charcoal-900 px-2.5 py-1 text-xs cursor-pointer focus:outline-none"
              >
                {allDesigns.map((d) => (
                  <option key={d.id} value={d.id}>
                    Concept {d.codeName}: {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Revision Badge */}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-olive-100 text-olive-800 border border-olive-200">
              {design.currentRevision}
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-stone-400">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Saved
            </span>
          </div>

          {/* Quick Actions & Export Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUpload2DModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Upload 2D Plan → AI 3D</span>
            </button>

            <Link
              to={`/projects/${project.id}/designs`}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors hidden sm:inline-block"
            >
              All 3 Alternatives
            </Link>

            <Link
              to={`/projects/${project.id}/export`}
              className="px-4 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Package</span>
            </Link>
          </div>
        </div>

        {/* Primary Subnavigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 border-t border-stone-100 flex items-center gap-1 sm:gap-6 overflow-x-auto text-xs font-medium scrollbar-none">
          {[
            { id: 'overview', label: 'Concept Overview', icon: Compass },
            { id: 'plan', label: '2D Floor Plan (SVG)', icon: Layers },
            { id: '3d', label: '3D Studio & Cutaways', icon: Box, badge: 'HD 3D' },
            { id: 'chat', label: 'AI Refinement Chat', icon: MessageSquare, badge: 'Live Demo' },
            { id: 'cost', label: 'Construction Estimate', icon: IndianRupee }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={`py-3 px-2.5 sm:px-3 border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
                  isTabActive
                    ? 'border-charcoal-900 text-charcoal-950 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isTabActive ? 'text-olive-700' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-terracotta-100 text-terracotta-800">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Image & Design Identity Header */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12">
              <div className="relative lg:col-span-7 h-72 lg:h-auto bg-stone-100">
                <img
                  src={design.coverImage}
                  alt={design.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = design.backupImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-olive-700 text-white uppercase tracking-wider">
                    {design.architecturalStyle}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1.5 text-white">
                    {design.title}
                  </h2>
                  <p className="text-stone-300 text-xs mt-1 max-w-xl">{design.subtitle}</p>
                </div>
              </div>

              {/* Identity & Key Specs */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-2">
                    <span>CODE: CONCEPT {design.codeName}</span>
                    <span className="text-olive-700 font-bold">{design.vastuScorePercent}% VASTU COMPLIANT</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {design.description}
                  </p>
                </div>

                {/* Spatial Grid */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-stone-100 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">Proposed Built-Up</span>
                    <span className="font-mono text-base font-bold text-charcoal-900">
                      {design.builtUpAreaSqFt} sq ft
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">Usable Carpet Area</span>
                    <span className="font-mono text-base font-bold text-charcoal-900">
                      {design.carpetAreaSqFt} sq ft
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">Bedrooms / Baths</span>
                    <span className="text-xs font-semibold text-charcoal-900">
                      {design.bedroomsCount} BHK / {design.bathroomsCount} Bathrooms
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 font-mono block">Parking Type</span>
                    <span className="text-xs font-semibold text-charcoal-900">
                      {design.parkingType}
                    </span>
                  </div>
                </div>

                {/* Preliminary Budget Overview */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-stone-400 block">
                        Preliminary Civil Estimate
                      </span>
                      <span className="font-serif text-lg font-bold text-olive-800">
                        {MockCostService.formatINR(design.costEstimate.totalPreliminaryEstimate)}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('cost')}
                      className="text-xs font-semibold text-stone-700 hover:text-charcoal-950 underline"
                    >
                      Inspect Breakdown →
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setActiveTab('3d')}
                    className="py-2 px-2 rounded-lg bg-olive-700 hover:bg-olive-800 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Box className="w-3.5 h-3.5 text-amber-300" />
                    <span>HD 3D Studio</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className="py-2 px-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>2D Vector Plan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="py-2 px-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-olive-700" />
                    <span>Refine AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Cutaway & 2D Blueprint Sync Spotlight Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-charcoal-950 to-stone-900 rounded-2xl p-5 border border-stone-800 shadow-xl text-white grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-7 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-charcoal-950 uppercase tracking-wider">
                    New HD Visualization
                  </span>
                  <span className="text-stone-400 text-xs font-mono">Top-Down Interior Cutaways</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Inspect HD 3D Cutaway Floor Plan &amp; Synchronized CAD Blueprints
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Clear top-down perspective showing bedroom layout, modular kitchen island, dining core, and balcony landscape. Also supports uploading your own 2D blueprints to generate 3D models!
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('3d')}
                    className="px-4 py-2 rounded-lg bg-olive-600 hover:bg-olive-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Box className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open 3D Cutaway Viewer</span>
                  </button>
                  <button
                    onClick={() => setIsUpload2DModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Upload 2D Blueprint</span>
                  </button>
                </div>
              </div>

              {/* Mini visual preview cards */}
              <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
                <div
                  onClick={() => setActiveTab('3d')}
                  className="rounded-xl overflow-hidden border border-stone-700 bg-stone-800 cursor-pointer hover:border-amber-400 transition-all group"
                >
                  <div className="h-28 relative">
                    <img
                      src={design.isometricCutawayImage || '/renders/concept-a-cutaway.jpg'}
                      alt="3D Cutaway"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/25"></div>
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold bg-black/75 px-1.5 py-0.5 rounded text-white">
                      3D Cutaway Top View
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('3d')}
                  className="rounded-xl overflow-hidden border border-stone-700 bg-stone-800 cursor-pointer hover:border-blue-400 transition-all group"
                >
                  <div className="h-28 relative">
                    <img
                      src={design.splitSyncImage || '/renders/concept-a-split.png'}
                      alt="Split CAD"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/25"></div>
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-bold bg-black/75 px-1.5 py-0.5 rounded text-white">
                      2D/3D Split Sync
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Highlights & Room Schedule Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Advantages & Vastu Details */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-subtle space-y-4">
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  Architectural Merits &amp; Spatial Strategy
                </h3>
                <div className="space-y-2.5">
                  {design.keyAdvantages.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-olive-50 text-olive-800 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <span className="leading-relaxed">{adv}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-bold block mb-1">
                    Vastu Shastra Alignment
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {design.vastuNotes}
                  </p>
                </div>
              </div>

              {/* Room Schedule Snapshot */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-subtle space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-base font-bold text-charcoal-900">
                      Room Schedule Summary
                    </h3>
                    <button
                      onClick={() => setActiveTab('plan')}
                      className="text-xs font-semibold text-olive-700 hover:underline"
                    >
                      View on Vector Plan →
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    {design.roomSchedule.slice(0, 5).map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center justify-between py-1.5 border-b border-stone-100"
                      >
                        <span className="text-charcoal-800 font-medium">{room.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-stone-500">{room.dimensions}</span>
                          <span className="font-mono font-bold text-charcoal-900 w-16 text-right">
                            {room.areaSqFt} sq ft
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-xs text-stone-400">
                    + {design.roomSchedule.length - 5} additional spaces allocated across floors
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: 2D FLOOR PLAN ================= */}
        {activeTab === 'plan' && (
          <div className="space-y-6 animate-fadeIn">
            <SvgFloorPlan
              design={design}
              onNavigateTo3D={() => setActiveTab('3d')}
            />
          </div>
        )}

        {/* ================= TAB 3: 3D CONCEPT VIEWER ================= */}
        {activeTab === '3d' && (
          <div className="space-y-6 animate-fadeIn">
            <ThreeDConceptViewer
              design={design}
              onNavigateToTab={(tab) => setActiveTab(tab as WorkspaceTab)}
              onDesignUpdated={handleDesignUpdated}
            />
          </div>
        )}

        {/* ================= TAB 4: AI REFINEMENT CHAT ================= */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* Chat Panel Left */}
            <div className="lg:col-span-7">
              <AiRefinementChat
                design={design}
                onDesignUpdated={handleDesignUpdated}
                onNavigateToTab={(tab) => setActiveTab(tab as WorkspaceTab)}
              />
            </div>

            {/* Live Synchronized Floor Plan / Spec Preview Right */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-subtle">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-serif text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                    Live Concept Preview ({design.currentRevision})
                  </h4>
                  <button
                    onClick={() => setActiveTab('plan')}
                    className="text-xs text-olive-700 font-semibold hover:underline"
                  >
                    Open Vector Plan →
                  </button>
                </div>
                <div className="h-52 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 relative">
                  <img
                    src={design.coverImage}
                    alt={design.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = design.backupImage;
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-charcoal-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    Built-Up: {design.builtUpAreaSqFt} sq ft
                  </div>
                  <div className="absolute bottom-2 right-2 bg-olive-800 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                    Est: {MockCostService.formatINR(design.costEstimate.totalPreliminaryEstimate)}
                  </div>
                </div>
              </div>

              {/* Updated Room Schedule */}
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-subtle text-xs">
                <h4 className="font-serif text-xs font-bold text-charcoal-900 uppercase tracking-wider mb-2">
                  Synchronized Room Schedule
                </h4>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                  {design.roomSchedule.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between py-1 border-b border-stone-100"
                    >
                      <span className="font-medium text-charcoal-800 truncate max-w-[170px]">
                        {room.name}
                      </span>
                      <span className="font-mono text-stone-500">{room.dimensions}</span>
                      <span className="font-mono font-semibold text-charcoal-900">
                        {room.areaSqFt} sq ft
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: COST ESTIMATE ================= */}
        {activeTab === 'cost' && (
          <div className="space-y-6 animate-fadeIn">
            <CostEstimatorView design={design} onUpdateCost={handleCostUpdated} />
          </div>
        )}
      </div>

      {/* 2D-to-3D Plan Upload Converter Modal */}
      <PlanTo3DConverterModal
        isOpen={isUpload2DModalOpen}
        onClose={() => setIsUpload2DModalOpen(false)}
        projectId={project.id}
        onDesignCreated={(newDesign) => {
          handleDesignUpdated(newDesign);
          navigate(`/projects/${project.id}/designs/${newDesign.id}?tab=3d`);
        }}
      />
    </div>
  );
};
