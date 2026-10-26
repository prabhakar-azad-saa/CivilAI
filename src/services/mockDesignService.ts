import { DesignConcept, DesignRevision } from '../types/design';
import { SAMPLE_DESIGNS } from '../data/sampleDesigns';

const DESIGNS_STORAGE_KEY = 'forma_civil_studio_designs_v1';

export class MockDesignService {
  private static getStoredDesigns(): DesignConcept[] {
    try {
      const raw = localStorage.getItem(DESIGNS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
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

  static async resetDesigns(): Promise<void> {
    this.saveDesigns(SAMPLE_DESIGNS);
  }
}
