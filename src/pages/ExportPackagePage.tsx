import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  FileJson,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Compass,
  Layers,
  Box,
  IndianRupee,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Project } from '../types/project';
import { DesignConcept } from '../types/design';
import { MockProjectService } from '../services/mockProjectService';
import { MockDesignService } from '../services/mockDesignService';
import { MockCostService } from '../services/mockCostService';
import { MockExportService } from '../services/mockExportService';

export const ExportPackagePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [design, setDesign] = useState<DesignConcept | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const p = await MockProjectService.getProjectById(id);
      if (p) {
        setProject(p);
        const designs = await MockDesignService.getDesignsForProject(id);
        const selected = designs.find((d) => d.id === p.selectedDesignId) || designs[0];
        setDesign(selected);

        // Confetti celebration trigger!
        try {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3E5C46', '#C25E3E', '#17191C', '#EAE5DB']
          });
        } catch (e) {
          // ignore if canvas not mounted
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDownloadSvg = () => {
    if (!design) return;
    MockExportService.downloadFloorPlanSvg(design, 'Ground Floor');
    setDownloadNotice('Ground Floor vector SVG downloaded successfully.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleDownloadJson = () => {
    if (!project || !design) return;
    MockExportService.downloadProjectJson(project, design);
    setDownloadNotice('Project architectural specification JSON file downloaded.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handlePrint = () => {
    MockExportService.printSummary();
  };

  if (loading || !project || !design) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-stone-600 font-mono text-sm">
          <Sparkles className="w-5 h-5 animate-spin text-olive-700" />
          <span>Assembling architectural concept package...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col print:bg-white">
      {/* Top action header (Hidden on Print) */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <Link
              to={`/projects/${project.id}/designs/${design.id}`}
              className="text-stone-600 hover:text-charcoal-900 font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-charcoal-900">{project.name}</span>
            <span className="text-stone-300">/</span>
            <span className="text-olive-800 font-semibold">Architectural Dossier Package</span>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSvg}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-charcoal-900 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download clean scalable vector CAD drawing"
            >
              <FileCode className="w-3.5 h-3.5 text-olive-700" />
              <span>Download SVG Plan</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-charcoal-900 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download machine-readable JSON specification"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-700" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {downloadNotice && (
          <div className="bg-olive-50 border-t border-olive-200 px-4 py-2 text-xs text-olive-900 text-center font-medium animate-fadeIn">
            ✓ {downloadNotice}
          </div>
        )}
      </div>

      {/* Main Dossier Presentation Document */}
      <div className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full print:p-0 print:max-w-none">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 shadow-card print:border-none print:shadow-none print:p-0 space-y-8">
          {/* Document Header & Title Block */}
          <div className="border-b-2 border-charcoal-900 pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-charcoal-900 flex items-center justify-center text-white">
                  <Compass className="w-3.5 h-3.5 text-olive-300" />
                </div>
                <span className="font-serif text-sm font-bold tracking-widest text-charcoal-900">
                  FORMA STUDIO
                </span>
                <span className="text-[10px] uppercase font-mono text-stone-400">
                  • ARCHITECTURAL CONCEPT PACKAGE
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-charcoal-950">
                {project.name}
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Site Location: <span className="font-semibold text-charcoal-900">{project.location}</span>
              </p>
            </div>

            <div className="text-right text-xs font-mono text-stone-500 space-y-1">
              <div>Selected: <span className="font-bold text-charcoal-900">Concept {design.codeName}</span></div>
              <div>Revision Status: <span className="font-bold text-olive-800">{design.currentRevision}</span></div>
              <div>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Hero Concept Image & Styling Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-stone-50 p-6 rounded-xl border border-stone-200">
            <div className="md:col-span-5 h-48 rounded-lg overflow-hidden border border-stone-300 bg-stone-200">
              <img
                src={design.coverImage}
                alt={design.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = design.backupImage;
                }}
              />
            </div>
            <div className="md:col-span-7 space-y-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-olive-100 text-olive-800">
                {design.architecturalStyle}
              </span>
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                {design.title}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                {design.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-stone-700">
                <span>Plot: <strong>{project.plot.length}' × {project.plot.width}'</strong></span>
                <span>Built-Up: <strong>{design.builtUpAreaSqFt} sq ft</strong></span>
                <span>Facing: <strong className="capitalize">{project.plot.facing}</strong></span>
              </div>
            </div>
          </div>

          {/* Key Architectural Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Levels</span>
              <span className="font-semibold text-charcoal-900">{design.floorsLabel}</span>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Configuration</span>
              <span className="font-semibold text-charcoal-900">{design.bedroomsCount} BHK / {design.bathroomsCount} Bath</span>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Vastu Compliance</span>
              <span className="font-semibold text-emerald-800">{design.vastuScorePercent}% Auspicious</span>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
              <span className="text-[10px] font-mono text-stone-400 block uppercase">Parking Bay</span>
              <span className="font-semibold text-charcoal-900">{design.parkingType}</span>
            </div>
          </div>

          {/* Applied Modifications / Revision History List */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 uppercase tracking-wide border-b border-stone-200 pb-2">
              Iterative Revision Audit Log
            </h3>
            <div className="space-y-2 text-xs">
              {design.revisions.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-mono font-bold text-olive-800 mr-2">
                      {rev.revisionNumber}
                    </span>
                    <span className="text-charcoal-800">{rev.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 whitespace-nowrap">
                    {rev.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Complete Room Schedule Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif text-sm font-bold text-charcoal-900 uppercase tracking-wide">
                Final Room Area Allocation Schedule
              </h3>
              <span className="text-xs font-mono text-stone-500">
                {design.roomSchedule.length} spaces itemized
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Room / Space Name</th>
                    <th className="py-2.5 px-3">Floor Level</th>
                    <th className="py-2.5 px-3">Dimensions</th>
                    <th className="py-2.5 px-3">Carpet Area</th>
                    <th className="py-2.5 px-3">Vastu Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-charcoal-800">
                  {design.roomSchedule.map((room) => (
                    <tr key={room.id} className="hover:bg-stone-50">
                      <td className="py-2 px-3 font-medium text-charcoal-900">{room.name}</td>
                      <td className="py-2 px-3 text-stone-500">{room.floor}</td>
                      <td className="py-2 px-3 font-mono text-stone-600">{room.dimensions}</td>
                      <td className="py-2 px-3 font-mono font-semibold">{room.areaSqFt} sq ft</td>
                      <td className="py-2 px-3 text-stone-600">{room.vastuZone || 'Optimal'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preliminary Construction Budget Breakdown */}
          <div className="space-y-3 bg-stone-50 p-6 rounded-xl border border-stone-200">
            <h3 className="font-serif text-sm font-bold text-charcoal-900 uppercase tracking-wide border-b border-stone-200 pb-2">
              Preliminary Construction Cost Itemization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Base Civil Structure ({design.builtUpAreaSqFt} sq ft @ ₹{design.costEstimate.ratePerSqFt}):</span>
                  <span className="font-mono font-semibold">₹{design.costEstimate.baseConstructionCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Modular Kitchen &amp; Wardrobe Woodwork:</span>
                  <span className="font-mono font-semibold">₹{design.costEstimate.allowances.interiorsModularKitchen.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Landscaping &amp; Driveway Hardscape:</span>
                  <span className="font-mono font-semibold">₹{design.costEstimate.allowances.landscapingHardscape.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Smart Home Automation &amp; Security:</span>
                  <span className="font-mono font-semibold">₹{design.costEstimate.allowances.smartHomeSecurity.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Solar PV (3kW) &amp; Rainwater System:</span>
                  <span className="font-mono font-semibold">₹{design.costEstimate.allowances.solarRainwater.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Contingency Reserve Allowance:</span>
                  <span className="font-mono font-semibold text-terracotta-700">₹{design.costEstimate.allowances.contingencyReserve.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-sm font-bold text-charcoal-900">
              <span>Total Estimated Preliminary Investment</span>
              <span className="font-serif text-xl text-olive-800">
                {MockCostService.formatINR(design.costEstimate.totalPreliminaryEstimate)}
              </span>
            </div>
          </div>

          {/* Legal / Engineering Disclaimer */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-100/80 text-[11px] text-stone-600 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-charcoal-900">
              <ShieldCheck className="w-4 h-4 text-terracotta-600" />
              <span>Professional Architecture &amp; Structural Engineering Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              This concept presentation package is formulated by Forma Studio for conceptual layout planning, area feasibility, and budgetary guidance. These drawings and estimates do not constitute construction-ready civil working drawings, structural reinforcement details, or approved municipal sanction plans.
            </p>
            <p className="leading-relaxed">
              Before commencing site excavation or awarding civil contractor tenders, a licensed structural engineer must evaluate soil borewell reports and calculate dead/live/seismic load calculations conforming to the National Building Code (NBC).
            </p>
          </div>

          {/* Return button (Hidden on Print) */}
          <div className="pt-4 flex justify-between items-center print:hidden">
            <Link
              to="/projects"
              className="text-xs font-semibold text-stone-600 hover:text-charcoal-900 underline"
            >
              ← Return to Projects Workspace
            </Link>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print or Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
