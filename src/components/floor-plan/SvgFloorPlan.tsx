import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, Layers, Compass, Eye, EyeOff } from 'lucide-react';
import { DesignConcept, RoomScheduleItem } from '../../types/design';
import { MockExportService } from '../../services/mockExportService';

interface SvgFloorPlanProps {
  design: DesignConcept;
  activeFloor?: 'Ground Floor' | 'First Floor';
  onFloorChange?: (floor: 'Ground Floor' | 'First Floor') => void;
}

export const SvgFloorPlan: React.FC<SvgFloorPlanProps> = ({
  design,
  activeFloor: controlledFloor,
  onFloorChange
}) => {
  const [internalFloor, setInternalFloor] = useState<'Ground Floor' | 'First Floor'>('Ground Floor');
  const floor = controlledFloor ?? internalFloor;
  const setFloor = onFloorChange ?? setInternalFloor;

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showVastu, setShowVastu] = useState<boolean>(true);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => setZoomLevel(1);

  // Check if modifications are present in design
  const hasPooja = design.roomSchedule.some((r) => r.name.toLowerCase().includes('pooja'));
  const livingRoom = design.roomSchedule.find((r) => r.name.toLowerCase().includes('living'));
  const isEnlargedLiving = livingRoom ? livingRoom.areaSqFt > 280 : false;
  const hasExtraBalcony = design.roomSchedule.some((r) => r.name.toLowerCase().includes('sunset') || r.name.toLowerCase().includes('deck'));

  return (
    <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden flex flex-col shadow-subtle">
      {/* Top toolbar */}
      <div className="bg-white px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Floor selector tabs */}
        <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 font-medium">
          <button
            onClick={() => setFloor('Ground Floor')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              floor === 'Ground Floor'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            Ground Floor
          </button>
          <button
            onClick={() => setFloor('First Floor')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              floor === 'First Floor'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            First Floor
          </button>
        </div>

        {/* Layer Visibility Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${
              showLabels
                ? 'bg-olive-50 border-olive-200 text-olive-800'
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
            title="Toggle room labels"
          >
            {showLabels ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Labels</span>
          </button>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${
              showDimensions
                ? 'bg-olive-50 border-olive-200 text-olive-800'
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
            title="Toggle dimensions"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dimensions</span>
          </button>

          <button
            onClick={() => setShowVastu(!showVastu)}
            className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${
              showVastu
                ? 'bg-terracotta-50 border-terracotta-200 text-terracotta-700'
                : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
            }`}
            title="Toggle Vastu zones"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vastu Zones</span>
          </button>
        </div>

        {/* Zoom & Export Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="flex items-center border border-stone-200 rounded-md bg-white">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-stone-600 hover:bg-stone-100 hover:text-charcoal-900 border-r border-stone-200"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 text-[11px] font-mono text-stone-600 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-stone-600 hover:bg-stone-100 hover:text-charcoal-900 border-l border-stone-200"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleResetZoom}
            className="p-1.5 text-stone-600 bg-white border border-stone-200 rounded-md hover:bg-stone-100"
            title="Fit to view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => MockExportService.downloadFloorPlanSvg(design, floor)}
            className="px-3 py-1.5 bg-olive-700 hover:bg-olive-800 text-white rounded-md flex items-center gap-1.5 font-medium shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area with zoom transform */}
      <div className="relative w-full h-[540px] overflow-auto bg-stone-50 flex items-center justify-center p-4">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
          className="shadow-card rounded-md bg-white border border-stone-200"
        >
          <svg
            viewBox="0 0 920 620"
            width="820"
            height="540"
            className="w-auto h-auto max-w-none block"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid-cad" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#EFECE5" strokeWidth="0.8" />
              </pattern>
              <pattern id="hatch-bath" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#E4EDE5" strokeWidth="1.5" />
              </pattern>
              <filter id="wall-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Cad Blueprint Background */}
            <rect width="920" height="620" fill="#FAF8F5" />
            <rect width="920" height="620" fill="url(#grid-cad)" />

            {/* Boundary Box */}
            <rect x="30" y="25" width="860" height="570" fill="none" stroke="#DCD5C7" strokeWidth="1.5" />
            <rect x="35" y="30" width="850" height="560" fill="none" stroke="#8F8576" strokeWidth="0.5" strokeDasharray="6,3" />

            {/* North Compass Indicator */}
            <g transform="translate(840, 75)">
              <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#33373E" strokeWidth="1.5" />
              <polygon points="0,-18 5,0 0,-3 -5,0" fill="#C25E3E" />
              <polygon points="0,18 5,0 0,3 -5,0" fill="#17191C" />
              <text x="-4" y="-22" fontFamily="'JetBrains Mono', monospace" fontSize="11" fontWeight="bold" fill="#C25E3E">N</text>
              <text x="7" y="3" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#696053">E</text>
              <text x="-12" y="3" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#696053">W</text>
              <text x="-3" y="15" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#696053">S</text>
            </g>

            {/* Title Block on Blueprint */}
            <g transform="translate(560, 480)">
              <rect x="0" y="0" width="310" height="95" fill="#FFFFFF" stroke="#33373E" strokeWidth="1.5" rx="3" />
              <text x="14" y="24" fontFamily="'Cinzel', serif" fontSize="14" fontWeight="bold" fill="#17191C">
                {design.title.toUpperCase()}
              </text>
              <text x="14" y="42" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fill="#4D525C">
                Level: <tspan fontWeight="bold" fill="#253B2B">{floor}</tspan> | {design.currentRevision}
              </text>
              <text x="14" y="60" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#696053">
                Total Built-Up: {design.builtUpAreaSqFt} sq ft
              </text>
              <text x="14" y="78" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fill="#8A3B21">
                *Preliminary architectural concept. Not for structural execution.
              </text>
            </g>

            {floor === 'Ground Floor' ? (
              /* ================= GROUND FLOOR LAYOUT ================= */
              <g id="ground-floor-plan">
                {/* Site Setbacks / Lawn Area */}
                <rect x="110" y="70" width="480" height="470" fill="#F4F8F4" stroke="#C7D9CA" strokeWidth="1" strokeDasharray="4,4" />
                <text x="120" y="85" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fill="#3E5C46">
                  Front Setback (3'0" Garden &amp; Pavers)
                </text>

                {/* Main Ground Floor Building Footprint Outer Wall */}
                <rect
                  x="120"
                  y="95"
                  width="420"
                  height="420"
                  fill="#FFFFFF"
                  stroke="#17191C"
                  strokeWidth="8"
                  filter="url(#wall-shadow)"
                />

                {/* 1. Covered Portico / Car Parking (North-West) */}
                <rect x="360" y="95" width="180" height="150" fill="#F5F2EB" stroke="#22252A" strokeWidth="4" />
                {showFurniture && (
                  /* Car Silhouette / Outline */
                  <g transform="translate(400, 115)">
                    <rect x="0" y="0" width="80" height="105" rx="14" fill="#EAE5DB" stroke="#8F8576" strokeWidth="1.5" />
                    <rect x="10" y="20" width="60" height="45" rx="5" fill="#FAF8F5" stroke="#8F8576" strokeWidth="1" />
                    <line x1="8" y1="12" x2="22" y2="12" stroke="#C25E3E" strokeWidth="3" />
                    <line x1="58" y1="12" x2="72" y2="12" stroke="#C25E3E" strokeWidth="3" />
                  </g>
                )}
                {showLabels && (
                  <text x="375" y="125" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    CAR PORTICO
                  </text>
                )}
                {showDimensions && (
                  <text x="375" y="142" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    16'0" × 11'0"
                  </text>
                )}

                {/* 2. Living & Drawing Room (North-East) */}
                <rect
                  x="120"
                  y="95"
                  width={isEnlargedLiving ? 240 : 210}
                  height="180"
                  fill="#FAF8F5"
                  stroke="#22252A"
                  strokeWidth="4"
                />
                {showFurniture && (
                  /* Sofa & Coffee Table Representation */
                  <g transform="translate(145, 145)">
                    {/* Sofa */}
                    <rect x="0" y="0" width="90" height="30" rx="3" fill="#EFECE5" stroke="#8F8576" strokeWidth="1" />
                    {/* Coffee Table */}
                    <rect x="20" y="40" width="50" height="25" rx="2" fill="#FAF8F5" stroke="#8F8576" strokeWidth="1" />
                    {/* Armchairs */}
                    <rect x="-10" y="38" width="22" height="26" rx="2" fill="#EFECE5" stroke="#8F8576" strokeWidth="1" />
                    <rect x="78" y="38" width="22" height="26" rx="2" fill="#EFECE5" stroke="#8F8576" strokeWidth="1" />
                  </g>
                )}
                {showLabels && (
                  <text x="135" y="125" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="700" fill="#17191C">
                    LIVING ROOM {isEnlargedLiving && <tspan fill="#3E5C46" fontSize="10">(ENLARGED)</tspan>}
                  </text>
                )}
                {showDimensions && (
                  <text x="135" y="142" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#696053">
                    {livingRoom?.dimensions || '18\'0" × 14\'6"'} ({livingRoom?.areaSqFt || 261} sq ft)
                  </text>
                )}
                {showVastu && (
                  <text x="135" y="240" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="600" fill="#3E5C46">
                    ● Ishanya (NE Daylight)
                  </text>
                )}

                {/* 3. Central Courtyard / Light Atrium */}
                <rect x="235" y="275" width="105" height="110" fill="#EBF3ED" stroke="#3E5C46" strokeWidth="3" />
                {showFurniture && (
                  /* Courtyard Tree / Planter */
                  <g transform="translate(287, 330)">
                    <circle cx="0" cy="0" r="22" fill="#C7D9CA" opacity="0.6" />
                    <circle cx="0" cy="0" r="14" fill="#3E5C46" opacity="0.8" />
                    <circle cx="0" cy="0" r="5" fill="#253B2B" />
                  </g>
                )}
                {showLabels && (
                  <text x="245" y="295" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="700" fill="#253B2B">
                    CENTRAL COURTYARD
                  </text>
                )}
                {showDimensions && (
                  <text x="245" y="310" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#3E5C46">
                    Passive Lightwell
                  </text>
                )}

                {/* 4. Optional Pooja Sanctum (Dynamically renders when added) */}
                {hasPooja && (
                  <g>
                    <rect x="330" y="245" width="70" height="70" fill="#FAF3F0" stroke="#C25E3E" strokeWidth="3" />
                    <text x="336" y="268" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="700" fill="#C25E3E">
                      POOJA
                    </text>
                    <text x="336" y="282" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#8A3B21">
                      7'0" × 6'0"
                    </text>
                    <circle cx="365" cy="298" r="4" fill="#C25E3E" />
                  </g>
                )}

                {/* 5. Dining Area */}
                <rect x="120" y="275" width="115" height="110" fill="#FDFBF7" stroke="#22252A" strokeWidth="4" />
                {showFurniture && (
                  /* Dining Table & 4 chairs */
                  <g transform="translate(145, 310)">
                    <rect x="10" y="5" width="45" height="30" rx="3" fill="#EAE5DB" stroke="#8F8576" strokeWidth="1" />
                    <rect x="15" y="-2" width="12" height="5" fill="#8F8576" />
                    <rect x="38" y="-2" width="12" height="5" fill="#8F8576" />
                    <rect x="15" y="37" width="12" height="5" fill="#8F8576" />
                    <rect x="38" y="37" width="12" height="5" fill="#8F8576" />
                  </g>
                )}
                {showLabels && (
                  <text x="130" y="295" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    DINING
                  </text>
                )}
                {showDimensions && (
                  <text x="130" y="358" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    14'0" × 12'0"
                  </text>
                )}

                {/* 6. Modular Kitchen & Agni Utility (South-East) */}
                <rect x="340" y="275" width="200" height="110" fill="#FAF6EE" stroke="#22252A" strokeWidth="4" />
                {showFurniture && (
                  /* L-Shaped Kitchen Counter & Hob */
                  <g transform="translate(350, 285)">
                    <path d="M 0 0 L 175 0 L 175 30 L 30 30 L 30 85 L 0 85 Z" fill="#E5E0D6" stroke="#8F8576" strokeWidth="1" />
                    {/* Cooking Hob / Burners */}
                    <circle cx="120" cy="15" r="7" fill="#C25E3E" opacity="0.4" stroke="#8A3B21" />
                    <circle cx="145" cy="15" r="7" fill="#C25E3E" opacity="0.4" stroke="#8A3B21" />
                  </g>
                )}
                {showLabels && (
                  <text x="350" y="335" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    KITCHEN &amp; PANTRY
                  </text>
                )}
                {showDimensions && (
                  <text x="350" y="352" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    12'0" × 10'0" (Agni SE)
                  </text>
                )}
                {showVastu && (
                  <text x="350" y="368" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="600" fill="#C25E3E">
                    ● Vastu Agni Ideal
                  </text>
                )}

                {/* 7. Ground Floor Guest Bedroom (South-West) */}
                <rect x="120" y="385" width="220" height="130" fill="#F7F4EE" stroke="#22252A" strokeWidth="4" />
                {showFurniture && (
                  /* Bed & Nightstands */
                  <g transform="translate(140, 420)">
                    <rect x="20" y="0" width="70" height="80" rx="3" fill="#EAE5DB" stroke="#8F8576" strokeWidth="1" />
                    <rect x="30" y="5" width="22" height="16" rx="2" fill="#FFFFFF" stroke="#DCD5C7" />
                    <rect x="58" y="5" width="22" height="16" rx="2" fill="#FFFFFF" stroke="#DCD5C7" />
                    {/* Side tables */}
                    <rect x="5" y="5" width="12" height="16" fill="#8F8576" />
                    <rect x="93" y="5" width="12" height="16" fill="#8F8576" />
                  </g>
                )}
                {showLabels && (
                  <text x="135" y="405" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    GUEST SUITE
                  </text>
                )}
                {showDimensions && (
                  <text x="135" y="420" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    13'0" × 12'0"
                  </text>
                )}

                {/* 8. Dog-legged Staircase Core & Common Bath */}
                <rect x="340" y="385" width="110" height="130" fill="#EAE5DC" stroke="#22252A" strokeWidth="4" />
                {/* Stair Treads */}
                <g stroke="#8F8576" strokeWidth="1">
                  <line x1="340" y1="400" x2="450" y2="400" />
                  <line x1="340" y1="415" x2="450" y2="415" />
                  <line x1="340" y1="430" x2="450" y2="430" />
                  <line x1="340" y1="445" x2="450" y2="445" />
                  <line x1="340" y1="460" x2="450" y2="460" />
                  <line x1="340" y1="475" x2="450" y2="475" />
                  <line x1="340" y1="490" x2="450" y2="490" />
                </g>
                <text x="360" y="505" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="700" fill="#4A433A">
                  STAIRS UP ▲
                </text>

                {/* 9. Common Powder Room */}
                <rect x="450" y="385" width="90" height="130" fill="url(#hatch-bath)" stroke="#22252A" strokeWidth="4" />
                {showLabels && (
                  <text x="460" y="445" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="700" fill="#253B2B">
                    BATH
                  </text>
                )}
                {showDimensions && (
                  <text x="460" y="460" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#696053">
                    7'6" × 5'0"
                  </text>
                )}

                {/* Doors and Swings */}
                {/* Main entrance door arc */}
                <path d="M 210 95 A 35 35 0 0 1 245 130" fill="none" stroke="#C25E3E" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="210" y1="95" x2="210" y2="130" stroke="#17191C" strokeWidth="2.5" />
                <text x="218" y="90" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="8" fontWeight="bold" fill="#C25E3E">MAIN ENTRY</text>

                {/* Guest Room Door arc */}
                <path d="M 230 385 A 25 25 0 0 1 255 410" fill="none" stroke="#8F8576" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="230" y1="385" x2="230" y2="410" stroke="#17191C" strokeWidth="2" />
              </g>
            ) : (
              /* ================= FIRST FLOOR LAYOUT ================= */
              <g id="first-floor-plan">
                {/* Outer Wall First Floor */}
                <rect
                  x="120"
                  y="95"
                  width="420"
                  height="420"
                  fill="#FFFFFF"
                  stroke="#17191C"
                  strokeWidth="8"
                  filter="url(#wall-shadow)"
                />

                {/* 1. Master Suite (South-West Nairutya Corner) */}
                <rect x="120" y="95" width="240" height="200" fill="#FAF8F5" stroke="#22252A" strokeWidth="4" />
                {showFurniture && (
                  /* King Bed Representation */
                  <g transform="translate(160, 135)">
                    <rect x="0" y="0" width="85" height="90" rx="4" fill="#EAE5DB" stroke="#8F8576" strokeWidth="1.5" />
                    <rect x="10" y="5" width="28" height="18" rx="2" fill="#FFFFFF" stroke="#DCD5C7" />
                    <rect x="47" y="5" width="28" height="18" rx="2" fill="#FFFFFF" stroke="#DCD5C7" />
                  </g>
                )}
                {showLabels && (
                  <text x="135" y="125" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="12" fontWeight="700" fill="#17191C">
                    PRIMARY MASTER SUITE
                  </text>
                )}
                {showDimensions && (
                  <text x="135" y="142" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    16'6" × 14'0" (231 sq ft)
                  </text>
                )}
                {showVastu && (
                  <text x="135" y="260" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fontWeight="600" fill="#3E5C46">
                    ● Nairutya (SW Master Zone)
                  </text>
                )}

                {/* 2. Ensuite Master Bath & Walk-in Closet */}
                <rect x="360" y="95" width="180" height="120" fill="url(#hatch-bath)" stroke="#22252A" strokeWidth="4" />
                {showLabels && (
                  <text x="375" y="130" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#253B2B">
                    ENSUITE BATH &amp; CLOSET
                  </text>
                )}
                {showDimensions && (
                  <text x="375" y="145" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    8'6" × 6'0" (51 sq ft)
                  </text>
                )}

                {/* 3. Family Lounge / Study */}
                <rect x="120" y="295" width="230" height="130" fill="#FDFBF7" stroke="#22252A" strokeWidth="4" />
                {showLabels && (
                  <text x="135" y="325" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    FAMILY LOUNGE &amp; STUDY
                  </text>
                )}
                {showDimensions && (
                  <text x="135" y="342" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    14'6" × 11'0" (160 sq ft)
                  </text>
                )}

                {/* 4. Children Bedroom */}
                <rect x="350" y="215" width="190" height="180" fill="#F7F4EE" stroke="#22252A" strokeWidth="4" />
                {showLabels && (
                  <text x="365" y="245" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#17191C">
                    CHILDREN'S BEDROOM
                  </text>
                )}
                {showDimensions && (
                  <text x="365" y="262" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    13'0" × 12'6" (163 sq ft)
                  </text>
                )}

                {/* 5. Cantilever Balcony / Sunset Deck */}
                <rect
                  x="120"
                  y="425"
                  width={hasExtraBalcony ? 260 : 200}
                  height="90"
                  fill="#F5EDE6"
                  stroke="#C25E3E"
                  strokeWidth="3"
                  strokeDasharray="4,2"
                />
                {showLabels && (
                  <text x="135" y="460" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="11" fontWeight="700" fill="#8A3B21">
                    CANTILEVER DECK {hasExtraBalcony && <tspan fill="#3E5C46">(EXPANDED)</tspan>}
                  </text>
                )}
                {showDimensions && (
                  <text x="135" y="478" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#696053">
                    {hasExtraBalcony ? "16'0\" × 6'6\" (104 sq ft)" : "14'0\" × 6'0\" (84 sq ft)"}
                  </text>
                )}

                {/* 6. Upper Stairwell Hall */}
                <rect x="350" y="395" width="190" height="120" fill="#EAE5DC" stroke="#22252A" strokeWidth="4" />
                <text x="375" y="445" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="700" fill="#4A433A">
                  STAIRWELL TO ROOF ▲
                </text>
              </g>
            )}

            {/* Overall Dimension Tick Marks */}
            <g stroke="#696053" strokeWidth="1">
              {/* Width dimension top */}
              <line x1="120" y1="55" x2="540" y2="55" />
              <line x1="120" y1="50" x2="120" y2="60" />
              <line x1="540" y1="50" x2="540" y2="60" />
              <text x="310" y="50" fontFamily="'JetBrains Mono', monospace" fontSize="10" fill="#4A433A">
                30' 0" (WIDTH)
              </text>

              {/* Length dimension left */}
              <line x1="85" y1="95" x2="85" y2="515" />
              <line x1="80" y1="95" x2="90" y2="95" />
              <line x1="80" y1="515" x2="90" y2="515" />
              <text
                x="-320"
                y="80"
                transform="rotate(-90)"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="10"
                fill="#4A433A"
              >
                40' 0" (DEPTH)
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Room Schedule Table below the canvas */}
      <div className="bg-white border-t border-stone-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif text-sm font-bold text-charcoal-900 tracking-wide">
            SCHEDULE OF ROOMS &amp; SPATIAL SPECIFICATIONS ({floor.toUpperCase()})
          </h4>
          <span className="text-xs text-stone-500 font-mono">
            {design.roomSchedule.filter((r) => r.floor === floor).length} spaces allocated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-2 px-3">Room / Space</th>
                <th className="py-2 px-3">Dimensions</th>
                <th className="py-2 px-3">Carpet Area</th>
                <th className="py-2 px-3">Vastu Zone Alignment</th>
                <th className="py-2 px-3">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-normal text-charcoal-800">
              {design.roomSchedule
                .filter((r) => r.floor === floor)
                .map((room) => (
                  <tr key={room.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-2 px-3 font-medium text-charcoal-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-olive-600"></span>
                      {room.name}
                    </td>
                    <td className="py-2 px-3 font-mono text-stone-600">{room.dimensions}</td>
                    <td className="py-2 px-3 font-mono font-semibold text-charcoal-900">
                      {room.areaSqFt} sq ft
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700">
                        {room.vastuZone || 'Optimal'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-stone-500">
                      {room.isAttachedBath ? 'Attached Sanitary' : 'Habitable Zone'}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
