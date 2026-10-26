export interface RoomScheduleItem {
  id: string;
  name: string;
  floor: 'Ground Floor' | 'First Floor' | 'Terrace';
  dimensions: string; // e.g. "16'0\" × 14'0\""
  areaSqFt: number;
  vastuZone?: string;
  isAttachedBath?: boolean;
}

export interface DesignRevision {
  id: string;
  designId: string;
  revisionNumber: string; // e.g. "Rev 1.0", "Rev 1.1"
  timestamp: string;
  description: string;
  promptApplied?: string;
  changedFields: string[];
  snapshot: {
    roomSchedule: RoomScheduleItem[];
    builtUpArea: number;
    estimatedBaseCost: number;
    finishTier: 'standard' | 'premium' | 'luxury';
    notes: string;
  };
}

export interface CostEstimate {
  builtUpAreaSqFt: number;
  ratePerSqFt: number;
  baseConstructionCost: number;
  allowances: {
    interiorsModularKitchen: number;
    landscapingHardscape: number;
    smartHomeSecurity: number;
    solarRainwater: number;
    contingencyReserve: number;
  };
  totalPreliminaryEstimate: number;
  rateCategory: 'basic' | 'standard' | 'premium' | 'luxury';
  assumptions: string[];
  exclusions: string[];
}

export interface DesignConcept {
  id: string;
  projectId: string;
  codeName: 'A' | 'B' | 'C';
  title: string;
  subtitle: string;
  description: string;
  architecturalStyle: string;
  coverImage: string;
  backupImage: string;
  galleryImages: string[];
  floorsCount: number;
  floorsLabel: string;
  builtUpAreaSqFt: number;
  carpetAreaSqFt: number;
  bedroomsCount: number;
  bathroomsCount: number;
  parkingSpaces: number;
  parkingType: string;
  openSpacePercentage: number;
  vastuScorePercent: number;
  vastuNotes: string;
  keyAdvantages: string[];
  estimatedCostRange: {
    min: number;
    max: number;
  };
  currentRevision: string;
  revisions: DesignRevision[];
  roomSchedule: RoomScheduleItem[];
  costEstimate: CostEstimate;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: string;
  appliedRevisionId?: string;
  summaryOfChange?: string;
}
