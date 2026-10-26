import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
  Home,
  Layers,
  Bath,
  UtensilsCrossed,
  Car,
  Shield,
  Zap,
  CheckSquare
} from 'lucide-react';
import { Project, ProjectRequirements } from '../types/project';
import { MockProjectService } from '../services/mockProjectService';

const STEP_DEFINITIONS = [
  { id: 1, title: 'Plot Details', icon: Compass, desc: 'Dimensions, orientation & site constraints' },
  { id: 2, title: 'Building Config', icon: Home, desc: 'Floors, typology & expansion plans' },
  { id: 3, title: 'Rooms & Living', icon: Layers, desc: 'Bedrooms, living & family lounge' },
  { id: 4, title: 'Bathrooms', icon: Bath, desc: 'Attached & common sanitary counts' },
  { id: 5, title: 'Kitchen & Dining', icon: UtensilsCrossed, desc: 'Layout, modularity & pantry' },
  { id: 6, title: 'Outdoor & Parking', icon: Car, desc: 'Balconies, terraces & vehicle bays' },
  { id: 7, title: 'Special Spaces', icon: Shield, desc: 'Pooja, gym, theatre & utilities' },
  { id: 8, title: 'Vastu & Style', icon: Compass, desc: 'Auspicious zones & aesthetics' },
  { id: 9, title: 'Utilities & Budget', icon: Zap, desc: 'Solar, MEP & preliminary budget' },
  { id: 10, title: 'Review & Generate', icon: CheckSquare, desc: 'Summary & concept generation' }
];

export const RequirementsWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genStatusText, setGenStatusText] = useState<string>('Synthesizing plot geometry...');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<ProjectRequirements>({
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
  });

  useEffect(() => {
    async function load() {
      if (!id) return;
      const p = await MockProjectService.getProjectById(id);
      if (p) {
        setProject(p);
        if (p.requirements) {
          setFormData(p.requirements);
        } else if (p.plot) {
          setFormData((prev) => ({
            ...prev,
            plot: p.plot
          }));
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // Recalculate plot area when length/width change
  const handleDimensionChange = (field: 'length' | 'width', val: number) => {
    setFormData((prev) => {
      const length = field === 'length' ? val : prev.plot.length;
      const width = field === 'width' ? val : prev.plot.width;
      const totalArea = length * width;
      return {
        ...prev,
        plot: { ...prev.plot, [field]: val, totalArea }
      };
    });
  };

  const handleSaveDraft = async () => {
    if (!id) return;
    await MockProjectService.saveRequirements(id, formData);
    setSaveNotice('Draft saved to project workspace!');
    setTimeout(() => setSaveNotice(null), 2500);
  };

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmAndGenerate = async () => {
    if (!id) return;
    setIsGenerating(true);

    // Realistic multi-stage preparation sequence
    setGenStatusText('Synthesizing plot boundary and road access...');
    await new Promise((r) => setTimeout(r, 700));

    setGenStatusText('Aligning Vastu cardinal directions and solar paths...');
    await new Promise((r) => setTimeout(r, 800));

    setGenStatusText('Optimizing structural column grid & room schedules...');
    await new Promise((r) => setTimeout(r, 800));

    setGenStatusText('Generating 3 distinct architectural alternatives...');
    await new Promise((r) => setTimeout(r, 700));

    await MockProjectService.saveRequirements(id, formData);
    setIsGenerating(false);
    navigate(`/projects/${id}/designs`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-stone-600 font-mono text-sm">
          <Sparkles className="w-5 h-5 animate-spin text-olive-700" />
          <span>Loading project brief...</span>
        </div>
      </div>
    );
  }

  // Calculate Progress Percentage
  const progressPercent = Math.round((currentStep / 10) * 100);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <Link to="/projects" className="text-stone-500 hover:text-charcoal-900 font-medium">
              Projects
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-charcoal-900 truncate max-w-[200px]">
              {project?.name || 'Untitled Project'}
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-olive-800 font-semibold">Requirements Wizard</span>
          </div>

          <div className="flex items-center gap-3">
            {saveNotice && (
              <span className="text-xs text-olive-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {saveNotice}
              </span>
            )}
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 border border-stone-300 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1">
          <div
            className="bg-olive-700 h-1 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Step Navigator (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold mb-3 px-2">
            Brief Categories ({currentStep}/10)
          </div>
          {STEP_DEFINITIONS.map((s) => {
            const isCurrent = s.id === currentStep;
            const isCompleted = s.id < currentStep;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center gap-2.5 transition-all ${
                  isCurrent
                    ? 'bg-charcoal-900 text-white font-semibold shadow-sm'
                    : isCompleted
                    ? 'text-stone-700 hover:bg-stone-100 font-medium'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isCurrent
                      ? 'bg-olive-500 text-white'
                      : isCompleted
                      ? 'bg-olive-100 text-olive-800'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.id}
                </div>
                <div className="truncate">
                  <div className="truncate leading-tight">{s.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Step Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-card">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-5 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-olive-700 font-bold">
                  Step {currentStep} of 10
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal-950 mt-1">
                  {STEP_DEFINITIONS[currentStep - 1].title}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {STEP_DEFINITIONS[currentStep - 1].desc}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold text-charcoal-900">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            {/* STEP 1: Plot Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Plot Length (Depth) *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="15"
                        max="200"
                        value={formData.plot.length}
                        onChange={(e) => handleDimensionChange('length', Number(e.target.value))}
                        className="w-full text-xs px-3 py-2.5 rounded-l-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                      />
                      <span className="bg-stone-100 border border-l-0 border-stone-300 text-stone-600 text-xs px-3 py-2.5 rounded-r-lg font-mono">
                        ft
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Plot Width (Road Frontage) *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="15"
                        max="200"
                        value={formData.plot.width}
                        onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                        className="w-full text-xs px-3 py-2.5 rounded-l-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                      />
                      <span className="bg-stone-100 border border-l-0 border-stone-300 text-stone-600 text-xs px-3 py-2.5 rounded-r-lg font-mono">
                        ft
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Total Calculated Plot Area
                    </label>
                    <div className="bg-stone-50 border border-stone-200 px-3 py-2 rounded-lg">
                      <div className="font-mono text-sm font-bold text-olive-800">
                        {formData.plot.totalArea.toLocaleString()} sq ft
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        ≈ {(formData.plot.totalArea / 9).toFixed(1)} sq yards (Gaj)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Plot Facing Direction *
                    </label>
                    <select
                      value={formData.plot.facing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plot: { ...formData.plot, facing: e.target.value as any }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-olive-700"
                    >
                      <option value="north">North (Auspicious / Preferred)</option>
                      <option value="east">East (Morning Sun / Auspicious)</option>
                      <option value="west">West (Evening Light)</option>
                      <option value="south">South (Southern Breezes)</option>
                      <option value="north-east">North-East (Ishanya Corner)</option>
                      <option value="north-west">North-West (Vayu Corner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Road Position
                    </label>
                    <select
                      value={formData.plot.roadPosition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plot: { ...formData.plot, roadPosition: e.target.value as any }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-olive-700"
                    >
                      <option value="front">Single Front Road (Standard)</option>
                      <option value="corner">Corner Plot (Road on Front &amp; Side)</option>
                      <option value="two-side">Two-Side Opposite Road Access</option>
                      <option value="cul-de-sac">Cul-de-sac / Dead End</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Plot Shape
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['rectangle', 'square', 'irregular'] as const).map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              plot: { ...formData.plot, shape }
                            })
                          }
                          className={`py-2 text-xs rounded-lg border capitalize transition-all ${
                            formData.plot.shape === shape
                              ? 'border-olive-700 bg-olive-50 text-olive-900 font-bold'
                              : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      City / Municipal Region
                    </label>
                    <input
                      type="text"
                      value={formData.plot.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          plot: { ...formData.plot, city: e.target.value }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-olive-700"
                      placeholder="e.g. Bengaluru, Hyderabad, Pune, Delhi NCR"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Building Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-2">
                    Number of Storeys / Floors *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { val: '1', title: 'Ground Floor Only', desc: 'Single level bungalow' },
                      { val: '2', title: 'Ground + 1 Floor', desc: 'Duplex / Double storey' },
                      { val: '3', title: 'Ground + 2 Floors', desc: 'Triplex / Multi-unit' },
                      { val: 'duplex', title: 'Duplex with Skydeck', desc: 'Modern high-volume' }
                    ].map((f) => (
                      <div
                        key={f.val}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            building: { ...formData.building, floors: f.val as any }
                          })
                        }
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          formData.building.floors === f.val
                            ? 'border-olive-600 bg-olive-50/60 ring-1 ring-olive-600'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-semibold text-xs text-charcoal-900">{f.title}</div>
                        <div className="text-[11px] text-stone-500 mt-1">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Target Built-Up Area (Sq Ft)
                    </label>
                    <input
                      type="number"
                      step="50"
                      value={formData.building.targetBuiltUpArea}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          building: {
                            ...formData.building,
                            targetBuiltUpArea: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Typically 1.4× to 1.8× of plot area for double storey
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Building Typology
                    </label>
                    <select
                      value={formData.building.buildingType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          building: { ...formData.building, buildingType: e.target.value as any }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="duplex">Single Family Duplex</option>
                      <option value="villa">Luxury Standalone Villa</option>
                      <option value="independent">Independent House</option>
                      <option value="rental">Dual Unit / Rental Floor</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.building.futureExpansion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          building: { ...formData.building, futureExpansion: e.target.checked }
                        })
                      }
                      className="rounded accent-olive-700 w-4 h-4"
                    />
                    <span>Structural provision for future rooftop floor addition</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: Rooms & Living */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-2">
                    Total Number of Bedrooms (BHK) *
                  </label>
                  <div className="flex gap-3">
                    {[2, 3, 4, 5].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, bedrooms: count }
                          })
                        }
                        className={`w-14 h-11 rounded-lg border text-sm font-bold transition-all ${
                          formData.rooms.bedrooms === count
                            ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {count} BHK
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-charcoal-800 block">
                      Required Bedroom Types
                    </span>
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rooms.masterBedroom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, masterBedroom: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Master Suite with Walk-in Wardrobe</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rooms.guestRoom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, guestRoom: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Ground-Floor Guest Bedroom (Senior Citizen Friendly)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rooms.kidsRoom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, kidsRoom: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Dedicated Children's Bedroom</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-charcoal-800 block">
                      Living &amp; Common Spaces
                    </span>
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rooms.familyLounge}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, familyLounge: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Upper Floor Family Lounge &amp; TV Den</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rooms.separateDrawingRoom}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rooms: { ...formData.rooms, separateDrawingRoom: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Separate Formal Drawing Room (from daily family zone)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Bathrooms */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Total Bathrooms *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={formData.bathrooms.totalBathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: {
                            ...formData.bathrooms,
                            totalBathrooms: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Ensuite / Attached Bathrooms
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.bathrooms.totalBathrooms}
                      value={formData.bathrooms.attachedBathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: {
                            ...formData.bathrooms,
                            attachedBathrooms: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Common Powder Rooms
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.bathrooms.commonBathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: {
                            ...formData.bathrooms,
                            commonBathrooms: Number(e.target.value)
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <div className="flex items-center gap-2 font-semibold text-charcoal-800 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-olive-600" />
                    <span>Plumbing Duct Zoning</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Bathrooms are stacked along the Western and North-Western shafts to ensure efficient plumbing lines and sound acoustic isolation from primary living areas.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5: Kitchen & Dining */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Kitchen Style
                    </label>
                    <select
                      value={formData.kitchenDining.kitchenType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kitchenDining: {
                            ...formData.kitchenDining,
                            kitchenType: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="semi-open">Semi-Open with Breakfast Counter</option>
                      <option value="closed">Closed / Traditional Indian Kitchen</option>
                      <option value="open">Open Island Concept</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Dining Area Allocation
                    </label>
                    <select
                      value={formData.kitchenDining.diningArea}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kitchenDining: {
                            ...formData.kitchenDining,
                            diningArea: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="integrated">Integrated with Living &amp; Courtyard</option>
                      <option value="dedicated_formal">Dedicated Formal Dining Hall</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.kitchenDining.pantryStore}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kitchenDining: {
                            ...formData.kitchenDining,
                            pantryStore: e.target.checked
                          }
                        })
                      }
                      className="rounded accent-olive-700 w-4 h-4"
                    />
                    <span>Attached Utility / Wet Kitchen / Store Room</span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 6: Outdoor & Parking */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Parking Requirement
                    </label>
                    <select
                      value={formData.outdoorParking.vehicleCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outdoorParking: {
                            ...formData.outdoorParking,
                            vehicleCount: Number(e.target.value),
                            parkingRequired: Number(e.target.value) > 0
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="1">1 Covered Car Portico</option>
                      <option value="2">2 Cars (Double Portico / Tandem)</option>
                      <option value="0">No Dedicated Car Parking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Parking Shade Type
                    </label>
                    <select
                      value={formData.outdoorParking.parkingType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          outdoorParking: {
                            ...formData.outdoorParking,
                            parkingType: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="covered">Solid RCC Slab Covered Portico</option>
                      <option value="open">Pergola / Trellis Shaded</option>
                      <option value="basement">Basement Stilt Parking</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-charcoal-800 block">
                    Outdoor Living Elements
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'balcony', label: 'First Floor Balcony Deck' },
                      { key: 'courtyard', label: 'Central Green Courtyard' },
                      { key: 'terraceRoofAccess', label: 'Open Terrace Access' },
                      { key: 'sitoutVeranda', label: 'Front Entrance Sit-out' },
                      { key: 'gardenLawn', label: 'Front Setback Garden Lawn' }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer p-2 rounded-lg border border-stone-200 bg-stone-50"
                      >
                        <input
                          type="checkbox"
                          checked={(formData.outdoorParking as any)[item.key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              outdoorParking: {
                                ...formData.outdoorParking,
                                [item.key]: e.target.checked
                              }
                            })
                          }
                          className="rounded accent-olive-700 w-4 h-4"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Special Spaces */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fadeIn">
                <p className="text-xs text-stone-500">
                  Select auxiliary spaces you wish to integrate into the architectural plan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'poojaRoom', title: 'Dedicated Pooja Sanctum', desc: 'Auspicious North-East (Ishanya) orientation with mandir platform' },
                    { key: 'homeOffice', title: 'Quiet Home Office / Study', desc: 'Dedicated acoustic space for remote work and library shelving' },
                    { key: 'laundryRoom', title: 'Dedicated Laundry & Linen Room', desc: 'Ventilated utility with washing machine and drying rack' },
                    { key: 'additionalStorage', title: 'Under-Stairs & Box Storage', desc: 'Concealed deep storage space for luggage and festive items' },
                    { key: 'homeGym', title: 'Home Fitness / Yoga Deck', desc: 'Reinforced floor slab for fitness gear with high air circulation' },
                    { key: 'servantRoom', title: 'Domestic Helper Quarter', desc: 'Separate room with private toilet & external entrance access' }
                  ].map((space) => {
                    const isChecked = (formData.specialSpaces as any)[space.key];
                    return (
                      <div
                        key={space.key}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            specialSpaces: {
                              ...formData.specialSpaces,
                              [space.key]: !isChecked
                            }
                          })
                        }
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'border-olive-600 bg-olive-50/60 ring-1 ring-olive-600'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-charcoal-900">
                            {space.title}
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded accent-olive-700 w-4 h-4"
                          />
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                          {space.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 8: Vastu & Style */}
            {currentStep === 8 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Vastu Compliance Level
                    </label>
                    <select
                      value={formData.vastuPreferences.vastuCompliance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vastuPreferences: {
                            ...formData.vastuPreferences,
                            vastuCompliance: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="strict">Strict (100% cardinal quadrant adherence)</option>
                      <option value="moderate">Moderate (Prioritize kitchen &amp; master bedroom)</option>
                      <option value="flexible">Flexible (Modern flow over strict rules)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Architectural Elevation Style
                    </label>
                    <select
                      value={formData.vastuPreferences.architecturalStyle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vastuPreferences: {
                            ...formData.vastuPreferences,
                            architecturalStyle: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="modern">Modern Minimalist (Clean lines &amp; stone)</option>
                      <option value="biophilic">Biophilic Courtyard (Greenery &amp; timber)</option>
                      <option value="contemporary">Contemporary Villa (Cantilevers &amp; glass)</option>
                      <option value="traditional">Modern Vernacular (Sloped terracotta tiles)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                  <div className="font-semibold text-charcoal-800 mb-2">Vastu Cardinal Rules Enforced:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600">
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="font-bold text-olive-800">Kitchen:</span> South-East (Agni Corner)
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="font-bold text-olive-800">Master Suite:</span> South-West (Nairutya)
                    </div>
                    <div className="bg-white p-2 rounded border border-stone-200">
                      <span className="font-bold text-olive-800">Pooja / Entry:</span> North-East (Ishanya)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Utilities & Budget */}
            {currentStep === 9 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Target Construction Budget Range
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={formData.utilities.budgetMin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            utilities: {
                              ...formData.utilities,
                              budgetMin: Number(e.target.value),
                              budgetMax: Number(e.target.value) * 1.25
                            }
                          })
                        }
                        className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="3500000">₹35 Lakhs – ₹45 Lakhs</option>
                        <option value="4500000">₹45 Lakhs – ₹55 Lakhs</option>
                        <option value="6000000">₹60 Lakhs – ₹75 Lakhs</option>
                        <option value="8000000">₹80 Lakhs – ₹1.1 Crore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal-800 mb-1.5">
                      Staircase Architectural Type
                    </label>
                    <select
                      value={formData.utilities.staircaseType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          utilities: {
                            ...formData.utilities,
                            staircaseType: e.target.value as any
                          }
                        })
                      }
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="internal">Dog-legged RCC Internal Staircase</option>
                      <option value="cantilever">Floating Cantilevered Tread with Glass Railing</option>
                      <option value="external">External Dedicated Staircase (For Rental Separation)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-charcoal-800 block">
                    Sustainability &amp; MEP Provisions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.utilities.solarPanelSpace}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            utilities: { ...formData.utilities, solarPanelSpace: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Rooftop Solar PV Conduit &amp; Inverter Space</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.utilities.rainwaterHarvesting}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            utilities: { ...formData.utilities, rainwaterHarvesting: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Rainwater Harvesting &amp; Percolation Recharge Well</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.utilities.provisionLift}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            utilities: { ...formData.utilities, provisionLift: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Future Elevator / Vertical Lift Shaft Core</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg border border-stone-200 bg-stone-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.utilities.smartHomeFeatures}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            utilities: { ...formData.utilities, smartHomeFeatures: e.target.checked }
                          })
                        }
                        className="rounded accent-olive-700 w-4 h-4"
                      />
                      <span>Smart Automation, Smart Locks &amp; CCTV Conduits</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 10: Review & Confirm */}
            {currentStep === 10 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-olive-50/70 border border-olive-200 rounded-xl p-4 text-xs text-olive-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-olive-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-olive-950">
                      Requirements Brief Ready for Architectural Synthesis
                    </span>
                    <p className="text-[11px] text-olive-800 mt-1 leading-relaxed">
                      Review your specifications below. When ready, click "Generate 3 Design Concepts" to produce three alternative spatial arrangements with interactive 2D plans, 3D visualizations, and preliminary cost estimates.
                    </p>
                  </div>
                </div>

                {/* Grouped Review Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Card 1 */}
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="font-semibold text-charcoal-900">Plot &amp; Building</span>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-olive-700 font-semibold hover:underline text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-stone-600 text-[11px]">
                      <div>Dimensions: <span className="font-mono font-medium text-charcoal-900">{formData.plot.length}' × {formData.plot.width}' ({formData.plot.totalArea} sq ft)</span></div>
                      <div>Facing: <span className="font-medium text-charcoal-900 capitalize">{formData.plot.facing}</span> ({formData.plot.roadPosition} road)</div>
                      <div>Floors: <span className="font-medium text-charcoal-900">{formData.building.floors} Storeys ({formData.building.buildingType})</span></div>
                      <div>Location: <span className="font-medium text-charcoal-900">{formData.plot.city}</span></div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="font-semibold text-charcoal-900">Room Allocation</span>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-olive-700 font-semibold hover:underline text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-stone-600 text-[11px]">
                      <div>Configuration: <span className="font-mono font-medium text-charcoal-900">{formData.rooms.bedrooms} BHK</span></div>
                      <div>Bathrooms: <span className="font-mono font-medium text-charcoal-900">{formData.bathrooms.totalBathrooms} Total ({formData.bathrooms.attachedBathrooms} Attached)</span></div>
                      <div>Living &amp; Dining: <span className="font-medium text-charcoal-900 capitalize">{formData.rooms.livingRoomSize} Living, {formData.kitchenDining.diningArea} Dining</span></div>
                      <div>Kitchen: <span className="font-medium text-charcoal-900 capitalize">{formData.kitchenDining.kitchenType}</span></div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="font-semibold text-charcoal-900">Special Spaces &amp; Outdoors</span>
                      <button
                        onClick={() => setCurrentStep(6)}
                        className="text-olive-700 font-semibold hover:underline text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-stone-600 text-[11px]">
                      <div>Pooja Room: <span className="font-medium text-charcoal-900">{formData.specialSpaces.poojaRoom ? 'Yes (North-East)' : 'No'}</span></div>
                      <div>Parking: <span className="font-medium text-charcoal-900">{formData.outdoorParking.vehicleCount} Vehicle ({formData.outdoorParking.parkingType})</span></div>
                      <div>Balcony &amp; Terrace: <span className="font-medium text-charcoal-900">Included</span></div>
                      <div>Courtyard: <span className="font-medium text-charcoal-900">{formData.outdoorParking.courtyard ? 'Internal Lightwell' : 'None'}</span></div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="font-semibold text-charcoal-900">Aesthetics &amp; Budget</span>
                      <button
                        onClick={() => setCurrentStep(8)}
                        className="text-olive-700 font-semibold hover:underline text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-stone-600 text-[11px]">
                      <div>Elevation Style: <span className="font-medium text-charcoal-900 capitalize">{formData.vastuPreferences.architecturalStyle}</span></div>
                      <div>Vastu Compliance: <span className="font-medium text-charcoal-900 capitalize">{formData.vastuPreferences.vastuCompliance}</span></div>
                      <div>Target Budget: <span className="font-mono font-medium text-charcoal-900">₹{(formData.utilities.budgetMin / 100000).toFixed(0)}L – ₹{(formData.utilities.budgetMax / 100000).toFixed(0)}L</span></div>
                      <div>Solar &amp; Rainwater: <span className="font-medium text-charcoal-900">Configured</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Controls */}
            <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAndGenerate}
                  className="px-6 py-2.5 rounded-lg bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold flex items-center gap-2 shadow transition-all hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-olive-200" />
                  <span>Generate 3 Design Concepts</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Generation Simulation Sequence Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-olive-50 border border-olive-200 text-olive-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">
              Forma Spatial Engine
            </h3>
            <p className="text-xs text-stone-600 mt-2 font-mono h-6 transition-all">
              {genStatusText}
            </p>

            <div className="w-full bg-stone-100 rounded-full h-2 mt-6 overflow-hidden">
              <div className="bg-olive-700 h-2 rounded-full w-3/4 animate-pulse" />
            </div>

            <p className="text-[11px] text-stone-400 mt-4 italic">
              Formulating Design A (Biophilic Courtyard), Design B (Contemporary Pavilion), and Design C (Urban Efficient Duplex)...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
