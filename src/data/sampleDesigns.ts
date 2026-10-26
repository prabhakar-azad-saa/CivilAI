import { DesignConcept, RoomScheduleItem } from '../types/design';

export const INITIAL_ROOM_SCHEDULE_A: RoomScheduleItem[] = [
  { id: 'rm-1', name: 'Living & Drawing Room', floor: 'Ground Floor', dimensions: '18\'0" × 14\'6"', areaSqFt: 261, vastuZone: 'North-East' },
  { id: 'rm-2', name: 'Dining & Courtyard Core', floor: 'Ground Floor', dimensions: '14\'0" × 12\'0"', areaSqFt: 168, vastuZone: 'Brahmasthan/East' },
  { id: 'rm-3', name: 'Modular Kitchen & Utility', floor: 'Ground Floor', dimensions: '12\'0" × 10\'0"', areaSqFt: 120, vastuZone: 'South-East (Agni)' },
  { id: 'rm-4', name: 'Dedicated Pooja Nook', floor: 'Ground Floor', dimensions: '6\'0" × 5\'6"', areaSqFt: 33, vastuZone: 'North-East (Ishanya)' },
  { id: 'rm-5', name: 'Guest Bedroom (Ground)', floor: 'Ground Floor', dimensions: '13\'0" × 12\'0"', areaSqFt: 156, vastuZone: 'North-West (Vayu)' },
  { id: 'rm-6', name: 'Common Bath & Powder Room', floor: 'Ground Floor', dimensions: '7\'6" × 5\'0"', areaSqFt: 38, vastuZone: 'West' },
  { id: 'rm-7', name: 'Covered Portico & Sit-out', floor: 'Ground Floor', dimensions: '16\'0" × 11\'0"', areaSqFt: 176, vastuZone: 'North' },
  { id: 'rm-8', name: 'Master Suite with Walk-in', floor: 'First Floor', dimensions: '16\'6" × 14\'0"', areaSqFt: 231, vastuZone: 'South-West (Nairutya)' },
  { id: 'rm-9', name: 'Attached Master Bath', floor: 'First Floor', dimensions: '8\'6" × 6\'0"', areaSqFt: 51, vastuZone: 'West', isAttachedBath: true },
  { id: 'rm-10', name: 'Children\'s Bedroom', floor: 'First Floor', dimensions: '13\'0" × 12\'6"', areaSqFt: 163, vastuZone: 'West' },
  { id: 'rm-11', name: 'Family Lounge & Study', floor: 'First Floor', dimensions: '14\'6" × 11\'0"', areaSqFt: 160, vastuZone: 'North' },
  { id: 'rm-12', name: 'Cantilever Garden Balcony', floor: 'First Floor', dimensions: '14\'0" × 6\'0"', areaSqFt: 84, vastuZone: 'East' },
  { id: 'rm-13', name: 'Open Terrace & Solar Deck', floor: 'Terrace', dimensions: '28\'0" × 20\'0"', areaSqFt: 560, vastuZone: 'All Sky' },
];

export const INITIAL_ROOM_SCHEDULE_B: RoomScheduleItem[] = [
  { id: 'rm-b1', name: 'Formal Living Pavilion', floor: 'Ground Floor', dimensions: '20\'0" × 15\'0"', areaSqFt: 300, vastuZone: 'North-East' },
  { id: 'rm-b2', name: 'Open Dining & Breakfast Bar', floor: 'Ground Floor', dimensions: '16\'0" × 13\'0"', areaSqFt: 208, vastuZone: 'East' },
  { id: 'rm-b3', name: 'Chef\'s Kitchen & Wet Pantry', floor: 'Ground Floor', dimensions: '14\'0" × 11\'0"', areaSqFt: 154, vastuZone: 'South-East' },
  { id: 'rm-b4', name: 'Ground Floor Suite (Parents)', floor: 'Ground Floor', dimensions: '15\'0" × 13\'0"', areaSqFt: 195, vastuZone: 'South-West' },
  { id: 'rm-b5', name: 'Attached Bath 01', floor: 'Ground Floor', dimensions: '9\'0" × 6\'0"', areaSqFt: 54, vastuZone: 'West', isAttachedBath: true },
  { id: 'rm-b6', name: 'Double-Height Foyer & Veranda', floor: 'Ground Floor', dimensions: '14\'0" × 10\'0"', areaSqFt: 140, vastuZone: 'North' },
  { id: 'rm-b7', name: 'Double Covered Carport', floor: 'Ground Floor', dimensions: '18\'0" × 16\'0"', areaSqFt: 288, vastuZone: 'North-West' },
  { id: 'rm-b8', name: 'Primary Master Suite', floor: 'First Floor', dimensions: '18\'0" × 15\'6"', areaSqFt: 279, vastuZone: 'South-West' },
  { id: 'rm-b9', name: 'Luxury Bath & Jacuzzi Nook', floor: 'First Floor', dimensions: '11\'0" × 8\'0"', areaSqFt: 88, vastuZone: 'West', isAttachedBath: true },
  { id: 'rm-b10', name: 'Bedroom 03 (Teens)', floor: 'First Floor', dimensions: '14\'0" × 13\'0"', areaSqFt: 182, vastuZone: 'North-West' },
  { id: 'rm-b11', name: 'Home Office & Media Room', floor: 'First Floor', dimensions: '15\'0" × 12\'0"', areaSqFt: 180, vastuZone: 'North' },
  { id: 'rm-b12', name: 'Wrap-around Sunset Terrace', floor: 'First Floor', dimensions: '22\'0" × 7\'0"', areaSqFt: 154, vastuZone: 'West/South' },
];

export const INITIAL_ROOM_SCHEDULE_C: RoomScheduleItem[] = [
  { id: 'rm-c1', name: 'Combined Living & Dining', floor: 'Ground Floor', dimensions: '22\'0" × 12\'6"', areaSqFt: 275, vastuZone: 'North-East' },
  { id: 'rm-c2', name: 'Efficient Modular Kitchen', floor: 'Ground Floor', dimensions: '11\'0" × 9\'0"', areaSqFt: 99, vastuZone: 'South-East' },
  { id: 'rm-c3', name: 'Multi-use Room / Study', floor: 'Ground Floor', dimensions: '11\'6" × 10\'0"', areaSqFt: 115, vastuZone: 'East' },
  { id: 'rm-c4', name: 'Powder Room & Laundry', floor: 'Ground Floor', dimensions: '7\'0" × 5\'0"', areaSqFt: 35, vastuZone: 'West' },
  { id: 'rm-c5', name: 'Compact Vehicle Carport', floor: 'Ground Floor', dimensions: '15\'0" × 10\'6"', areaSqFt: 158, vastuZone: 'North-West' },
  { id: 'rm-c6', name: 'Master Bedroom', floor: 'First Floor', dimensions: '15\'0" × 12\'6"', areaSqFt: 188, vastuZone: 'South-West' },
  { id: 'rm-c7', name: 'Ensuite Bath', floor: 'First Floor', dimensions: '8\'0" × 5\'6"', areaSqFt: 44, vastuZone: 'West', isAttachedBath: true },
  { id: 'rm-c8', name: 'Secondary Bedroom', floor: 'First Floor', dimensions: '13\'0" × 11\'0"', areaSqFt: 143, vastuZone: 'North-West' },
  { id: 'rm-c9', name: 'Common Bath', floor: 'First Floor', dimensions: '7\'6" × 5\'0"', areaSqFt: 38, vastuZone: 'West' },
  { id: 'rm-c10', name: 'Breezeway Balcony', floor: 'First Floor', dimensions: '12\'0" × 5\'0"', areaSqFt: 60, vastuZone: 'North' },
];

export const SAMPLE_DESIGNS: DesignConcept[] = [
  {
    id: 'design-arora-a',
    projectId: 'proj-arora-01',
    codeName: 'A',
    title: 'Modern Biophilic Courtyard',
    subtitle: 'Internal Green Atrium with Passive Thermal Cooling',
    description: 'Designed around an open central courtyard that pulls daylight deep into the living spaces. Maximizes cross-ventilation while preserving privacy in dense residential layouts. Features warm teak screens, limestone floor accents, and an open terrace deck.',
    architecturalStyle: 'Modern Biophilic',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    backupImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80'
    ],
    floorsCount: 2,
    floorsLabel: 'Ground + 1 Floor + Rooftop Pergola',
    builtUpAreaSqFt: 1850,
    carpetAreaSqFt: 1540,
    bedroomsCount: 3,
    bathroomsCount: 3,
    parkingSpaces: 1,
    parkingType: 'Covered Portico',
    openSpacePercentage: 28,
    vastuScorePercent: 94,
    vastuNotes: 'Full compliance on North entrance, Agni kitchen (SE), and South-West Master Suite.',
    keyAdvantages: [
      'Central courtyard acts as a natural cooling chimney',
      'Excellent natural daylight throughout living and dining',
      'Protected outdoor sit-out with acoustic privacy from street',
      'Efficient structural spans minimizing column counts'
    ],
    estimatedCostRange: {
      min: 4050000,
      max: 4650000
    },
    currentRevision: 'Rev 1.0',
    revisions: [
      {
        id: 'rev-a-1',
        designId: 'design-arora-a',
        revisionNumber: 'Rev 1.0',
        timestamp: 'Initial Concept Generation',
        description: 'Baseline generated concept conforming to plot dimensions and 3 BHK brief.',
        changedFields: [],
        snapshot: {
          roomSchedule: INITIAL_ROOM_SCHEDULE_A,
          builtUpArea: 1850,
          estimatedBaseCost: 4070000,
          finishTier: 'standard',
          notes: 'Standard residential specification with brick infill and RCC frame.'
        }
      }
    ],
    roomSchedule: INITIAL_ROOM_SCHEDULE_A,
    costEstimate: {
      builtUpAreaSqFt: 1850,
      ratePerSqFt: 2200,
      baseConstructionCost: 4070000,
      allowances: {
        interiorsModularKitchen: 350000,
        landscapingHardscape: 95000,
        smartHomeSecurity: 75000,
        solarRainwater: 120000,
        contingencyReserve: 200000
      },
      totalPreliminaryEstimate: 4910000,
      rateCategory: 'standard',
      assumptions: [
        'Standard RCC framed structure with Fe550 TMT steel and M25 grade concrete',
        'Vitrified floor tiling up to ₹90/sq ft allowance',
        'Teakwood main door frame with premium flush internal shutters',
        'Modular switches with concealed copper wiring (Polycab or equivalent)'
      ],
      exclusions: [
        'Land acquisition and title deed registration costs',
        'Local municipal building plan sanction and development charges',
        'Electrical transformer or Bescom/power supply enhancement fees',
        'Soil stabilization or deep piling if strata reveals black cotton soil'
      ]
    }
  },
  {
    id: 'design-arora-b',
    projectId: 'proj-arora-01',
    codeName: 'B',
    title: 'Pavilion Modernist Villa',
    subtitle: 'Expansive Glazing, Cantilever Decks & Fluid Hospitality Living',
    description: 'A striking contemporary architectural form emphasizing horizontal lines, deep cantilever overhangs, and continuous indoor-outdoor flow. Designed for family entertaining with a generous formal living pavilion and expansive bedroom suites.',
    architecturalStyle: 'Contemporary Modernist',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    backupImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80'
    ],
    floorsCount: 2,
    floorsLabel: 'Ground + 1 Floor + Sky Lounge Deck',
    builtUpAreaSqFt: 2150,
    carpetAreaSqFt: 1820,
    bedroomsCount: 3,
    bathroomsCount: 3,
    parkingSpaces: 2,
    parkingType: 'Double Covered Carport',
    openSpacePercentage: 22,
    vastuScorePercent: 88,
    vastuNotes: 'High Vastu compliance; entrance positioned in favorable 4th Pada of North.',
    keyAdvantages: [
      'Dramatic double-height foyer creates an impressive architectural entrance',
      'Large covered terrace suitable for family gatherings and evening relaxation',
      'Accommodates 2 vehicles comfortably without blocking pedestrian gate',
      'Premium facade finish with textured stone cladding and aluminum louvers'
    ],
    estimatedCostRange: {
      min: 5200000,
      max: 6100000
    },
    currentRevision: 'Rev 1.0',
    revisions: [
      {
        id: 'rev-b-1',
        designId: 'design-arora-b',
        revisionNumber: 'Rev 1.0',
        timestamp: 'Initial Concept Generation',
        description: 'Baseline generated concept emphasizing generous volumetric spaces.',
        changedFields: [],
        snapshot: {
          roomSchedule: INITIAL_ROOM_SCHEDULE_B,
          builtUpArea: 2150,
          estimatedBaseCost: 5590000,
          finishTier: 'premium',
          notes: 'Premium finish with larger glazing specifications and structural cantilevers.'
        }
      }
    ],
    roomSchedule: INITIAL_ROOM_SCHEDULE_B,
    costEstimate: {
      builtUpAreaSqFt: 2150,
      ratePerSqFt: 2600,
      baseConstructionCost: 5590000,
      allowances: {
        interiorsModularKitchen: 480000,
        landscapingHardscape: 140000,
        smartHomeSecurity: 110000,
        solarRainwater: 150000,
        contingencyReserve: 280000
      },
      totalPreliminaryEstimate: 6750000,
      rateCategory: 'premium',
      assumptions: [
        'Premium RCC structure with post-tensioned cantilever beams where required',
        'Large-format Italian marble look tiles (800x1600mm) in common zones',
        'System aluminum thermally insulated window sections (Schüco or equivalent)',
        'Designer false ceiling with indirect cove LED lighting'
      ],
      exclusions: [
        'Site preparation, rock breaking or water dewatering during excavation',
        'Imported bespoke furniture and loose decor',
        'HVAC VRV central air-conditioning ducting equipment'
      ]
    }
  },
  {
    id: 'design-arora-c',
    projectId: 'proj-arora-01',
    codeName: 'C',
    title: 'Space-Efficient Urban Duplex',
    subtitle: 'Precision Structural Footprint with Low Maintenance Envelope',
    description: 'An engineered urban residence designed for optimal space efficiency and lower construction cost. Features a disciplined structural column grid, minimal dead circulation space, and smart vertical storage. Ideal for fast execution and budget discipline.',
    architecturalStyle: 'Minimalist Contemporary',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    backupImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80'
    ],
    floorsCount: 2,
    floorsLabel: 'Ground + 1 Floor + Utility Roof',
    builtUpAreaSqFt: 1650,
    carpetAreaSqFt: 1420,
    bedroomsCount: 3,
    bathroomsCount: 3,
    parkingSpaces: 1,
    parkingType: 'Linear Driveway Bay',
    openSpacePercentage: 32,
    vastuScorePercent: 91,
    vastuNotes: 'Sound alignment with North gate and South-East kitchen placement.',
    keyAdvantages: [
      'Lowest cost per usable square foot with almost zero wasted hallway space',
      'Straightforward structural grid reduces construction timeline by 4-6 weeks',
      'Highly energy-efficient thermal mass minimizes summer cooling loads',
      'Easily adaptable for future rooftop expansion or solar battery storage'
    ],
    estimatedCostRange: {
      min: 3400000,
      max: 3950000
    },
    currentRevision: 'Rev 1.0',
    revisions: [
      {
        id: 'rev-c-1',
        designId: 'design-arora-c',
        revisionNumber: 'Rev 1.0',
        timestamp: 'Initial Concept Generation',
        description: 'Baseline generated concept focusing on space and budget optimization.',
        changedFields: [],
        snapshot: {
          roomSchedule: INITIAL_ROOM_SCHEDULE_C,
          builtUpArea: 1650,
          estimatedBaseCost: 3465000,
          finishTier: 'standard',
          notes: 'Standard cost-conscious finish with durable materials and quick execution.'
        }
      }
    ],
    roomSchedule: INITIAL_ROOM_SCHEDULE_C,
    costEstimate: {
      builtUpAreaSqFt: 1650,
      ratePerSqFt: 2100,
      baseConstructionCost: 3465000,
      allowances: {
        interiorsModularKitchen: 280000,
        landscapingHardscape: 65000,
        smartHomeSecurity: 45000,
        solarRainwater: 95000,
        contingencyReserve: 160000
      },
      totalPreliminaryEstimate: 4110000,
      rateCategory: 'standard',
      assumptions: [
        'Standard RCC frame with fly-ash or AAC block masonry for thermal efficiency',
        'UPVC sliding 2-track and 3-track windows with mosquito mesh',
        'Anti-skid ceramic tiles in utility and bathrooms, vitrified tiles in bedrooms',
        'Underground RCC sump (6,000 litres) and overhead Sintex PVC tank (1,500 litres)'
      ],
      exclusions: [
        'External compound wall and main gate beyond basic allowance',
        'Borewell drilling, submersible pump, and depth casing piping',
        'Lift mechanism shaft cladding'
      ]
    }
  }
];
