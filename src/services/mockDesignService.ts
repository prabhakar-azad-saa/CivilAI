import { DesignConcept, DesignRevision, RenderImageItem } from '../types/design';
import { SAMPLE_DESIGNS } from '../data/sampleDesigns';

const DESIGNS_STORAGE_KEY = 'forma_civil_studio_designs_v2';

export class MockDesignService {
  private static getStoredDesigns(): DesignConcept[] {
    try {
      const raw = localStorage.getItem(DESIGNS_STORAGE_KEY);
      if (raw) {
        const parsed: DesignConcept[] = JSON.parse(raw);
        // Ensure designs have isometricCutawayImage and renderGallery if upgraded
        const upgraded = parsed.map((d) => {
          const sample = SAMPLE_DESIGNS.find((s) => s.codeName === d.codeName) || SAMPLE_DESIGNS[0];
          return {
            ...d,
            isometricCutawayImage: d.isometricCutawayImage || sample.isometricCutawayImage,
            splitSyncImage: d.splitSyncImage || sample.splitSyncImage,
            blueprint2dImage: d.blueprint2dImage || sample.blueprint2dImage,
            renderGallery: (d.renderGallery && d.renderGallery.length > 0) ? d.renderGallery : sample.renderGallery
          };
        });
        return upgraded;
      }
    } catch (e) {
      console.warn('Failed to parse designs from storage', e);
    }
    this.saveDesigns(SAMPLE_DESIGNS);
    return SAMPLE_DESIGNS;
  }

  private static saveDesigns(designs: DesignConcept[]): void {
    try {
      localStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify(designs));
    } catch (e) {
      console.error('Failed to save designs to storage', e);
    }
  }

  static async getDesignsForProject(projectId: string): Promise<DesignConcept[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = this.getStoredDesigns();
    const matches = all.filter((d) => d.projectId === projectId);
    if (matches.length > 0) {
      return matches;
    }
    // If it's a newly created project without existing designs, clone sample designs tailored to it
    const cloned = SAMPLE_DESIGNS.map((d) => ({
      ...JSON.parse(JSON.stringify(d)),
      id: `design-${projectId}-${d.codeName.toLowerCase()}`,
      projectId: projectId
    }));
    all.push(...cloned);
    this.saveDesigns(all);
    return cloned;
  }

  static async getDesignById(designId: string): Promise<DesignConcept | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = this.getStoredDesigns();
    const found = all.find((d) => d.id === designId);
    if (found) return found;
    // Fallback if looking by short code or original sample ID
    return all.find((d) => d.id.includes(designId)) || all[0] || null;
  }

  static async updateDesign(designId: string, updates: Partial<DesignConcept>): Promise<DesignConcept> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = this.getStoredDesigns();
    const idx = all.findIndex((d) => d.id === designId);
    if (idx === -1) {
      throw new Error(`Design with ID ${designId} not found`);
    }
    const updated = {
      ...all[idx],
      ...updates
    };
    all[idx] = updated;
    this.saveDesigns(all);
    return updated;
  }

  static async addRevision(
    designId: string,
    description: string,
    changedFields: string[],
    newSnapshot: Partial<DesignConcept>
  ): Promise<{ design: DesignConcept; revision: DesignRevision }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = this.getStoredDesigns();
    const idx = all.findIndex((d) => d.id === designId);
    if (idx === -1) throw new Error('Design not found');

    const currentDesign = all[idx];
    const revIndex = currentDesign.revisions.length + 1;
    const revNumber = `Rev 1.${revIndex - 1}`;

    const newRevision: DesignRevision = {
      id: `rev-${designId}-${Date.now()}`,
      designId,
      revisionNumber: revNumber,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description,
      changedFields,
      snapshot: {
        roomSchedule: newSnapshot.roomSchedule || currentDesign.roomSchedule,
        builtUpArea: newSnapshot.builtUpAreaSqFt || currentDesign.builtUpAreaSqFt,
        estimatedBaseCost: newSnapshot.costEstimate?.baseConstructionCost || currentDesign.costEstimate.baseConstructionCost,
        finishTier: newSnapshot.costEstimate?.rateCategory === 'basic' ? 'standard' : (newSnapshot.costEstimate?.rateCategory as any) || 'standard',
        notes: description
      }
    };

    const updatedDesign: DesignConcept = {
      ...currentDesign,
      ...newSnapshot,
      currentRevision: revNumber,
      revisions: [newRevision, ...currentDesign.revisions]
    };

    all[idx] = updatedDesign;
    this.saveDesigns(all);
    return { design: updatedDesign, revision: newRevision };
  }

  static async restoreRevision(designId: string, revisionId: string): Promise<DesignConcept> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const all = this.getStoredDesigns();
    const idx = all.findIndex((d) => d.id === designId);
    if (idx === -1) throw new Error('Design not found');

    const design = all[idx];
    const targetRev = design.revisions.find((r) => r.id === revisionId);
    if (!targetRev) throw new Error('Revision not found');

    // Recalculate cost estimate based on snapshot
    const updatedCost = {
      ...design.costEstimate,
      builtUpAreaSqFt: targetRev.snapshot.builtUpArea,
      baseConstructionCost: targetRev.snapshot.estimatedBaseCost,
      totalPreliminaryEstimate:
        targetRev.snapshot.estimatedBaseCost +
        Object.values(design.costEstimate.allowances).reduce((a, b) => a + b, 0)
    };

    const restored: DesignConcept = {
      ...design,
      currentRevision: `${targetRev.revisionNumber} (Restored)`,
      roomSchedule: JSON.parse(JSON.stringify(targetRev.snapshot.roomSchedule)),
      builtUpAreaSqFt: targetRev.snapshot.builtUpArea,
      costEstimate: updatedCost
    };

    all[idx] = restored;
    this.saveDesigns(all);
    return restored;
  }

  static async addImageToGallery(designId: string, item: RenderImageItem): Promise<DesignConcept> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const all = this.getStoredDesigns();
    const idx = all.findIndex((d) => d.id === designId);
    if (idx === -1) throw new Error('Design not found');

    const current = all[idx];
    const currentGallery = current.renderGallery || [];
    const updatedGallery = [item, ...currentGallery];
    const updatedGalleryImages = [item.url, ...(current.galleryImages || [])];

    const updated: DesignConcept = {
      ...current,
      renderGallery: updatedGallery,
      galleryImages: updatedGalleryImages
    };

    all[idx] = updated;
    this.saveDesigns(all);
    return updated;
  }

  static async createDesignFromUploaded2DPlan(
    projectId: string,
    userUploadedImageUrl: string,
    options?: { title?: string; builtUpAreaSqFt?: number; style?: string }
  ): Promise<DesignConcept> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const all = this.getStoredDesigns();

    const area = options?.builtUpAreaSqFt || 1850;
    const rate = 2300;
    const baseCost = area * rate;
    const newId = `design-${projectId}-ai-custom-${Date.now().toString(36)}`;

    const newDesign: DesignConcept = {
      id: newId,
      projectId,
      codeName: 'A',
      title: options?.title || 'AI Converted 3D Model from Custom 2D Plan',
      subtitle: 'Synchronized 3D Cutaway & Exterior Renders from Uploaded Blueprint',
      description: 'Automatically synthesized from your custom 2D architectural blueprint drawing. Features AI-detected spatial boundaries, furnished room zoning, structural column alignment, and instant 3D photorealistic visualization.',
      architecturalStyle: options?.style || 'Contemporary Modernist',
      coverImage: '/renders/concept-a-cutaway.jpg',
      backupImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      isometricCutawayImage: '/renders/concept-a-cutaway.jpg',
      blueprint2dImage: userUploadedImageUrl,
      splitSyncImage: '/renders/concept-a-split.png',
      galleryImages: [
        '/renders/concept-a-cutaway.jpg',
        userUploadedImageUrl,
        '/renders/concept-a-split.png',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
      ],
      renderGallery: [
        {
          id: `rg-up-1-${Date.now()}`,
          title: '3D Isometric Top Cutaway (Furnished from Your 2D Plan)',
          category: '3d-cutaway',
          url: '/renders/concept-a-cutaway.jpg',
          caption: 'High-definition 3D cutaway showing Master Bedroom, Guest Bedroom, Island Kitchen, and Living Lounge generated from your blueprint.',
          roomTags: ['Master Bed', 'Open Kitchen', 'Living', 'Bathrooms', 'Deck Balcony']
        },
        {
          id: `rg-up-2-${Date.now()}`,
          title: 'Your Uploaded 2D Architectural Blueprint',
          category: '2d-blueprint',
          url: userUploadedImageUrl,
          caption: 'The original 2D floor plan provided by user, analyzed for wall dimensions, room zones and doors.',
          roomTags: ['User Plan', '2D Blueprint', 'Detected Layout']
        },
        {
          id: `rg-up-3-${Date.now()}`,
          title: 'Split-Screen 2D Blueprint + 3D BIM Sync',
          category: 'split-sync',
          url: '/renders/concept-a-split.png',
          caption: 'CAD blueprint aligned side-by-side with 3D architectural facade render and parking bays.',
          roomTags: ['Split Screen', '2D vs 3D', 'Carport']
        },
        {
          id: `rg-up-4-${Date.now()}`,
          title: 'Architectural Exterior Elevation Render',
          category: 'exterior-3d',
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
          caption: 'Photorealistic exterior villa view generated from spatial massing parameters.',
          roomTags: ['Exterior Elevation', 'Facade']
        }
      ],
      floorsCount: 2,
      floorsLabel: 'Ground + 1 Floor + Terrace',
      builtUpAreaSqFt: area,
      carpetAreaSqFt: Math.round(area * 0.82),
      bedroomsCount: 3,
      bathroomsCount: 3,
      parkingSpaces: 2,
      parkingType: 'Covered Portico & Driveway',
      openSpacePercentage: 26,
      vastuScorePercent: 92,
      vastuNotes: 'High Vastu score verified across North entrance and East living daylight axis.',
      keyAdvantages: [
        'Generated directly from custom uploaded 2D blueprint',
        'Accurately preserves your wall layout and spatial flow',
        'Includes 3D furnished isometric cutaway with bedroom & kitchen top views',
        'Instant civil construction preliminary BOQ estimate'
      ],
      estimatedCostRange: {
        min: baseCost,
        max: Math.round(baseCost * 1.18)
      },
      currentRevision: 'Rev 1.0 (Custom Plan)',
      revisions: [
        {
          id: `rev-up-${Date.now()}`,
          designId: newId,
          revisionNumber: 'Rev 1.0',
          timestamp: 'Just now',
          description: 'AI 2D-to-3D Synthesis from user blueprint upload.',
          changedFields: ['blueprint2dImage', 'isometricCutawayImage'],
          snapshot: {
            roomSchedule: [
              { id: 'up-1', name: 'Master Bedroom Suite', floor: 'Ground Floor', dimensions: "16'0\" × 14'0\"", areaSqFt: 224, vastuZone: 'South-West' },
              { id: 'up-2', name: 'Living & Family Pavilion', floor: 'Ground Floor', dimensions: "20'0\" × 18'0\"", areaSqFt: 360, vastuZone: 'North-East' },
              { id: 'up-3', name: 'Chef Modular Kitchen & Dining', floor: 'Ground Floor', dimensions: "16'0\" × 12'0\"", areaSqFt: 192, vastuZone: 'South-East' },
              { id: 'up-4', name: 'Guest Bedroom 02', floor: 'Ground Floor', dimensions: "13'0\" × 12'0\"", areaSqFt: 156, vastuZone: 'North-West' },
              { id: 'up-5', name: 'Balcony & Landscape Sit-out', floor: 'Ground Floor', dimensions: "14'0\" × 8'0\"", areaSqFt: 112, vastuZone: 'East' }
            ],
            builtUpArea: area,
            estimatedBaseCost: baseCost,
            finishTier: 'standard',
            notes: 'Generated from custom uploaded 2D blueprint'
          }
        }
      ],
      roomSchedule: [
        { id: 'up-1', name: 'Master Bedroom Suite', floor: 'Ground Floor', dimensions: "16'0\" × 14'0\"", areaSqFt: 224, vastuZone: 'South-West' },
        { id: 'up-2', name: 'Living & Family Pavilion', floor: 'Ground Floor', dimensions: "20'0\" × 18'0\"", areaSqFt: 360, vastuZone: 'North-East' },
        { id: 'up-3', name: 'Chef Modular Kitchen & Dining', floor: 'Ground Floor', dimensions: "16'0\" × 12'0\"", areaSqFt: 192, vastuZone: 'South-East' },
        { id: 'up-4', name: 'Guest Bedroom 02', floor: 'Ground Floor', dimensions: "13'0\" × 12'0\"", areaSqFt: 156, vastuZone: 'North-West' },
        { id: 'up-5', name: 'Balcony & Landscape Sit-out', floor: 'Ground Floor', dimensions: "14'0\" × 8'0\"", areaSqFt: 112, vastuZone: 'East' }
      ],
      costEstimate: {
        builtUpAreaSqFt: area,
        ratePerSqFt: rate,
        baseConstructionCost: baseCost,
        allowances: {
          interiorsModularKitchen: 380000,
          landscapingHardscape: 110000,
          smartHomeSecurity: 85000,
          solarRainwater: 130000,
          contingencyReserve: 220000
        },
        totalPreliminaryEstimate: baseCost + 925000,
        rateCategory: 'standard',
        assumptions: [
          'Estimated based on recognized room dimensions from uploaded 2D plan',
          'Standard RCC structure Fe550 steel & M25 concrete',
          'Premium modular kitchen and bathroom fittings'
        ],
        exclusions: ['Demolition or existing structure clearing', 'Municipal approval fees']
      }
    };

    all.unshift(newDesign);
    this.saveDesigns(all);
    return newDesign;
  }

  static async resetDesigns(): Promise<void> {
    this.saveDesigns(SAMPLE_DESIGNS);
  }
}
