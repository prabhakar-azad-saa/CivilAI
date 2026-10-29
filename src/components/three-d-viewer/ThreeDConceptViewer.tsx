import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Sun,
  Eye,
  Layers,
  Compass,
  Maximize2,
  Sparkles,
  Image as ImageIcon,
  Box,
  Upload,
  Plus,
  CheckCircle2,
  Columns,
  Grid,
  Info,
  X,
  Share2,
  ZoomIn,
  Home
} from 'lucide-react';
import { DesignConcept, RenderImageItem } from '../../types/design';
import { SplitSyncViewer } from './SplitSyncViewer';
import { AddImageModal } from './AddImageModal';
import { PlanTo3DConverterModal } from './PlanTo3DConverterModal';
import { MockDesignService } from '../../services/mockDesignService';

interface ThreeDConceptViewerProps {
  design: DesignConcept;
  onNavigateToTab?: (tab: string) => void;
  onDesignUpdated?: (updated: DesignConcept) => void;
}

type ViewerMode = 'cutaway' | 'split' | '3d' | 'render' | 'gallery';
type MaterialTheme = 'travertine' | 'concrete' | 'sandstone';
type LightingMode = 'daylight' | 'goldenHour' | 'studio';

interface RoomHotspot {
  id: string;
  name: string;
  category: 'bedroom' | 'kitchen' | 'living' | 'dining' | 'bath' | 'balcony';
  xPercent: number; // coordinates on cutaway image
  yPercent: number;
  dimensions: string;
  vastuZone: string;
  specs: string;
}

export const ThreeDConceptViewer: React.FC<ThreeDConceptViewerProps> = ({
  design,
  onNavigateToTab,
  onDesignUpdated
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Active view mode - default to 'cutaway' as requested by the user
  const [activeMode, setActiveMode] = useState<ViewerMode>('cutaway');
  const [materialTheme, setMaterialTheme] = useState<MaterialTheme>('travertine');
  const [lightingMode, setLightingMode] = useState<LightingMode>('daylight');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [visibleFloors, setVisibleFloors] = useState<'both' | 'ground' | 'upper'>('both');

  // Modals state
  const [isAddImageOpen, setIsAddImageOpen] = useState(false);
  const [isUpload2DOpen, setIsUpload2DOpen] = useState(false);
  const [isFullscreenZoomOpen, setIsFullscreenZoomOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<RoomHotspot | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [activeGalleryPreview, setActiveGalleryPreview] = useState<RenderImageItem | null>(null);

  // Fallback / cutaway images
  const cutawayImgSrc = design.isometricCutawayImage || '/renders/concept-a-cutaway.jpg';
  const splitSyncImgSrc = design.splitSyncImage || '/renders/concept-a-split.png';
  const blueprintImgSrc = design.blueprint2dImage || '/renders/sample-2d-cad.jpg';

  // Interactive Room Pins on the 3D Cutaway Top View
  const roomHotspots: RoomHotspot[] = [
    {
      id: 'hs-1',
      name: 'Master Bedroom Suite',
      category: 'bedroom',
      xPercent: 27,
      yPercent: 57,
      dimensions: "16'6\" × 14'0\"",
      vastuZone: 'South-West (Nairutya)',
      specs: 'Plush king-size double bed, wooden laminate flooring, integrated dresser & ensuite master bath.'
    },
    {
      id: 'hs-2',
      name: 'Island Modular Kitchen',
      category: 'kitchen',
      xPercent: 62,
      yPercent: 37,
      dimensions: "14'0\" × 11'0\"",
      vastuZone: 'South-East (Agni)',
      specs: 'Modern breakfast island with barstools, built-in induction & chimney, acrylic cabinets & wet utility.'
    },
    {
      id: 'hs-3',
      name: 'Living Lounge & Entertainment',
      category: 'living',
      xPercent: 41,
      yPercent: 64,
      dimensions: "18'0\" × 14'6\"",
      vastuZone: 'North-East (Ishanya)',
      specs: 'Low-profile sectional sofa, designer coffee table, wall-mounted media console, warm cove illumination.'
    },
    {
      id: 'hs-4',
      name: 'Formal Dining Core',
      category: 'dining',
      xPercent: 49,
      yPercent: 44,
      dimensions: "14'0\" × 12'0\"",
      vastuZone: 'East',
      specs: '6-seater wooden dining table adjacent to kitchen island and central courtyard breeze.'
    },
    {
      id: 'hs-5',
      name: 'Secondary Bedroom (Guest/Kids)',
      category: 'bedroom',
      xPercent: 44,
      yPercent: 23,
      dimensions: "13'0\" × 12'0\"",
      vastuZone: 'North-West (Vayu)',
      specs: 'Queen-size bed with study desk, full-height wardrobe, and acoustic double-glazed windows.'
    },
    {
      id: 'hs-6',
      name: 'Outdoor Balcony & Green Terrace',
      category: 'balcony',
      xPercent: 82,
      yPercent: 48,
      dimensions: "14'0\" × 6'0\"",
      vastuZone: 'East / Open Sky',
      specs: 'Weatherproof timber deck tiles, glass balustrade, biophilic potted planters & evening sit-out chairs.'
    },
    {
      id: 'hs-7',
      name: 'Master Ensuite & Powder Room',
      category: 'bath',
      xPercent: 28,
      yPercent: 33,
      dimensions: "8'6\" × 6'0\"",
      vastuZone: 'West',
      specs: 'Toughened glass rain shower partition, wall-hung WC, backlit LED vanity mirror & anti-skid porcelain.'
    }
  ];

  // Add custom image to gallery
  const handleAddImage = async (item: RenderImageItem) => {
    try {
      const updated = await MockDesignService.addImageToGallery(design.id, item);
      if (onDesignUpdated) {
        onDesignUpdated(updated);
      }
    } catch (e) {
      console.error('Failed to add image to gallery', e);
    }
  };

  // Three.js Scene Setup (Only when mode is '3d')
  useEffect(() => {
    if (activeMode !== '3d' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(lightingMode === 'goldenHour' ? 0xF8EFEA : 0xF5F2EB);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(28, 22, 28);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(
      lightingMode === 'goldenHour' ? 0xFFE0C2 : 0xFFFFFF,
      lightingMode === 'goldenHour' ? 0.7 : 0.6
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      lightingMode === 'goldenHour' ? 0xFF9E54 : 0xFFFFFF,
      lightingMode === 'goldenHour' ? 1.4 : 1.1
    );
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xFDFBF7, 0x8F8576, 0.4);
    scene.add(hemiLight);

    // 5. Ground / Plot Plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xEAE5DC,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(50, 25, 0xB8AF9F, 0xDCD5C7);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Lawn Patch
    const lawnGeo = new THREE.PlaneGeometry(28, 36);
    const lawnMat = new THREE.MeshStandardMaterial({
      color: 0x486B50,
      roughness: 0.8
    });
    const lawn = new THREE.Mesh(lawnGeo, lawnMat);
    lawn.rotation.x = -Math.PI / 2;
    lawn.position.set(-2, 0.05, 0);
    lawn.receiveShadow = true;
    scene.add(lawn);

    // 6. House Geometry Group
    const houseGroup = new THREE.Group();
    houseGroupRef.current = houseGroup;
    scene.add(houseGroup);

    const wallColors = {
      travertine: { wall: 0xF7F4EE, accent: 0xC25E3E, glass: 0x223344, wood: 0x8A4B29 },
      concrete: { wall: 0xDDDCDA, accent: 0x17191C, glass: 0x1B2A38, wood: 0x4A433A },
      sandstone: { wall: 0xEDE8DC, accent: 0x3E5C46, glass: 0x2D4739, wood: 0xA87D52 }
    }[materialTheme];

    const colMat = new THREE.MeshStandardMaterial({ color: 0x17191C, roughness: 0.3 });
    const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColors.wall, roughness: 0.75, metalness: 0.05 });
    const accentMaterial = new THREE.MeshStandardMaterial({ color: wallColors.accent, roughness: 0.5, metalness: 0.2 });
    const woodMaterial = new THREE.MeshStandardMaterial({ color: wallColors.wood, roughness: 0.6, metalness: 0.1 });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: wallColors.glass,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65
    });

    // --- Ground Floor Geometry ---
    if (visibleFloors === 'both' || visibleFloors === 'ground') {
      const gfGroup = new THREE.Group();
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.8, 20.5), new THREE.MeshStandardMaterial({ color: 0x4A433A, roughness: 0.9 }));
      plinth.position.set(0, 0.4, 0);
      plinth.receiveShadow = true;
      gfGroup.add(plinth);

      const gfMain = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 14), wallMaterial);
      gfMain.position.set(-2.5, 3.3, 0);
      gfMain.castShadow = true;
      gfMain.receiveShadow = true;
      gfGroup.add(gfMain);

      const gfWindow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.8, 7), glassMaterial);
      gfWindow.position.set(-7.55, 3.3, 0);
      gfGroup.add(gfWindow);

      const gfKitchen = new THREE.Mesh(new THREE.BoxGeometry(6, 4.8, 8), accentMaterial);
      gfKitchen.position.set(5.2, 3.2, -4);
      gfKitchen.castShadow = true;
      gfKitchen.receiveShadow = true;
      gfGroup.add(gfKitchen);

      const porticoSlab = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 10), wallMaterial);
      porticoSlab.position.set(5.2, 4.8, 5);
      porticoSlab.castShadow = true;
      gfGroup.add(porticoSlab);

      const col1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.4), colMat);
      col1.position.set(8.2, 2.4, 9.6);
      col1.castShadow = true;
      gfGroup.add(col1);

      const col2 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.4), colMat);
      col2.position.set(2.2, 2.4, 9.6);
      col2.castShadow = true;
      gfGroup.add(col2);

      houseGroup.add(gfGroup);
    }

    // --- First Floor Geometry ---
    if (visibleFloors === 'both' || visibleFloors === 'upper') {
      const ffGroup = new THREE.Group();
      const ffSuite = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 15), wallMaterial);
      ffSuite.position.set(-1.8, 8.2, 0.8);
      ffSuite.castShadow = true;
      ffSuite.receiveShadow = true;
      ffGroup.add(ffSuite);

      const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(6, 0.35, 6), woodMaterial);
      balcSlab.position.set(4, 5.8, 2);
      balcSlab.castShadow = true;
      ffGroup.add(balcSlab);

      const glassRailing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 5.8), glassMaterial);
      glassRailing.position.set(6.95, 6.5, 2);
      ffGroup.add(glassRailing);

      for (let i = 0; i < 7; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.2, 0.2), woodMaterial);
        slat.position.set(-7.4, 8.2, -4 + i * 1.3);
        slat.castShadow = true;
        ffGroup.add(slat);
      }

      // Roof Slab Overhang
      const roof = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.5, 17.5), wallMaterial);
      roof.position.set(-1.5, 10.8, 0.8);
      roof.castShadow = true;
      ffGroup.add(roof);

      for (let j = 0; j < 5; j++) {
        const pergolaBeam = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.25, 0.2), colMat);
        pergolaBeam.position.set(3.5, 11, -3 + j * 1.6);
        pergolaBeam.castShadow = true;
        ffGroup.add(pergolaBeam);
      }

      houseGroup.add(ffGroup);
    }

    // Orbit Animation Loop
    let angle = 0.8;
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (autoRotate && houseGroupRef.current) {
        angle += 0.003;
        const radius = 38;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 4.5, 0);
      }
      renderer.render(scene, camera);
    };
    animate();

    // Mouse drag interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      angle -= deltaX * 0.008;
      const radius = 38;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = Math.max(8, Math.min(45, camera.position.y + deltaY * 0.1));
      camera.lookAt(0, 4.5, 0);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [activeMode, materialTheme, lightingMode, autoRotate, visibleFloors]);

  // Gallery items combining design's renderGallery + base images
  const allGalleryItems: RenderImageItem[] = design.renderGallery || [
    {
      id: 'g-1',
      title: '3D Isometric Cutaway Top View',
      category: '3d-cutaway',
      url: cutawayImgSrc,
      caption: 'Detailed 3D cutaway showing bedroom, island kitchen, living room, and balcony top view.'
    },
    {
      id: 'g-2',
      title: 'Split-Screen 2D Blueprint + 3D BIM Sync',
      category: 'split-sync',
      url: splitSyncImgSrc,
      caption: 'Side-by-side CAD drawing and photorealistic 3D villa elevation.'
    },
    {
      id: 'g-3',
      title: 'Technical 2D CAD Floor Plan',
      category: '2d-blueprint',
      url: blueprintImgSrc,
      caption: 'CAD architectural layout with dimension lines and room boundaries.'
    },
    {
      id: 'g-4',
      title: 'Architectural Exterior Elevation',
      category: 'exterior-3d',
      url: design.coverImage,
      caption: 'Photorealistic exterior villa view.'
    }
  ];

  const filteredGallery = galleryFilter === 'all'
    ? allGalleryItems
    : allGalleryItems.filter((item) => item.category === galleryFilter);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-card flex flex-col">
      {/* Top Studio Control Bar */}
      <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-xs font-medium shadow-sm">
          <button
            onClick={() => setActiveMode('cutaway')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'cutaway'
                ? 'bg-charcoal-900 text-white font-bold shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>HD 3D Cutaway Top View</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-700">
              HD
            </span>
          </button>

          <button
            onClick={() => setActiveMode('split')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'split'
                ? 'bg-charcoal-900 text-white font-bold shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-blue-400" />
            <span>Split 2D + 3D Sync</span>
          </button>

          <button
            onClick={() => setActiveMode('3d')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === '3d'
                ? 'bg-charcoal-900 text-white font-bold shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-emerald-400" />
            <span>Three.js Massing Orbit</span>
          </button>

          <button
            onClick={() => setActiveMode('render')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'render'
                ? 'bg-charcoal-900 text-white font-bold shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Exterior Elevation</span>
          </button>

          <button
            onClick={() => setActiveMode('gallery')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeMode === 'gallery'
                ? 'bg-charcoal-900 text-white font-bold shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-terracotta-500" />
            <span>All Multi-Images ({allGalleryItems.length})</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI 2D-to-3D Synthesis Button */}
          <button
            onClick={() => setIsUpload2DOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            title="Upload your own 2D CAD blueprint and let AI convert it to 3D"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Upload 2D Plan → AI 3D</span>
          </button>

          {/* Add / Upload Images Button */}
          <button
            onClick={() => setIsAddImageOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-olive-700" />
            <span>Add Images</span>
          </button>
        </div>
      </div>

      {/* ================= VIEWPORT BODY ================= */}
      <div className="relative w-full bg-stone-900 min-h-[540px]">
        {/* ================= 1. HD 3D CUTAWAY TOP VIEW ================= */}
        {activeMode === 'cutaway' && (
          <div className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center overflow-hidden bg-stone-950">
            {/* Background Cutaway Image */}
            <img
              src={cutawayImgSrc}
              alt="3D Cutaway Floor Plan"
              className="max-w-full max-h-full object-contain cursor-zoom-in"
              onClick={() => setIsFullscreenZoomOpen(true)}
            />

            {/* Viewport Overlay Tag */}
            <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-700 text-white text-xs font-mono flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>HD 3D Cutaway Top-Down Interior Plan</span>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={() => setIsFullscreenZoomOpen(true)}
                className="bg-black/80 hover:bg-black text-white px-3 py-1.5 rounded-lg border border-stone-700 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all"
              >
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Zoom &amp; Inspect HD</span>
              </button>
            </div>

            {/* Interactive Hotspot Pins on the 3D Cutaway */}
            {roomHotspots.map((hotspot) => {
              const isSelected = selectedHotspot?.id === hotspot.id;
              return (
                <div
                  key={hotspot.id}
                  style={{ left: `${hotspot.xPercent}%`, top: `${hotspot.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  {/* Pin Dot with Pulse Effect */}
                  <button
                    onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xl border-2 transition-transform duration-200 ${
                      isSelected
                        ? 'bg-amber-400 text-charcoal-950 border-white scale-125 ring-4 ring-amber-400/30'
                        : 'bg-charcoal-900/90 text-white border-amber-400 hover:scale-110'
                    }`}
                  >
                    ✦
                  </button>

                  {/* Hover / Active Tooltip Card */}
                  <div
                    className={`absolute bottom-9 left-1/2 -translate-x-1/2 w-64 bg-charcoal-950/95 text-white p-3 rounded-xl border border-stone-700 shadow-2xl backdrop-blur-md pointer-events-auto transition-all ${
                      isSelected ? 'opacity-100 visible z-30' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible z-20'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 mb-1.5">
                      <span className="font-bold text-xs text-amber-300">
                        {hotspot.name}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400">
                        {hotspot.dimensions}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-300 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>Vastu Zone:</span>
                        <span className="text-emerald-400 font-semibold">{hotspot.vastuZone}</span>
                      </div>
                      <p className="text-[10px] leading-relaxed text-stone-300 mt-1">
                        {hotspot.specs}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bottom Floating Legend / Quick Room Selector */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-stone-800 text-xs">
              <div className="flex items-center gap-1.5 text-stone-300 text-[11px]">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">Click room pins to inspect top-down interior details:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {roomHotspots.slice(0, 5).map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => setSelectedHotspot(selectedHotspot?.id === hs.id ? null : hs)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                      selectedHotspot?.id === hs.id
                        ? 'bg-amber-400 text-charcoal-950 border-amber-300 font-bold'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {hs.name.split(' ')[0]} {hs.name.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. SPLIT 2D + 3D SYNC ================= */}
        {activeMode === 'split' && (
          <SplitSyncViewer
            design={design}
            onOpenUpload2D={() => setIsUpload2DOpen(true)}
          />
        )}

        {/* ================= 3. THREE.JS 3D MASSING ================= */}
        {activeMode === '3d' && (
          <div className="relative w-full h-[540px] sm:h-[600px] flex items-center justify-center overflow-hidden bg-stone-100">
            {/* Top Toolbar inside 3D viewer */}
            <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-200 text-xs shadow-sm">
              <span className="text-stone-500 font-medium px-2">Finish:</span>
              <button
                onClick={() => setMaterialTheme('travertine')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  materialTheme === 'travertine'
                    ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-700 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Travertine &amp; Teak
              </button>
              <button
                onClick={() => setMaterialTheme('concrete')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  materialTheme === 'concrete'
                    ? 'bg-charcoal-900 border-charcoal-900 text-white font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Raw Concrete
              </button>
              <button
                onClick={() => setMaterialTheme('sandstone')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  materialTheme === 'sandstone'
                    ? 'bg-olive-50 border-olive-600 text-olive-800 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}
              >
                Sandstone
              </button>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
                  autoRotate
                    ? 'bg-olive-700 text-white border-olive-700'
                    : 'bg-white/90 backdrop-blur-md border-stone-300 text-stone-700'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>Orbit 360°</span>
              </button>
            </div>

            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-stone-200 text-[11px] text-stone-600 shadow-sm pointer-events-none">
              <span className="font-semibold text-charcoal-900">Interactive Controls:</span> Drag mouse to rotate • Scroll to zoom • Three.js Architectural Massing
            </div>
          </div>
        )}

        {/* ================= 4. EXTERIOR ELEVATION ================= */}
        {activeMode === 'render' && (
          <div className="relative w-full h-[540px] sm:h-[600px] bg-stone-900">
            <img
              src={design.coverImage}
              alt={design.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = design.backupImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white max-w-lg">
              <span className="inline-block bg-olive-700 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded mb-2">
                {design.architecturalStyle}
              </span>
              <h3 className="font-serif text-2xl font-bold">{design.title}</h3>
              <p className="text-stone-300 text-xs mt-1 leading-relaxed">{design.subtitle}</p>
              <p className="text-stone-400 text-[11px] mt-2 italic">
                *Photorealistic architectural elevation showing facade glazing, cantilever pergola, and exterior landscape.
              </p>
            </div>
          </div>
        )}

        {/* ================= 5. ALL MULTI-IMAGES GALLERY ================= */}
        {activeMode === 'gallery' && (
          <div className="p-6 bg-stone-50 min-h-[540px] space-y-4">
            {/* Filter pills & Add Image CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Images' },
                  { id: '3d-cutaway', label: '🏠 3D Cutaways' },
                  { id: 'split-sync', label: '🔀 Split 2D+3D' },
                  { id: '2d-blueprint', label: '📐 2D CAD' },
                  { id: 'exterior-3d', label: '🏡 Facade' },
                  { id: 'interior', label: '🛋️ Interior' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGalleryFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      galleryFilter === f.id
                        ? 'bg-charcoal-900 text-white border-charcoal-900 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddImageOpen(true)}
                className="px-4 py-1.5 rounded-lg bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Upload New Image</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveGalleryPreview(item)}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-subtle hover:shadow-card transition-all cursor-pointer group flex flex-col"
                >
                  <div className="h-48 bg-stone-900 overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-charcoal-950/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      {item.category.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-xs font-bold text-charcoal-900 group-hover:text-olive-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                    {item.roomTags && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {item.roomTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-stone-100 text-stone-600 border border-stone-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Upload Drop Card placeholder in grid */}
              <button
                onClick={() => setIsAddImageOpen(true)}
                className="rounded-xl border-2 border-dashed border-stone-300 hover:border-olive-600 p-6 flex flex-col items-center justify-center text-center bg-white/50 hover:bg-olive-50/20 transition-all min-h-[220px]"
              >
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-olive-700" />
                </div>
                <span className="text-xs font-bold text-charcoal-900">Add Another Image</span>
                <span className="text-[11px] text-stone-400 mt-0.5">
                  Attach more floor plan angles or interior renders
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Architectural Notes & Quick Nav */}
      <div className="bg-white p-4 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="border-r border-stone-100 pr-3">
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">
              Top Cutaway Spatial Quality
            </span>
            <p className="font-medium text-charcoal-800 mt-1">
              Furnished top-down cutaway shows full bedroom wardrobes, kitchen counter clearance, and living circulation.
            </p>
          </div>
          <div className="border-r border-stone-100 pr-3">
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">
              2D to 3D CAD Alignment
            </span>
            <p className="font-medium text-charcoal-800 mt-1">
              Synchronized column grids ensure structural compliance between 2D drawings and 3D elevation.
            </p>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">
              Next Planning Steps
            </span>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onNavigateToTab?.('plan')}
                className="text-olive-700 font-semibold hover:underline"
              >
                Inspect 2D Floor Plan →
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => onNavigateToTab?.('chat')}
                className="text-terracotta-600 font-semibold hover:underline"
              >
                Discuss with AI →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* 1. Add Image Modal */}
      <AddImageModal
        isOpen={isAddImageOpen}
        onClose={() => setIsAddImageOpen(false)}
        onAddImage={handleAddImage}
        conceptTitle={design.title}
      />

      {/* 2. Upload 2D Blueprint -> Convert to 3D Modal */}
      <PlanTo3DConverterModal
        isOpen={isUpload2DOpen}
        onClose={() => setIsUpload2DOpen(false)}
        projectId={design.projectId}
        onDesignCreated={(newDesign) => {
          if (onDesignUpdated) {
            onDesignUpdated(newDesign);
          }
          setActiveMode('cutaway');
        }}
      />

      {/* 3. Fullscreen Zoom Modal for HD Cutaway */}
      {isFullscreenZoomOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/95 flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-charcoal-950 font-bold text-xs">
                HD Zoom
              </span>
              <h3 className="font-serif text-base font-bold">
                {design.title} — High-Resolution 3D Cutaway Top View
              </h3>
            </div>
            <button
              onClick={() => setIsFullscreenZoomOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={cutawayImgSrc}
              alt="Full Cutaway View"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* 4. Single Gallery Item Preview Modal */}
      {activeGalleryPreview && (
        <div className="fixed inset-0 z-50 bg-charcoal-950/90 flex flex-col p-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-white">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase">
                {activeGalleryPreview.category}
              </span>
              <h3 className="font-serif text-base font-bold">
                {activeGalleryPreview.title}
              </h3>
            </div>
            <button
              onClick={() => setActiveGalleryPreview(null)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={activeGalleryPreview.url}
              alt={activeGalleryPreview.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
          <div className="p-3 bg-stone-900 border-t border-stone-800 text-center text-xs text-stone-300">
            {activeGalleryPreview.caption}
          </div>
        </div>
      )}
    </div>
  );
};
