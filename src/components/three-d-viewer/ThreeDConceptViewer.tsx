import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sun, Eye, Layers, Compass, Maximize2, Sparkles, Image as ImageIcon, Box } from 'lucide-react';
import { DesignConcept } from '../../types/design';

interface ThreeDConceptViewerProps {
  design: DesignConcept;
  onNavigateToTab?: (tab: string) => void;
}

type MaterialTheme = 'travertine' | 'concrete' | 'sandstone';
type LightingMode = 'daylight' | 'goldenHour' | 'studio';

export const ThreeDConceptViewer: React.FC<ThreeDConceptViewerProps> = ({
  design,
  onNavigateToTab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [activeMode, setActiveMode] = useState<'3d' | 'render'>('3d');
  const [materialTheme, setMaterialTheme] = useState<MaterialTheme>('travertine');
  const [lightingMode, setLightingMode] = useState<LightingMode>('daylight');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [visibleFloors, setVisibleFloors] = useState<'both' | 'ground' | 'upper'>('both');

  // Three.js Scene Setup
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

    // Subtle Grid Helper
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

    // Color definitions based on materialTheme
    const wallColors = {
      travertine: { wall: 0xF7F4EE, accent: 0xC25E3E, glass: 0x223344, wood: 0x8A4B29 },
      concrete: { wall: 0xDDDCDA, accent: 0x17191C, glass: 0x1B2A38, wood: 0x4A433A },
      sandstone: { wall: 0xEDE8DC, accent: 0x3E5C46, glass: 0x2D4739, wood: 0xA87D52 }
    }[materialTheme];

    // Common column and metal material
    const colMat = new THREE.MeshStandardMaterial({ color: 0x17191C, roughness: 0.3 });

    // Wall Material
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: wallColors.wall,
      roughness: 0.75,
      metalness: 0.05
    });

    // Accent Material
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: wallColors.accent,
      roughness: 0.5,
      metalness: 0.2
    });

    // Timber / Wood Louvers Material
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: wallColors.wood,
      roughness: 0.6,
      metalness: 0.1
    });

    // Glass Material
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

      // Plinth / Foundation Base
      const plinth = new THREE.Mesh(
        new THREE.BoxGeometry(16.5, 0.8, 20.5),
        new THREE.MeshStandardMaterial({ color: 0x4A433A, roughness: 0.9 })
      );
      plinth.position.set(0, 0.4, 0);
      plinth.receiveShadow = true;
      gfGroup.add(plinth);

      // Main Living Volume
      const gfMain = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 14), wallMaterial);
      gfMain.position.set(-2.5, 3.3, 0);
      gfMain.castShadow = true;
      gfMain.receiveShadow = true;
      gfGroup.add(gfMain);

      // Living Room Large Window Glazing
      const gfWindow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.8, 7), glassMaterial);
      gfWindow.position.set(-7.55, 3.3, 0);
      gfGroup.add(gfWindow);

      // Kitchen & Dining Volume
      const gfKitchen = new THREE.Mesh(new THREE.BoxGeometry(6, 4.8, 8), accentMaterial);
      gfKitchen.position.set(5.2, 3.2, -4);
      gfKitchen.castShadow = true;
      gfKitchen.receiveShadow = true;
      gfGroup.add(gfKitchen);

      // Car Portico Canopy Slab
      const porticoSlab = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 10), wallMaterial);
      porticoSlab.position.set(5.2, 4.8, 5);
      porticoSlab.castShadow = true;
      gfGroup.add(porticoSlab);

      // Portico Steel/Timber Columns
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

    // --- First Floor Geometry (Cantilever Modernist) ---
    if (visibleFloors === 'both' || visibleFloors === 'upper') {
      const ffGroup = new THREE.Group();

      // Cantilever Master Suite
      const ffSuite = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 15), wallMaterial);
      ffSuite.position.set(-1.8, 8.2, 0.8);
      ffSuite.castShadow = true;
      ffSuite.receiveShadow = true;
      ffGroup.add(ffSuite);

      // Balcony / Cantilever Deck
      const balcSlab = new THREE.Mesh(new THREE.BoxGeometry(6, 0.35, 6), woodMaterial);
      balcSlab.position.set(4, 5.8, 2);
      balcSlab.castShadow = true;
      ffGroup.add(balcSlab);

      // Glass Balustrade
      const glassRailing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 5.8), glassMaterial);
      glassRailing.position.set(6.95, 6.5, 2);
      ffGroup.add(glassRailing);

      // Architectural Timber Louvers / Jali
      const louverMat = woodMaterial;
      for (let i = 0; i < 7; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.2, 0.3), louverMat);
        louver.position.set(-7.4, 8.2, -3.5 + i * 0.8);
        louver.castShadow = true;
        ffGroup.add(louver);
      }

      // Roof Slab / Pergola Overhang
      const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(14, 0.45, 17), wallMaterial);
      roofSlab.position.set(-0.8, 10.8, 0.8);
      roofSlab.castShadow = true;
      ffGroup.add(roofSlab);

      // Rooftop Pergola Slats
      for (let k = 0; k < 6; k++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 0.15), colMat);
        slat.position.set(3, 11.2, -3 + k * 1.2);
        slat.castShadow = true;
        ffGroup.add(slat);
      }

      houseGroup.add(ffGroup);
    }

    // Interactive Drag to Rotate & Wheel to Zoom
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let spherical = {
      radius: 38,
      theta: Math.PI / 4,
      phi: Math.PI / 3.2
    };

    const updateCameraPos = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 5, 0);
    };
    updateCameraPos();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      prevMousePos = { x: e.clientX, y: e.clientY };

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(16, Math.min(65, spherical.radius + e.deltaY * 0.04));
      updateCameraPos();
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    const animate = () => {
      if (autoRotate && !isDragging) {
        spherical.theta += 0.0025;
        updateCameraPos();
      }
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [activeMode, materialTheme, lightingMode, autoRotate, visibleFloors]);

  return (
    <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden flex flex-col shadow-subtle">
      {/* 3D Toolbar */}
      <div className="bg-white px-4 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Switch 3D Model vs Render View */}
        <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 font-medium">
          <button
            onClick={() => setActiveMode('3d')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeMode === '3d'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Interactive 3D Massing</span>
          </button>
          <button
            onClick={() => setActiveMode('render')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeMode === 'render'
                ? 'bg-charcoal-900 text-white shadow-sm'
                : 'text-stone-600 hover:text-charcoal-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Architectural Concept Photo</span>
          </button>
        </div>

        {activeMode === '3d' && (
          <>
            {/* Material Finishes */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 mr-1 font-medium">Finish:</span>
              <button
                onClick={() => setMaterialTheme('travertine')}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                  materialTheme === 'travertine'
                    ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-700 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Travertine &amp; Teak
              </button>
              <button
                onClick={() => setMaterialTheme('concrete')}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                  materialTheme === 'concrete'
                    ? 'bg-charcoal-900 border-charcoal-900 text-white font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Raw Concrete &amp; Steel
              </button>
              <button
                onClick={() => setMaterialTheme('sandstone')}
                className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                  materialTheme === 'sandstone'
                    ? 'bg-olive-50 border-olive-600 text-olive-800 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Sandstone &amp; Olive
              </button>
            </div>

            {/* Lighting modes */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 mr-1 font-medium">Sunlight:</span>
              <button
                onClick={() => setLightingMode('daylight')}
                className={`p-1.5 rounded border ${
                  lightingMode === 'daylight'
                    ? 'bg-amber-50 border-amber-400 text-amber-700'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                }`}
                title="Bright daylight"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('goldenHour')}
                className={`p-1.5 rounded border ${
                  lightingMode === 'goldenHour'
                    ? 'bg-terracotta-50 border-terracotta-400 text-terracotta-700'
                    : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                }`}
                title="Golden hour / sunset"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rotation toggle */}
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 ml-auto transition-colors ${
                autoRotate
                  ? 'bg-olive-50 border-olive-200 text-olive-800'
                  : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>Orbit 360°</span>
            </button>
          </>
        )}
      </div>

      {/* Main Canvas / Image Viewport */}
      <div className="relative w-full h-[540px] bg-stone-100 flex items-center justify-center overflow-hidden">
        {activeMode === '3d' ? (
          <>
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
            {/* Viewport Overlay Hints */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-stone-200 text-[11px] text-stone-600 shadow-sm pointer-events-none">
              <span className="font-semibold text-charcoal-900">Interactive Controls:</span> Drag to Orbit • Scroll to Zoom • Three.js Architectural Massing
            </div>
            <div className="absolute top-4 right-4 bg-charcoal-900/80 text-white text-[10px] uppercase font-mono px-2.5 py-1 rounded backdrop-blur-sm tracking-wider">
              Concept Massing Model
            </div>
          </>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={design.coverImage}
              alt={design.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Graceful fallback to local backup if external CDN fails
                (e.target as HTMLImageElement).src = design.backupImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white max-w-lg">
              <span className="inline-block bg-terracotta-500 text-white text-[10px] font-semibold uppercase px-2 py-0.5 rounded mb-2">
                {design.architecturalStyle}
              </span>
              <h3 className="font-serif text-2xl font-bold">{design.title}</h3>
              <p className="text-stone-300 text-xs mt-1 leading-relaxed">{design.subtitle}</p>
              <p className="text-stone-400 text-[11px] mt-2 italic">
                *Visual inspiration photograph showing facade styling, material finishes, and volumetric proportions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Concept Architecture Notes Sidebar/Bar */}
      <div className="bg-white p-4 border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="border-r border-stone-100 pr-3">
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">
              Thermal &amp; Massing Strategy
            </span>
            <p className="font-medium text-charcoal-800 mt-1">
              Upper floor cantilever shades ground-floor glazing, reducing radiant heat gain by ~22%.
            </p>
          </div>
          <div className="border-r border-stone-100 pr-3">
            <span className="text-stone-400 uppercase font-mono tracking-wider text-[10px]">
              Material Specification
            </span>
            <p className="font-medium text-charcoal-800 mt-1">
              {materialTheme === 'travertine'
                ? 'Honed travertine stone cladding with sustainably sourced teak louvers.'
                : materialTheme === 'concrete'
                ? 'Cast-in-place fair-faced concrete with textured charcoal aluminum panels.'
                : 'Dholpur sandstone with warm olive lime-wash textured render.'}
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
                Discuss Changes with AI →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
