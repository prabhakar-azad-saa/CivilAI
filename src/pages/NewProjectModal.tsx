import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Building, MapPin, Compass } from 'lucide-react';
import { MockProjectService } from '../services/mockProjectService';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('Gulmohar Villa & Residence');
  const [city, setCity] = useState<string>('Bengaluru, Karnataka');
  const [length, setLength] = useState<number>(45);
  const [width, setWidth] = useState<number>(30);
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [buildingType, setBuildingType] = useState<'duplex' | 'villa' | 'independent' | 'rental'>('duplex');
  const [floors, setFloors] = useState<'1' | '2' | '3' | 'duplex'>('2');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalArea = length * width;

  const handlePrefillSample = () => {
    setName('Kalyan Nagar Residence');
    setCity('Bengaluru, Karnataka');
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
      onClose();
      navigate(`/projects/${created.id}/requirements`);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 animate-scaleUp relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-charcoal-900 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-md bg-olive-50 text-olive-800 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-olive-800 font-bold">
            Forma Architectural Studio
          </span>
        </div>

        <h2 className="font-serif text-2xl font-bold text-charcoal-950">
          Start a New Home Project
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Enter basic plot dimensions to configure your design space and generate 3 custom architectural concepts.
        </p>

        {/* 1-Click Sample Button */}
        <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Short on time? Use realistic sample values</span>
          </div>
          <button
            type="button"
            onClick={handlePrefillSample}
            className="text-xs font-semibold text-olive-700 hover:text-olive-900 underline"
          >
            Prefill Example
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
              placeholder="e.g. Arora Residence or Modern Courtyard Home"
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
            <span>Calculated Site Area:</span>
            <span className="font-bold text-olive-800 font-mono">
              {totalArea.toLocaleString()} sq ft (≈ {(totalArea / 9).toFixed(1)} Gaj)
            </span>
          </div>

          {/* Typology and Floors */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                Typology
              </label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
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
                className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
              >
                <option value="1">1 Floor (Bungalow)</option>
                <option value="2">2 Floors (Ground + 1)</option>
                <option value="3">3 Floors (Ground + 2)</option>
                <option value="duplex">Duplex with Terrace</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-charcoal-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              {isSubmitting ? 'Creating Project...' : 'Configure Requirements →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
