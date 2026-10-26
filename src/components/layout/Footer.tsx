import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 text-stone-300 border-t border-charcoal-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-olive-700 flex items-center justify-center text-white">
                <Compass className="w-3.5 h-3.5 text-olive-200" />
              </div>
              <span className="font-serif text-base font-bold text-white tracking-wider">
                FORMA STUDIO
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Transforming raw plot dimensions and lifestyle requirements into three buildable architectural concepts with interactive 2D plans, 3D visualization, and preliminary civil estimates.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-serif text-white font-semibold mb-3 tracking-wide text-xs uppercase">
              Product Capabilities
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><Link to="/projects/new" className="hover:text-white transition-colors">10-Step Requirements Wizard</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Alternative Concept Matrix</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Vector SVG Floor Plans</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Three.js 3D Massing Viewer</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Preliminary Cost Estimator</Link></li>
            </ul>
          </div>

          {/* Workflow */}
          <div>
            <h4 className="font-serif text-white font-semibold mb-3 tracking-wide text-xs uppercase">
              Methodology
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><span className="hover:text-white transition-colors">1. Describe Plot &amp; Brief</span></li>
              <li><span className="hover:text-white transition-colors">2. Explore 3 Distinct Typologies</span></li>
              <li><span className="hover:text-white transition-colors">3. Conversational AI Refinement</span></li>
              <li><span className="hover:text-white transition-colors">4. Export Presentation Package</span></li>
            </ul>
          </div>

          {/* Compliance & Engineering Notice */}
          <div className="bg-charcoal-900/80 p-4 rounded-xl border border-charcoal-800 space-y-2">
            <div className="flex items-center gap-1.5 text-terracotta-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Architectural Disclaimer</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Forma Studio produces simulated concept proposals for preliminary visualization. All final structural loads, soil stabilization, MEP schematics, and municipal sanction plans must be vetted by a certified civil engineer.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-charcoal-900 flex flex-col sm:flex-row items-center justify-between text-stone-500 gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Forma Studio — AI Civil Design Studio Frontend POC. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Framework</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Consultation</span>
            <span className="hover:text-stone-300 cursor-pointer">Demo Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
