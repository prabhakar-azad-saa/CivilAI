import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Box,
  MessageSquare,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Eye,
  Sliders,
  Maximize2
} from 'lucide-react';
import { NewProjectModal } from './NewProjectModal';

export const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'villa' | 'duplex' | 'courtyard'>('all');

  const galleryItems = [
    {
      id: 1,
      title: 'The Courtyard Sanctuary',
      category: 'courtyard',
      tag: 'Modern Biophilic',
      plot: '40 × 60 ft',
      area: '2,800 sq ft',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Pavilion Modernist Villa',
      category: 'villa',
      tag: 'Cantilever Glazed',
      plot: '50 × 80 ft',
      area: '4,200 sq ft',
      location: 'Bengaluru',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Urban Linear Duplex',
      category: 'duplex',
      tag: 'Space Optimized',
      plot: '30 × 40 ft',
      area: '1,850 sq ft',
      location: 'Pune',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Minimalist Stone Residence',
      category: 'villa',
      tag: 'Exaggerated Minimal',
      plot: '35 × 50 ft',
      area: '2,200 sq ft',
      location: 'Ahmedabad',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredGallery =
    activeGalleryTab === 'all'
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeGalleryTab);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-olive-100 border border-olive-200 text-olive-900 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 text-olive-700" />
                <span>Next-Generation Architectural Workspace</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-950 leading-[1.12]">
                Your plot. Your ideas. A home designed around you.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Turn your land dimensions and everyday needs into three thoughtfully planned home concepts. Compare designs, refine your favourite through natural conversation, and prepare your next steps in one workspace.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-sm font-semibold shadow-elevated flex items-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>Start Designing</span>
                  <ArrowRight className="w-4 h-4 text-olive-300" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-charcoal-900 text-sm font-semibold transition-colors"
                >
                  Explore the Process
                </a>
              </div>

              {/* Trust Specs */}
              <div className="pt-8 border-t border-stone-200 grid grid-cols-3 gap-6 text-left">
                <div>
                  <div className="font-serif text-2xl font-bold text-charcoal-950">3 Distinct</div>
                  <div className="text-xs text-stone-500 mt-0.5">Alternative Typologies</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-charcoal-950">100% Vastu</div>
                  <div className="text-xs text-stone-500 mt-0.5">Cardinal Zone Verification</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-charcoal-950">Vector CAD</div>
                  <div className="text-xs text-stone-500 mt-0.5">2D Floor Plan SVG Export</div>
                </div>
              </div>
            </div>

            {/* Right Architectural Visual Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern Courtyard Residence"
                  className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent"></div>

                {/* Floating Architectural Spec Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white/60 shadow-lg text-xs space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-stone-500 uppercase">
                    <span>Bengaluru • 30 × 40 ft Plot</span>
                    <span className="text-olive-700 font-bold">Concept 01 Ready</span>
                  </div>
                  <div className="font-serif text-base font-bold text-charcoal-950">
                    The Courtyard Sanctuary
                  </div>
                  <div className="flex items-center justify-between text-stone-600 font-mono text-[11px] pt-1 border-t border-stone-100">
                    <span>1,850 sq ft • 3 BHK</span>
                    <span className="font-bold text-olive-800">Est: ₹40.5L – ₹46.5L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP PROCESS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-olive-800 font-bold">
              Streamlined Architectural Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mt-1">
              From Plot Dimensions to Preliminary Blueprint in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              No generic templates. Forma uses your precise boundaries, cardinal orientation, and room brief.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 relative space-y-4 hover:border-stone-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-charcoal-900 text-white font-mono font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Describe Your Plot &amp; Brief
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Input your plot dimensions (e.g. 30×40 ft), road frontage, road position, number of floors, bedrooms, and Vastu compliance preferences across 10 structured categories.
              </p>
              <div className="text-[11px] font-mono text-olive-800 font-semibold pt-2">
                10-Step Requirements Wizard →
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 relative space-y-4 hover:border-stone-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-olive-700 text-white font-mono font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Explore 3 Distinct Concepts
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive three alternative spatial typologies: Biophilic Courtyard, Modernist Pavilion, and Efficient Urban Duplex. Compare room schedules, daylight access, and preliminary civil estimates side by side.
              </p>
              <div className="text-[11px] font-mono text-olive-800 font-semibold pt-2">
                Side-by-Side Typology Matrix →
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 relative space-y-4 hover:border-stone-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-terracotta-600 text-white font-mono font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900">
                Refine, Visualize &amp; Export
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chat with the AI assistant to enlarge rooms or add balconies. Review interactive 2D vector plans and 3D massing models. Download SVG drawings and project JSON packages.
              </p>
              <div className="text-[11px] font-mono text-olive-800 font-semibold pt-2">
                Vector CAD &amp; Full Dossier →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT CAPABILITIES SECTION */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-olive-800 font-bold">
              Engineering Workspace
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mt-1">
              Purpose-Built for Residential Architectural Planning
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Everything required to explore feasibility before hiring civil contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Vector 2D CAD Floor Plans
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Genuine SVG drawings with wall cutlines, door swings, dimension lines, and room area schedules. Multi-floor toggle and direct SVG download.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Interactive 3D Massing Viewer
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Explore volumetric cantilevers, daylight sun angles, and material finishes (Travertine, Concrete, Sandstone) using real Three.js rendering.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Conversational AI Refinement
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Say "Make living room larger" or "Add pooja room". Watch spatial schedules, budget models, and revision numbers automatically recalculate.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Preliminary Cost Estimator
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dynamic cost models based on local rate tiers (Basic, Standard, Premium, Luxury) with itemized allowances for modular woodwork, smart home, and solar.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Vastu Shastra Optimization
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Automated zoning compliance tracking for North entrance, Agni (SE) kitchen, and Nairutya (SW) master suite with visible compass overlays.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-subtle space-y-3">
              <div className="w-9 h-9 rounded-lg bg-olive-50 text-olive-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-base font-bold text-charcoal-900">
                Complete Export Dossier
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Download high-resolution SVG plans, export structured JSON specifications, and generate print-ready architectural proposals for family or lenders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN GALLERY SECTION */}
      <section id="gallery" className="py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-olive-800 font-bold">
                Portfolio Inspiration
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mt-1">
                Recent Architectural Concept Studies
              </h2>
            </div>

            {/* Gallery Filters */}
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200 text-xs font-medium">
              {(['all', 'courtyard', 'villa', 'duplex'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGalleryTab(tab)}
                  className={`px-3 py-1.5 rounded-md capitalize transition-all ${
                    activeGalleryTab === tab
                      ? 'bg-charcoal-900 text-white shadow-sm'
                      : 'text-stone-600 hover:text-charcoal-900'
                  }`}
                >
                  {tab === 'all' ? 'All Typologies' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-card group hover:shadow-elevated transition-all"
              >
                <div className="relative h-52 overflow-hidden bg-stone-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 text-charcoal-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.tag}
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] font-mono text-stone-400 block uppercase">
                    {item.location} • {item.plot}
                  </span>
                  <h4 className="font-serif text-base font-bold text-charcoal-900 leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-600 pt-2 border-t border-stone-200">
                    <span>{item.area}</span>
                    <Link
                      to="/projects"
                      className="text-olive-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      View in Studio <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING & TIERS SECTION (Transparent POC Information) */}
      <section id="pricing" className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-olive-800 font-bold">
              Transparent Framework
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-950 mt-1">
              Architectural Concept Studio Packages
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Every package includes vector SVG floor plans, 3D massing, and preliminary civil estimates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-subtle space-y-4">
              <span className="text-xs font-mono uppercase text-stone-400 font-bold">Explorer</span>
              <div className="font-serif text-3xl font-bold text-charcoal-900">Free</div>
              <p className="text-xs text-stone-600">Ideal for initial plot feasibility &amp; family discussion.</p>
              <ul className="space-y-2 text-xs text-stone-700 pt-4 border-t border-stone-100">
                <li className="flex items-center gap-2">✓ 1 Active Residence Project</li>
                <li className="flex items-center gap-2">✓ 3 Alternative Typologies</li>
                <li className="flex items-center gap-2">✓ Interactive 2D Floor Plan SVG</li>
                <li className="flex items-center gap-2">✓ Preliminary Civil Cost Model</li>
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-charcoal-900 hover:bg-stone-50"
              >
                Start Free Project
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="bg-charcoal-900 text-white p-8 rounded-2xl border border-charcoal-800 shadow-elevated space-y-4 relative">
              <div className="absolute top-4 right-4 bg-olive-600 text-white text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">
                Most Popular
              </div>
              <span className="text-xs font-mono uppercase text-stone-400 font-bold">Professional Design</span>
              <div className="font-serif text-3xl font-bold text-white">₹4,999</div>
              <p className="text-xs text-stone-300">Complete AI refinement, Three.js 3D model, and unlimited revisions.</p>
              <ul className="space-y-2 text-xs text-stone-300 pt-4 border-t border-charcoal-800">
                <li className="flex items-center gap-2">✓ Unlimited AI Conversational Refinements</li>
                <li className="flex items-center gap-2">✓ Interactive Three.js 3D Model with Materials</li>
                <li className="flex items-center gap-2">✓ High-Res Vector SVG &amp; JSON Spec Export</li>
                <li className="flex items-center gap-2">✓ Vastu Shastra Cardinal Grid Report</li>
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 rounded-lg bg-olive-600 hover:bg-olive-500 text-white text-xs font-semibold shadow"
              >
                Start Professional Plan
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-subtle space-y-4">
              <span className="text-xs font-mono uppercase text-stone-400 font-bold">Civil Vetted</span>
              <div className="font-serif text-3xl font-bold text-charcoal-900">Custom</div>
              <p className="text-xs text-stone-600">Human structural engineer vetting &amp; sanction drawings.</p>
              <ul className="space-y-2 text-xs text-stone-700 pt-4 border-t border-stone-100">
                <li className="flex items-center gap-2">✓ Everything in Professional</li>
                <li className="flex items-center gap-2">✓ Structural Load &amp; Column Schedule Vetting</li>
                <li className="flex items-center gap-2">✓ Municipal Sanction Drawing Submission</li>
                <li className="flex items-center gap-2">✓ Licensed Civil Engineer Sign-off</li>
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 rounded-lg border border-stone-300 text-xs font-semibold text-charcoal-900 hover:bg-stone-50"
              >
                Inquire Vetting
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-charcoal-950 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-olive-700 text-white flex items-center justify-center mx-auto shadow-lg">
            <Compass className="w-6 h-6 text-olive-200" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to Visualize Your Future Residence?
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Begin with your plot dimensions. Compare 3 alternative concepts, refine via AI conversation, and export clean presentation drawings.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-white text-charcoal-950 text-xs sm:text-sm font-bold shadow-elevated hover:bg-stone-100 transition-all flex items-center gap-2"
            >
              <span>Launch Studio Experience</span>
              <ArrowRight className="w-4 h-4 text-olive-700" />
            </button>
          </div>
        </div>
      </section>

      {/* New Project Modal */}
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
