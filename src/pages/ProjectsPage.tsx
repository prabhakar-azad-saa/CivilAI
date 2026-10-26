import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Compass,
  Copy,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  FolderOpen
} from 'lucide-react';
import { Project } from '../types/project';
import { MockProjectService } from '../services/mockProjectService';
import { NewProjectModal } from './NewProjectModal';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Rename dialog state
  const [renamingProject, setRenamingProject] = useState<Project | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  // Delete dialog state
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const loadProjects = async () => {
    const list = await MockProjectService.getProjects();
    setProjects(list);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDuplicate = async (id: string) => {
    await MockProjectService.duplicateProject(id);
    await loadProjects();
  };

  const handleStartRename = (p: Project) => {
    setRenamingProject(p);
    setNewTitle(p.name);
  };

  const handleConfirmRename = async () => {
    if (!renamingProject || !newTitle.trim()) return;
    await MockProjectService.updateProject(renamingProject.id, { name: newTitle.trim() });
    setRenamingProject(null);
    await loadProjects();
  };

  const handleConfirmDelete = async () => {
    if (!deletingProjectId) return;
    await MockProjectService.deleteProject(deletingProjectId);
    setDeletingProjectId(null);
    await loadProjects();
  };

  const handleResetSeedData = async () => {
    setLoading(true);
    await MockProjectService.resetSeedData();
    await loadProjects();
  };

  const getStageLabel = (stage: Project['currentStage']) => {
    switch (stage) {
      case 'designs_ready':
        return { label: '3 Concepts Ready', color: 'bg-olive-100 text-olive-800' };
      case 'refining':
        return { label: 'In Refinement', color: 'bg-amber-100 text-amber-800' };
      case 'exported':
        return { label: 'Package Exported', color: 'bg-charcoal-900 text-white' };
      default:
        return { label: 'Requirements Draft', color: 'bg-stone-200 text-stone-700' };
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Workspace Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-olive-800 font-bold mb-1">
                <Compass className="w-4 h-4" />
                <span>Architectural Planning Workspace</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-charcoal-950">
                Residential Design Projects
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Manage your plot briefs, compare generated design typologies, and review active client revisions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSeedData}
                className="px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-charcoal-900 flex items-center gap-1.5 transition-colors"
                title="Restore default sample projects"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reset Demo Data</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-olive-300" />
                <span>Start New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-stone-500 text-xs font-mono gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-olive-700" />
            <span>Loading workspace projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto shadow-subtle my-12">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">No Projects Yet</h3>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Start your first project or restore sample demonstration data to explore.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetSeedData}
                className="px-3 py-2 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Load Sample Data
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-charcoal-900 text-white rounded-lg text-xs font-semibold"
              >
                Create Project
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-mono">{projects.length} Active Residential Briefs</span>
              <span>Sorted by recent activity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => {
                const stage = getStageLabel(p.currentStage);
                const targetUrl = p.selectedDesignId
                  ? `/projects/${p.id}/designs/${p.selectedDesignId}`
                  : `/projects/${p.id}/designs`;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between shadow-card hover:shadow-elevated transition-all duration-200 group"
                  >
                    <div>
                      {/* Thumbnail Header */}
                      <div className="relative h-44 bg-stone-100 overflow-hidden">
                        <img
                          src={p.thumbnailUrl}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent"></div>

                        {/* Stage Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-sm ${stage.color}`}>
                            {stage.label}
                          </span>
                        </div>

                        {/* Title on image */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-serif text-lg font-bold text-white leading-tight">
                            {p.name}
                          </h3>
                          <div className="flex items-center gap-1 text-[11px] text-stone-300 mt-0.5">
                            <MapPin className="w-3 h-3 text-olive-300" />
                            <span>{p.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs py-1 border-b border-stone-100">
                          <div>
                            <span className="text-[10px] font-mono text-stone-400 block uppercase">
                              Plot Dimensions
                            </span>
                            <span className="font-mono font-bold text-charcoal-900">
                              {p.plot.length}' × {p.plot.width}' ft
                            </span>
                            <span className="text-[10px] text-stone-500 block">
                              ({p.plot.totalArea} sq ft)
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-stone-400 block uppercase">
                              Floors &amp; Typology
                            </span>
                            <span className="font-semibold text-charcoal-900">
                              {p.requirements?.building.floors || '2'} Storeys
                            </span>
                            <span className="text-[10px] text-stone-500 block capitalize">
                              {p.requirements?.building.buildingType || 'Duplex'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            Updated {new Date(p.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="font-medium text-olive-800">
                            {p.plot.facing.toUpperCase()} Facing
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="px-4 pb-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-stone-400">
                        <button
                          onClick={() => handleDuplicate(p.id)}
                          className="p-1.5 hover:text-charcoal-900 hover:bg-stone-100 rounded transition-colors"
                          title="Duplicate project"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStartRename(p)}
                          className="p-1.5 hover:text-charcoal-900 hover:bg-stone-100 rounded transition-colors"
                          title="Rename project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProjectId(p.id)}
                          className="p-1.5 hover:text-terracotta-700 hover:bg-terracotta-50 rounded transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        to={targetUrl}
                        className="px-3.5 py-1.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <span>Open Studio</span>
                        <ArrowRight className="w-3 h-3 text-olive-300" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); loadProjects(); }} />

      {/* Rename Dialog Modal */}
      {renamingProject && (
        <div className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl border border-stone-200 animate-scaleUp">
            <h4 className="font-serif text-sm font-bold text-charcoal-900 mb-2">Rename Project</h4>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive-700 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRenamingProject(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-charcoal-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRename}
                className="px-4 py-1.5 bg-charcoal-900 text-white font-semibold rounded-lg"
              >
                Save Name
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProjectId && (
        <div className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 animate-scaleUp">
            <h4 className="font-serif text-base font-bold text-charcoal-900 mb-1">Delete Project?</h4>
            <p className="text-xs text-stone-500 mb-4">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-3 py-1.5 text-stone-600 hover:text-charcoal-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-terracotta-600 hover:bg-terracotta-700 text-white font-semibold rounded-lg"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
