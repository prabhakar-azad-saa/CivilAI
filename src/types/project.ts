export type MeasurementUnit = 'feet' | 'meters';

export type PlotShape = 'rectangle' | 'square' | 'irregular';

export type FacingDirection = 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west';

export type RoadPosition = 'front' | 'corner' | 'two-side' | 'cul-de-sac';

export type BuildingType = 'independent' | 'villa' | 'duplex' | 'rental';

export type ProjectStage = 'draft' | 'requirements' | 'designs_ready' | 'refining' | 'exported';

export interface PlotDetails {
  length: number;
  width: number;
  unit: MeasurementUnit;
  totalArea: number; // in sq ft or sq meters
  shape: PlotShape;
  facing: FacingDirection;
  roadPosition: RoadPosition;
  surroundings: 'open' | 'adjacent_dense' | 'semi_open';
  city: string;
  hasSoilTest?: boolean;
}

export interface BuildingConfiguration {
  floors: '1' | '2' | '3' | 'duplex';
  buildingType: BuildingType;
  targetBuiltUpArea?: number;
  futureExpansion: boolean;
  rentalIncomePurpose: boolean;
}

export interface RoomRequirements {
  bedrooms: number;
  masterBedroom: boolean;
  guestRoom: boolean;
  kidsRoom: boolean;
  studyRoom: boolean;
  livingRoomSize: 'compact' | 'standard' | 'spacious' | 'grand';
  separateDrawingRoom: boolean;
  familyLounge: boolean;
}

export interface BathroomRequirements {
  totalBathrooms: number;
  attachedBathrooms: number;
  commonBathrooms: number;
  separateToiletBath: boolean;
}

export interface KitchenDiningRequirements {
  kitchenType: 'open' | 'closed' | 'semi-open';
  isModular: boolean;
  diningArea: 'integrated' | 'dedicated_formal';
  pantryStore: boolean;
}

export interface OutdoorParkingRequirements {
  balcony: boolean;
  terraceRoofAccess: boolean;
  gardenLawn: boolean;
  courtyard: boolean;
  sitoutVeranda: boolean;
  parkingRequired: boolean;
  vehicleCount: number;
  parkingType: 'covered' | 'open' | 'basement';
}

export interface SpecialSpacesRequirements {
  poojaRoom: boolean;
  homeOffice: boolean;
  homeGym: boolean;
  homeTheatre: boolean;
  servantRoom: boolean;
  laundryRoom: boolean;
  additionalStorage: boolean;
}

export interface VastuDesignPreferences {
  vastuCompliance: 'strict' | 'moderate' | 'flexible' | 'not_required';
  entranceDirection: FacingDirection;
  kitchenDirection: 'south-east' | 'north-west' | 'any';
  masterBedroomDirection: 'south-west' | 'south' | 'any';
  architecturalStyle: 'modern' | 'contemporary' | 'traditional' | 'minimalist' | 'biophilic';
  finishTier: 'standard' | 'premium' | 'luxury';
  layoutDensity: 'open' | 'zoned' | 'compact';
}

export interface UtilitiesConstraints {
  provisionLift: boolean;
  staircaseType: 'internal' | 'external' | 'spiral' | 'cantilever';
  solarPanelSpace: boolean;
  rainwaterHarvesting: boolean;
  waterTankPlacement: 'overhead' | 'underground_sump' | 'both';
  budgetMin: number;
  budgetMax: number;
  sunlightPriority: 'high' | 'moderate';
  ventilationPriority: 'maximum' | 'standard';
  smartHomeFeatures: boolean;
  rainProtectionBalconies: boolean;
}

export interface ProjectRequirements {
  plot: PlotDetails;
  building: BuildingConfiguration;
  rooms: RoomRequirements;
  bathrooms: BathroomRequirements;
  kitchenDining: KitchenDiningRequirements;
  outdoorParking: OutdoorParkingRequirements;
  specialSpaces: SpecialSpacesRequirements;
  vastuPreferences: VastuDesignPreferences;
  utilities: UtilitiesConstraints;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  plot: PlotDetails;
  currentStage: ProjectStage;
  selectedDesignId?: string;
  requirements?: ProjectRequirements;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
}
