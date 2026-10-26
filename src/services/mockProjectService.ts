import { Project, ProjectRequirements } from '../types/project';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

const STORAGE_KEY = 'forma_civil_studio_projects_v1';

export class MockProjectService {
  private static getStoredProjects(): Project[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse projects from localStorage', e);
    }
    // Seed default projects if empty
    this.saveProjects(SAMPLE_PROJECTS);
    return SAMPLE_PROJECTS;
  }

  private static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }

  static async getProjects(): Promise<Project[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return this.getStoredProjects();
  }

  static async getProjectById(id: string): Promise<Project | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const projects = this.getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  }

  static async createProject(data: Partial<Project>): Promise<Project> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const projects = this.getStoredProjects();
    const newId = `proj-${Date.now().toString(36)}`;
    const newProject: Project = {
      id: newId,
      name: data.name || 'Untitled Home Project',
      location: data.location || 'Bengaluru, Karnataka',
      plot: data.plot || {
        length: 40,
        width: 30,
        unit: 'feet',
        totalArea: 1200,
        shape: 'rectangle',
        facing: 'north',
        roadPosition: 'front',
        surroundings: 'semi_open',
        city: 'Bengaluru'
      },
      currentStage: 'requirements',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnailUrl: data.thumbnailUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      requirements: data.requirements
    };
    projects.unshift(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const projects = this.getStoredProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) {
      throw new Error(`Project with ID ${id} not found`);
    }
    const updated = {
      ...projects[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    projects[idx] = updated;
    this.saveProjects(projects);
    return updated;
  }

  static async saveRequirements(id: string, requirements: ProjectRequirements): Promise<Project> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return this.updateProject(id, {
      requirements,
      currentStage: 'designs_ready',
      plot: requirements.plot
    });
  }

  static async duplicateProject(id: string): Promise<Project> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const projects = this.getStoredProjects();
    const source = projects.find((p) => p.id === id);
    if (!source) throw new Error('Source project not found');

    const copyId = `proj-${Date.now().toString(36)}`;
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(source)),
      id: copyId,
      name: `${source.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.unshift(duplicated);
    this.saveProjects(projects);
    return duplicated;
  }

  static async deleteProject(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    let projects = this.getStoredProjects();
    const initialLen = projects.length;
    projects = projects.filter((p) => p.id !== id);
    this.saveProjects(projects);
    return projects.length < initialLen;
  }

  static async resetSeedData(): Promise<Project[]> {
    this.saveProjects(SAMPLE_PROJECTS);
    return SAMPLE_PROJECTS;
  }
}
