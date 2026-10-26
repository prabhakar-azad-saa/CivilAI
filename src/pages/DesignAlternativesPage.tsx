import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Eye,
  Box,
  CheckCircle2,
  Table,
  Columns,
  Sparkles,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Project } from '../types/project';
import { DesignConcept } from '../types/design';
import { MockProjectService } from '../services/mockProjectService';
import { MockDesignService } from '../services/mockDesignService';
import { MockCostService } from '../services/mockCostService';

export const DesignAlternativesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [designs, setDesigns] = useState<DesignConcept[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const p = await MockProjectService.getProjectById(id);
      if (p) {
        setProject(p);
        const dList = await MockDesignService.getDesignsForProject(id);
        setDesigns(dList);
        setSelectedDesignId(p.selectedDesignId || dList[0]?.id || '');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleSelectAndProceed = async (designId: string, initialTab: string = 'overview') => {
    if (!id) return;
    await MockProjectService.updateProject(id, {
      selectedDesignId: designId,
      currentStage: 'refining'
    });
    setSelectedDesignId(designId);
    navigate(`/projects/${id}/designs/${designId}?tab=${initialTab}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-stone-600 font-mono text-sm">
          <Sparkles className="w-5 h-5 animate-spin text-olive-700" />
          <span>Synthesizing architectural design alternatives...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <Link to="/projects" className="text-stone-500 hover:text-charcoal-900 font-medium">
              Projects
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-charcoal-900 truncate max-w-[200px]">
              {project?.name || 'Home Project'}
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-olive-800 font-semibold">3 Alternative Concepts</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                showComparisonMatrix
                  ? 'bg-charcoal-900 text-white border-charcoal-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showComparisonMatrix ? 'Show Concept Cards' : 'Compare Side-by-Side'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Intro Banner */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-olive-100 text-olive-800 font-bold">
                Tailored Proposals
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Plot: {project?.plot.length}' × {project?.plot.width}' ({project?.plot.totalArea} sq ft) • {project?.plot.facing.toUpperCase()} FACING
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-950 mt-1">
              Select Your Preferred Architectural Direction
            </h1>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
              We generated three distinct spatial typologies conforming to your brief. Each option balances daylight, Vastu orientation, construction efficiency, and lifestyle preferences differently.
            </p>
          </div>
        </div>

        {/* Comparison Matrix View (When toggled) */}
        {showComparisonMatrix ? (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-card">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-charcoal-900">
                Side-by-Side Typology Matrix
              </h3>
              <span className="text-xs text-stone-500">Compare specifications across concepts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4 w-48">Feature / Metric</th>
                    {designs.map((d) => (
                      <th key={d.id} className="py-3 px-4">
                        <span className="font-serif text-sm font-bold text-charcoal-900 block">
                          Design {d.codeName}
                        </span>
                        <span className="text-[11px] font-normal text-stone-500">{d.title}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-charcoal-800">
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Architectural Style</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4 font-semibold text-charcoal-900">
                        {d.architecturalStyle}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Built-Up Area</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4 font-mono font-bold text-olive-800">
                        {d.builtUpAreaSqFt} sq ft
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Carpet Area</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4 font-mono">
                        {d.carpetAreaSqFt} sq ft
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Bedrooms &amp; Baths</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4">
                        {d.bedroomsCount} BHK / {d.bathroomsCount} Baths
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Vastu Score</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {d.vastuScorePercent}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Parking Capacity</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4">
                        {d.parkingSpaces} Car ({d.parkingType})
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Open Space Ratio</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4 font-mono">
                        {d.openSpacePercentage}%
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-stone-50">
                    <td className="py-2.5 px-4 font-medium text-stone-600">Estimated Cost Range</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-2.5 px-4 font-mono font-bold text-charcoal-900">
                        {MockCostService.formatINR(d.estimatedCostRange.min)} – {MockCostService.formatINR(d.estimatedCostRange.max)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-stone-600">Action</td>
                    {designs.map((d) => (
                      <td key={d.id} className="py-3 px-4">
                        <button
                          onClick={() => handleSelectAndProceed(d.id)}
                          className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
                        >
                          Select Design {d.codeName} →
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Concept Cards Grid (3 Alternatives) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {designs.map((d) => {
              const isSelected = selectedDesignId === d.id;
              return (
                <div
                  key={d.id}
                  className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 shadow-card ${
                    isSelected
                      ? 'ring-2 ring-olive-700 border-olive-700'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Card Cover Image with architectural badge */}
                  <div className="relative h-56 bg-stone-100 overflow-hidden group">
                    <img
                      src={d.coverImage}
                      alt={d.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = d.backupImage;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent"></div>

                    {/* Code Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-mono font-bold text-charcoal-900 shadow-sm">
                      Concept {d.codeName}
                    </div>

                    {/* Vastu Badge */}
                    <div className="absolute top-3 right-3 bg-emerald-900/90 text-emerald-100 text-[11px] font-mono font-bold px-2.5 py-1 rounded backdrop-blur-sm">
                      {d.vastuScorePercent}% Vastu
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] uppercase font-semibold text-stone-300 tracking-wider">
                        {d.architecturalStyle}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight">
                        {d.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {d.description}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-center">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Built-Up</span>
                        <span className="font-mono text-xs font-bold text-charcoal-900">
                          {d.builtUpAreaSqFt} sq ft
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Floors</span>
                        <span className="text-xs font-bold text-charcoal-900">
                          {d.floorsCount} Levels
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-mono">Parking</span>
                        <span className="text-xs font-bold text-charcoal-900">
                          {d.parkingSpaces} Bay
                        </span>
                      </div>
                    </div>

                    {/* Key Advantages Checklist */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold block">
                        Design Highlights
                      </span>
                      {d.keyAdvantages.slice(0, 3).map((adv, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600 leading-snug">
                          <Check className="w-3.5 h-3.5 text-olive-600 flex-shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Estimated Cost Range */}
                    <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-stone-500">
                          Preliminary Civil Budget
                        </span>
                        <span className="font-mono text-xs font-bold text-olive-800">
                          {MockCostService.formatINR(d.estimatedCostRange.min)} – {MockCostService.formatINR(d.estimatedCostRange.max)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => handleSelectAndProceed(d.id, 'overview')}
                        className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <span>Select Concept {d.codeName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-olive-300" />
                      </button>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          onClick={() => handleSelectAndProceed(d.id, 'plan')}
                          className="py-1.5 px-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1 font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>View 2D Plan</span>
                        </button>
                        <button
                          onClick={() => handleSelectAndProceed(d.id, '3d')}
                          className="py-1.5 px-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-1 font-medium transition-colors"
                        >
                          <Box className="w-3.5 h-3.5 text-stone-500" />
                          <span>Explore 3D</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer footer */}
        <div className="bg-stone-100/80 rounded-xl p-4 border border-stone-200 text-xs text-stone-500 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-stone-400 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            All three designs are generated from your plot dimensions ({project?.plot.length} × {project?.plot.width} ft) and room specifications. Selecting a concept loads it into the interactive workspace where you can explore CAD drawings, 3D massing, and chat with the AI assistant to refine the design.
          </p>
        </div>
      </div>
    </div>
  );
};
