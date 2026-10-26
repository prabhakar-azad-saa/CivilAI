import { Project } from '../types/project';

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-arora-01',
    name: 'Arora Family Residence',
    location: 'Whitefield, Bengaluru',
    plot: {
      length: 40,
      width: 30,
      unit: 'feet',
      totalArea: 1200,
      shape: 'rectangle',
      facing: 'north',
      roadPosition: 'front',
      surroundings: 'semi_open',
      city: 'Bengaluru',
      hasSoilTest: true
    },
    currentStage: 'designs_ready',
    selectedDesignId: 'design-arora-a',
    createdAt: '2026-10-20T09:30:00Z',
    updatedAt: '2026-10-25T14:45:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    requirements: {
      plot: {
        length: 40,
        width: 30,
        unit: 'feet',
        totalArea: 1200,
        shape: 'rectangle',
        facing: 'north',
        roadPosition: 'front',
        surroundings: 'semi_open',
        city: 'Bengaluru',
        hasSoilTest: true
      },
      building: {
        floors: '2',
        buildingType: 'duplex',
        targetBuiltUpArea: 1850,
        futureExpansion: true,
        rentalIncomePurpose: false
      },
      rooms: {
        bedrooms: 3,
        masterBedroom: true,
        guestRoom: true,
        kidsRoom: true,
        studyRoom: true,
        livingRoomSize: 'spacious',
        separateDrawingRoom: false,
        familyLounge: true
      },
      bathrooms: {
        totalBathrooms: 3,
        attachedBathrooms: 2,
        commonBathrooms: 1,
        separateToiletBath: false
      },
      kitchenDining: {
        kitchenType: 'semi-open',
        isModular: true,
        diningArea: 'integrated',
        pantryStore: true
      },
      outdoorParking: {
        balcony: true,
        terraceRoofAccess: true,
        gardenLawn: false,
        courtyard: true,
        sitoutVeranda: true,
        parkingRequired: true,
        vehicleCount: 1,
        parkingType: 'covered'
      },
      specialSpaces: {
        poojaRoom: true,
        homeOffice: true,
        homeGym: false,
        homeTheatre: false,
        servantRoom: false,
        laundryRoom: true,
        additionalStorage: true
      },
      vastuPreferences: {
        vastuCompliance: 'moderate',
        entranceDirection: 'north',
        kitchenDirection: 'south-east',
        masterBedroomDirection: 'south-west',
        architecturalStyle: 'modern',
        finishTier: 'standard',
        layoutDensity: 'open'
      },
      utilities: {
        provisionLift: false,
        staircaseType: 'internal',
        solarPanelSpace: true,
        rainwaterHarvesting: true,
        waterTankPlacement: 'overhead',
        budgetMin: 3800000,
        budgetMax: 4800000,
        sunlightPriority: 'high',
        ventilationPriority: 'maximum',
        smartHomeFeatures: true,
        rainProtectionBalconies: true
      }
    }
  },
  {
    id: 'proj-courtyard-02',
    name: 'Green Courtyard Home',
    location: 'Jubilee Hills, Hyderabad',
    plot: {
      length: 60,
      width: 40,
      unit: 'feet',
      totalArea: 2400,
      shape: 'rectangle',
      facing: 'east',
      roadPosition: 'corner',
      surroundings: 'open',
      city: 'Hyderabad',
      hasSoilTest: true
    },
    currentStage: 'designs_ready',
    selectedDesignId: 'design-courtyard-b',
    createdAt: '2026-10-18T11:15:00Z',
    updatedAt: '2026-10-24T16:20:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    requirements: {
      plot: {
        length: 60,
        width: 40,
        unit: 'feet',
        totalArea: 2400,
        shape: 'rectangle',
        facing: 'east',
        roadPosition: 'corner',
        surroundings: 'open',
        city: 'Hyderabad',
        hasSoilTest: true
      },
      building: {
        floors: '2',
        buildingType: 'villa',
        targetBuiltUpArea: 2800,
        futureExpansion: false,
        rentalIncomePurpose: false
      },
      rooms: {
        bedrooms: 4,
        masterBedroom: true,
        guestRoom: true,
        kidsRoom: true,
        studyRoom: true,
        livingRoomSize: 'grand',
        separateDrawingRoom: true,
        familyLounge: true
      },
      bathrooms: {
        totalBathrooms: 4,
        attachedBathrooms: 3,
        commonBathrooms: 1,
        separateToiletBath: false
      },
      kitchenDining: {
        kitchenType: 'open',
        isModular: true,
        diningArea: 'dedicated_formal',
        pantryStore: true
      },
      outdoorParking: {
        balcony: true,
        terraceRoofAccess: true,
        gardenLawn: true,
        courtyard: true,
        sitoutVeranda: true,
        parkingRequired: true,
        vehicleCount: 2,
        parkingType: 'covered'
      },
      specialSpaces: {
        poojaRoom: true,
        homeOffice: true,
        homeGym: true,
        homeTheatre: false,
        servantRoom: true,
        laundryRoom: true,
        additionalStorage: true
      },
      vastuPreferences: {
        vastuCompliance: 'strict',
        entranceDirection: 'east',
        kitchenDirection: 'south-east',
        masterBedroomDirection: 'south-west',
        architecturalStyle: 'biophilic',
        finishTier: 'premium',
        layoutDensity: 'open'
      },
      utilities: {
        provisionLift: true,
        staircaseType: 'cantilever',
        solarPanelSpace: true,
        rainwaterHarvesting: true,
        waterTankPlacement: 'both',
        budgetMin: 6500000,
        budgetMax: 8200000,
        sunlightPriority: 'high',
        ventilationPriority: 'maximum',
        smartHomeFeatures: true,
        rainProtectionBalconies: true
      }
    }
  },
  {
    id: 'proj-urban-03',
    name: 'Compact Urban Duplex',
    location: 'Baner, Pune',
    plot: {
      length: 50,
      width: 25,
      unit: 'feet',
      totalArea: 1250,
      shape: 'rectangle',
      facing: 'west',
      roadPosition: 'front',
      surroundings: 'adjacent_dense',
      city: 'Pune',
      hasSoilTest: false
    },
    currentStage: 'designs_ready',
    selectedDesignId: 'design-urban-c',
    createdAt: '2026-10-15T15:00:00Z',
    updatedAt: '2026-10-22T10:10:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    requirements: {
      plot: {
        length: 50,
        width: 25,
        unit: 'feet',
        totalArea: 1250,
        shape: 'rectangle',
        facing: 'west',
        roadPosition: 'front',
        surroundings: 'adjacent_dense',
        city: 'Pune',
        hasSoilTest: false
      },
      building: {
        floors: 'duplex',
        buildingType: 'duplex',
        targetBuiltUpArea: 1650,
        futureExpansion: false,
        rentalIncomePurpose: false
      },
      rooms: {
        bedrooms: 3,
        masterBedroom: true,
        guestRoom: false,
        kidsRoom: true,
        studyRoom: true,
        livingRoomSize: 'standard',
        separateDrawingRoom: false,
        familyLounge: false
      },
      bathrooms: {
        totalBathrooms: 3,
        attachedBathrooms: 2,
        commonBathrooms: 1,
        separateToiletBath: false
      },
      kitchenDining: {
        kitchenType: 'closed',
        isModular: true,
        diningArea: 'integrated',
        pantryStore: false
      },
      outdoorParking: {
        balcony: true,
        terraceRoofAccess: true,
        gardenLawn: false,
        courtyard: false,
        sitoutVeranda: true,
        parkingRequired: true,
        vehicleCount: 1,
        parkingType: 'covered'
      },
      specialSpaces: {
        poojaRoom: true,
        homeOffice: true,
        homeGym: false,
        homeTheatre: false,
        servantRoom: false,
        laundryRoom: true,
        additionalStorage: false
      },
      vastuPreferences: {
        vastuCompliance: 'moderate',
        entranceDirection: 'north',
        kitchenDirection: 'south-east',
        masterBedroomDirection: 'south-west',
        architecturalStyle: 'minimalist',
        finishTier: 'standard',
        layoutDensity: 'compact'
      },
      utilities: {
        provisionLift: false,
        staircaseType: 'internal',
        solarPanelSpace: true,
        rainwaterHarvesting: true,
        waterTankPlacement: 'overhead',
        budgetMin: 3400000,
        budgetMax: 4200000,
        sunlightPriority: 'high',
        ventilationPriority: 'maximum',
        smartHomeFeatures: false,
        rainProtectionBalconies: true
      }
    }
  }
];
