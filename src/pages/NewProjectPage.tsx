import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { MockProjectService } from '../services/mockProjectService';

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('Gulmohar Villa & Residence');
  const [city, setCity] = useState<string>('Bengaluru, Karnataka');
  const [length, setLength] = useState<number>(45);
  const [width, setWidth] = useState<number>(30);
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [buildingType, setBuildingType] = useState<'duplex' | 'villa' | 'independent' | 'rental'>('duplex');
  const [floors, setFloors] = useState<'1' | '2' | '3' | 'duplex'>('2');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const totalArea = length * width;

  const handlePrefillSample = () => {
    setName('Arora Family Residence');
    setCity('Whitefield, Bengaluru');
    setLength(40);
    setWidth(30);
    setBuildingType('duplex');
    setFloors('2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = await MockProjectService.createProject({
        name,
        location: city,
        plot: {
          length,
          width,
          unit,
          totalArea,
          shape: 'rectangle',
          facing: 'north',
          roadPosition: 'front',
          surroundings: 'semi_open',
          city
        }
      });

      setIsSubmitting(false);
      navigate(`/projects/${created.id}/requirements`);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full">
        {/* Back link */}
        <Link
          to="/projects"
          className="text-xs font-semibold text-stone-500 hover:text-charcoal-900 inline-flex items-center gap-1.5 mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Workspace</span>
        </Link>

        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-charcoal-900 flex items-center justify-center text-white">
              <Compass className="w-4 h-4 text-olive-300" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-olive-800 font-bold block">
                Forma Architectural Engine
              </span>
              <h1 className="font-serif text-2xl font-bold text-charcoal-950">
                Create a New Home Project
              </h1>
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Enter your plot boundaries and initial property assumptions. Next, our 10-step wizard will collect your room brief to synthesize three alternative design concepts.
          </p>

          {/* Quick 1-click Sample Prefill */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Explore demo with realistic sample data</span>
            </div>
            <button
              type="button"
              onClick={handlePrefillSample}
              className="text-xs font-semibold text-olive-700 hover:text-olive-900 underline"
            >
              Prefill 30×40 ft Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Project / Residence Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                placeholder="e.g. Arora Residence or Green Courtyard Home"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                placeholder="e.g. Bengaluru, Hyderabad, Pune, Gurugram"
              />
            </div>

            {/* Plot Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Plot Length (Depth) *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="15"
                    max="200"
                    required
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-l-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                  />
                  <span className="bg-stone-100 border border-l-0 border-stone-300 text-stone-600 text-xs px-2.5 py-2.5 rounded-r-lg font-mono">
                    ft
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Plot Width (Frontage) *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="15"
                    max="200"
                    required
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-l-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                  />
                  <span className="bg-stone-100 border border-l-0 border-stone-300 text-stone-600 text-xs px-2.5 py-2.5 rounded-r-lg font-mono">
                    ft
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 font-mono flex items-center justify-between px-1">
              <span>Computed Site Area:</span>
              <span className="font-bold text-olive-800 font-mono">
                {totalArea.toLocaleString()} sq ft (≈ {(totalArea / 9).toFixed(1)} Gaj)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Typology
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="duplex">Duplex Residence</option>
                  <option value="villa">Luxury Villa</option>
                  <option value="independent">Independent House</option>
                  <option value="rental">Multi-Unit Rental</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Number of Floors
                </label>
                <select
                  value={floors}
                  onChange={(e) => setFloors(e.target.value as any)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="1">1 Floor (Bungalow)</option>
                  <option value="2">2 Floors (Ground + 1)</option>
                  <option value="3">3 Floors (Ground + 2)</option>
                  <option value="duplex">Duplex with Terrace</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                to="/projects"
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-charcoal-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>{isSubmitting ? 'Creating Project...' : 'Configure Requirements'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-olive-300" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
