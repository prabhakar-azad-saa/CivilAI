import React, { useState } from 'react';
import { Layers, Box, Columns, Maximize2, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { DesignConcept } from '../../types/design';

interface SplitSyncViewerProps {
  design: DesignConcept;
  onOpenUpload2D?: () => void;
}

export const SplitSyncViewer: React.FC<SplitSyncViewerProps> = ({
  design,
  onOpenUpload2D
}) => {
  const [viewMode, setViewMode] = useState<'sideBySide' | 'slider' | 'blueprintOnly' | 'renderOnly'>('sideBySide');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  // Blueprint image & 3D render image
  const blueprintSrc = design.blueprint2dImage || '/renders/sample-2d-cad.jpg';
  const renderSrc = design.splitSyncImage || '/renders/concept-a-split.png';

  const interactiveZones = [
    { id: 'parking', name: 'Carport & Driveway', desc: 'Dual vehicle parking bay with clear turning radius & pedestrian access', tag2d: 'Garage / Driveway', tag3d: 'Covered Portico' },
    { id: 'master', name: 'Master Bedroom Suite', desc: 'South-West Nairutya zone with attached ensuite bath & privacy buffer', tag2d: 'Master Suite 16\'×14\'', tag3d: 'Private Master Wing' },
    { id: 'kitchen', name: 'Kitchen & Dining Core', desc: 'South-East Agni corner with direct ventilation & service access', tag2d: 'Modular Kitchen 12\'×10\'', tag3d: 'Island Kitchen & Utility' },
    { id: 'living', name: 'Living & Sit-out Veranda', desc: 'North-East formal reception zone with expansive garden glazing', tag2d: 'Living Hall 20\'×18\'', tag3d: 'Double-Height Foyer' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-card flex flex-col">
      {/* Top Header & View Controls */}
      <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-charcoal-900 text-white uppercase tracking-wider">
              BIM Sync Engine
            </span>
            <h3 className="font-serif text-base font-bold text-charcoal-900">
              2D Blueprint CAD &amp; 3D Render Synchronized View
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare 2D technical drawings with photorealistic 3D architectural elevations
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200 text-xs font-medium">
          <button
            onClick={() => setViewMode('sideBySide')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-charcoal-900 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Dual Screen (2D + 3D)</span>
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'slider'
                ? 'bg-charcoal-900 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Wipe Slider</span>
          </button>
          <button
            onClick={() => setViewMode('blueprintOnly')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              viewMode === 'blueprintOnly'
                ? 'bg-charcoal-900 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D CAD Only</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative min-h-[500px] lg:h-[580px] bg-stone-900 overflow-hidden select-none">
        {/* MODE 1: SIDE BY SIDE */}
        {viewMode === 'sideBySide' && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
            {/* Left Pane: 2D Blueprint */}
            <div className="relative h-[290px] lg:h-full bg-stone-950 flex flex-col">
              <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-sm text-stone-200 text-[11px] font-mono font-semibold px-2.5 py-1 rounded border border-stone-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>2D Architectural CAD Blueprint</span>
              </div>
              <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={blueprintSrc}
                  alt="2D Blueprint"
                  className="max-w-full max-h-full object-contain filter contrast-125"
                />
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-sm p-2 rounded text-[10px] text-stone-300 border border-stone-800 font-mono">
                ✦ Precision CAD wall thicknesses, column centers, door swings, and dimension strings.
              </div>
            </div>

            {/* Right Pane: 3D Render & BIM Reality */}
            <div className="relative h-[290px] lg:h-full bg-stone-950 flex flex-col">
              <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-sm text-stone-200 text-[11px] font-mono font-semibold px-2.5 py-1 rounded border border-stone-700 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-400" />
                <span>3D Architectural BIM Facade &amp; Carport</span>
              </div>
              <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
                <img
                  src={renderSrc}
                  alt="3D Render"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-sm p-2 rounded text-[10px] text-stone-300 border border-stone-800 font-mono">
                ✦ Realistic materials, driveway finish, cantilevered overhangs, and vehicle clearance.
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: INTERACTIVE SLIDER */}
        {viewMode === 'slider' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background Layer: 3D Render */}
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950 p-2">
              <img
                src={renderSrc}
                alt="3D Render"
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-3 right-3 bg-black/80 text-emerald-400 text-[11px] font-mono px-2.5 py-1 rounded border border-stone-700">
                3D Architectural Reality
              </div>
            </div>

            {/* Foreground Layer: 2D Blueprint (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden bg-stone-950 flex items-center justify-center border-r-2 border-white"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="w-[100vw] h-full flex items-center justify-center max-w-[1280px]">
                <img
                  src={blueprintSrc}
                  alt="2D Blueprint"
                  className="max-w-full max-h-full object-contain filter contrast-125"
                />
              </div>
              <div className="absolute top-3 left-3 bg-black/80 text-blue-400 text-[11px] font-mono px-2.5 py-1 rounded border border-stone-700">
                2D CAD Blueprint
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-charcoal-900 text-white border-2 border-white flex items-center justify-center text-xs shadow-lg font-bold">
                ↔
              </div>
            </div>

            {/* Slider Control Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 md:w-96 cursor-pointer opacity-80 hover:opacity-100 z-20 accent-olive-500"
            />
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 font-mono z-20 pointer-events-none">
              Drag slider to wipe between 2D Blueprint CAD &amp; 3D Render
            </div>
          </div>
        )}

        {/* MODE 3: 2D ONLY */}
        {viewMode === 'blueprintOnly' && (
          <div className="relative w-full h-full bg-stone-950 flex items-center justify-center p-4">
            <img
              src={blueprintSrc}
              alt="2D Blueprint"
              className="max-w-full max-h-full object-contain filter contrast-125"
            />
            <div className="absolute top-3 left-3 bg-black/80 text-blue-400 text-[11px] font-mono px-2.5 py-1 rounded border border-stone-700">
              2D CAD Technical Blueprint
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Spatial Zones Bar */}
      <div className="p-4 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold uppercase text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-olive-700" />
            <span>Synchronized Spatial Zones (2D CAD to 3D Form)</span>
          </span>
          {onOpenUpload2D && (
            <button
              onClick={onOpenUpload2D}
              className="text-xs font-semibold text-olive-700 hover:text-olive-900 underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upload Custom 2D Blueprint →</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {interactiveZones.map((zone) => {
            const isSelected = selectedHighlight === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedHighlight(isSelected ? null : zone.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-olive-50 border-olive-500 ring-2 ring-olive-400/20 shadow-sm'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-charcoal-900">
                  <span>{zone.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-olive-700" />}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 truncate">
                    {zone.tag2d}
                  </span>
                  <span className="text-stone-400">→</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 truncate">
                    {zone.tag3d}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5 leading-snug">
                  {zone.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
