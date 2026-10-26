import { DesignConcept } from '../types/design';
import { Project } from '../types/project';

export class MockExportService {
  /**
   * Generates and triggers actual browser download for the SVG Floor Plan
   */
  static downloadFloorPlanSvg(design: DesignConcept, floor: 'Ground Floor' | 'First Floor' = 'Ground Floor'): void {
    const isGround = floor === 'Ground Floor';
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D8" stroke-width="0.5"/>
    </pattern>
    <style>
      .wall { fill: none; stroke: #17191C; stroke-width: 8; stroke-linecap: square; stroke-linejoin: miter; }
      .inner-wall { fill: none; stroke: #33373E; stroke-width: 5; }
      .room-bg { fill: #FDFCF9; }
      .courtyard-bg { fill: #EBF2EC; }
      .balcony-bg { fill: #F7F3EE; }
      .room-text { font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px; font-weight: 700; fill: #17191C; }
      .dim-text { font-family: 'JetBrains Mono', monospace; font-size: 11px; fill: #696053; }
      .vastu-text { font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 10px; font-weight: 600; fill: #3E5C46; }
      .dimension-line { stroke: #B8AF9F; stroke-width: 1; stroke-dasharray: 4,4; }
      .title-text { font-family: 'Cinzel', Georgia, serif; font-size: 20px; font-weight: 700; fill: #17191C; }
    </style>
  </defs>

  <!-- Background grid -->
  <rect width="1000" height="700" fill="#FAF8F5"/>
  <rect width="1000" height="700" fill="url(#grid)"/>

  <!-- Border & Title Block -->
  <rect x="40" y="40" width="920" height="620" fill="none" stroke="#2E2A24" stroke-width="2"/>
  <rect x="680" y="520" width="280" height="140" fill="#FFFFFF" stroke="#2E2A24" stroke-width="1.5"/>
  <text x="700" y="550" class="title-text">FORMA STUDIO</text>
  <text x="700" y="575" class="room-text">${design.title}</text>
  <text x="700" y="595" class="dim-text">Level: ${floor} | Rev: ${design.currentRevision}</text>
  <text x="700" y="615" class="dim-text">Scale: 1:100 (Concept Plan)</text>
  <text x="700" y="635" class="dim-text">Plot: 30'0" × 40'0" | North Facing</text>

  <!-- North Arrow Compass -->
  <g transform="translate(100, 100)">
    <circle cx="0" cy="0" r="24" fill="#FFFFFF" stroke="#17191C" stroke-width="1.5"/>
    <polygon points="0,-20 6,0 0,-4 -6,0" fill="#C25E3E"/>
    <polygon points="0,20 6,0 0,4 -6,0" fill="#17191C"/>
    <text x="-4" y="-24" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold" fill="#C25E3E">N</text>
  </g>

  <!-- Ground Floor Layout -->
  ${isGround ? `
  <!-- Plot Boundary -->
  <rect x="180" y="100" width="460" height="480" class="room-bg" stroke="#C25E3E" stroke-width="2" stroke-dasharray="8,4"/>
  
  <!-- Living & Drawing Area -->
  <rect x="200" y="120" width="220" height="190" fill="#FBF9F5" stroke="#33373E" stroke-width="4"/>
  <text x="215" y="155" class="room-text">LIVING &amp; DRAWING</text>
  <text x="215" y="175" class="dim-text">18'0" × 14'6" (261 sq ft)</text>
  <text x="215" y="195" class="vastu-text">● North-East Zone</text>

  <!-- Central Courtyard / Lightwell -->
  <rect x="420" y="120" width="110" height="190" class="courtyard-bg" stroke="#3E5C46" stroke-width="3"/>
  <text x="430" y="185" class="room-text" fill="#253B2B">GREEN</text>
  <text x="430" y="205" class="room-text" fill="#253B2B">COURTYARD</text>
  <text x="430" y="225" class="dim-text">Brahmasthan</text>

  <!-- Covered Portico / Parking -->
  <rect x="530" y="120" width="100" height="190" fill="#F0EBE1" stroke="#33373E" stroke-width="4"/>
  <text x="540" y="165" class="room-text">PORTICO</text>
  <text x="540" y="185" class="dim-text">Car Parking</text>
  <text x="540" y="205" class="dim-text">16'0" × 11'0"</text>

  <!-- Dining & Family Spine -->
  <rect x="200" y="310" width="220" height="140" fill="#FDFBF7" stroke="#33373E" stroke-width="4"/>
  <text x="215" y="345" class="room-text">DINING HALL</text>
  <text x="215" y="365" class="dim-text">14'0" × 12'0" (168 sq ft)</text>

  <!-- Modular Kitchen & Agni Utility -->
  <rect x="420" y="310" width="210" height="140" fill="#FBF8F3" stroke="#33373E" stroke-width="4"/>
  <text x="435" y="345" class="room-text">MODULAR KITCHEN</text>
  <text x="435" y="365" class="dim-text">12'0" × 10'0" (120 sq ft)</text>
  <text x="435" y="385" class="vastu-text">● Agni Corner (SE)</text>

  <!-- Guest Suite & Bath -->
  <rect x="200" y="450" width="260" height="120" fill="#F7F4EE" stroke="#33373E" stroke-width="4"/>
  <text x="215" y="485" class="room-text">GUEST BEDROOM</text>
  <text x="215" y="505" class="dim-text">13'0" × 12'0" (156 sq ft)</text>

  <!-- Staircase Core -->
  <rect x="460" y="450" width="170" height="120" fill="#EAE5DC" stroke="#33373E" stroke-width="4"/>
  <text x="480" y="495" class="room-text">STAIRCASE</text>
  <text x="480" y="515" class="dim-text">Dog-legged RCC</text>
  ` : `
  <!-- First Floor Layout -->
  <rect x="180" y="100" width="460" height="480" class="room-bg" stroke="#C25E3E" stroke-width="2" stroke-dasharray="8,4"/>

  <!-- Master Bedroom Suite -->
  <rect x="200" y="120" width="250" height="210" fill="#FBF9F5" stroke="#33373E" stroke-width="4"/>
  <text x="215" y="155" class="room-text">MASTER BEDROOM SUITE</text>
  <text x="215" y="175" class="dim-text">16'6" × 14'0" (231 sq ft)</text>
  <text x="215" y="195" class="vastu-text">● South-West (Nairutya Master)</text>

  <!-- Ensuite Master Bath -->
  <rect x="450" y="120" width="180" height="100" fill="#F5F2EB" stroke="#33373E" stroke-width="4"/>
  <text x="465" y="155" class="room-text">ENSUITE BATH</text>
  <text x="465" y="175" class="dim-text">8'6" × 6'0" (51 sq ft)</text>

  <!-- Family Lounge & Study -->
  <rect x="200" y="330" width="230" height="140" fill="#FDFBF7" stroke="#33373E" stroke-width="4"/>
  <text x="215" y="365" class="room-text">FAMILY LOUNGE / STUDY</text>
  <text x="215" y="385" class="dim-text">14'6" × 11'0" (160 sq ft)</text>

  <!-- Children Bedroom -->
  <rect x="430" y="220" width="200" height="230" fill="#F7F4EE" stroke="#33373E" stroke-width="4"/>
  <text x="445" y="255" class="room-text">CHILDREN'S BEDROOM</text>
  <text x="445" y="275" class="dim-text">13'0" × 12'6" (163 sq ft)</text>

  <!-- Cantilever Balcony -->
  <rect x="200" y="470" width="230" height="90" class="balcony-bg" stroke="#3E5C46" stroke-width="3" stroke-dasharray="4,2"/>
  <text x="215" y="505" class="room-text" fill="#253B2B">CANTILEVER DECK</text>
  <text x="215" y="525" class="dim-text">14'0" × 6'0" (84 sq ft)</text>

  <!-- Upper Stair Hall -->
  <rect x="430" y="450" width="200" height="110" fill="#EAE5DC" stroke="#33373E" stroke-width="4"/>
  <text x="450" y="495" class="room-text">STAIRWELL</text>
  <text x="450" y="515" class="dim-text">To Rooftop Terrace</text>
  `}

  <!-- Outer Structural Walls Thick Cut -->
  <rect x="200" y="120" width="430" height="440" class="wall"/>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forma-floorplan-${design.codeName.toLowerCase()}-${floor.toLowerCase().replace(/\s+/g, '-')}-${design.currentRevision.replace(/\s+/g, '')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generates and triggers actual browser download for the JSON Project Specification
   */
  static downloadProjectJson(project: Project, design: DesignConcept): void {
    const exportPayload = {
      product: 'Forma Studio — AI Civil & Architectural Design Studio',
      exportTimestamp: new Date().toISOString(),
      disclaimer: 'This concept package contains simulated architectural recommendations for preliminary planning. Detailed structural, civil, plumbing, electrical, and foundation drawings must be prepared by a licensed structural engineer and approved by the local municipal development authority before construction.',
      project: {
        id: project.id,
        name: project.name,
        location: project.location,
        plot: project.plot,
        requirements: project.requirements
      },
      selectedConcept: {
        id: design.id,
        codeName: design.codeName,
        title: design.title,
        subtitle: design.subtitle,
        description: design.description,
        architecturalStyle: design.architecturalStyle,
        floorsCount: design.floorsCount,
        builtUpAreaSqFt: design.builtUpAreaSqFt,
        carpetAreaSqFt: design.carpetAreaSqFt,
        bedroomsCount: design.bedroomsCount,
        bathroomsCount: design.bathroomsCount,
        parkingType: design.parkingType,
        openSpacePercentage: design.openSpacePercentage,
        vastuScorePercent: design.vastuScorePercent,
        currentRevision: design.currentRevision,
        roomSchedule: design.roomSchedule,
        costEstimate: design.costEstimate,
        revisionHistory: design.revisions
      }
    };

    const jsonStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forma-project-${project.id}-${design.codeName.toLowerCase()}-specs.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Invokes native window.print() for saving PDF / printing
   */
  static printSummary(): void {
    window.print();
  }
}
