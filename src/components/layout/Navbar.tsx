import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, FolderKanban, Sparkles, Plus, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenNewProject?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewProject }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-charcoal-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Compass className="w-4 h-4 text-olive-200" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg font-bold tracking-tight text-charcoal-950">
                    FORMA <span className="font-normal text-stone-500 text-sm">STUDIO</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-olive-700 font-bold -mt-1">
                    Civil &amp; Architectural AI
                  </span>
                </div>
              </Link>

              {/* Navigation Links (Desktop) */}
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
                <Link
                  to="/"
                  className={`transition-colors hover:text-charcoal-900 ${
                    isActive('/') ? 'text-charcoal-950 font-semibold' : ''
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/projects"
                  className={`transition-colors hover:text-charcoal-900 flex items-center gap-1.5 ${
                    location.pathname.startsWith('/projects') ? 'text-charcoal-950 font-semibold' : ''
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Projects Workspace</span>
                </Link>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    if (location.pathname !== '/') {
                      // navigate to home with hash
                    }
                  }}
                  className="transition-colors hover:text-charcoal-900"
                >
                  How It Works
                </a>
                <a href="#gallery" className="transition-colors hover:text-charcoal-900">
                  Design Gallery
                </a>
                <a href="#pricing" className="transition-colors hover:text-charcoal-900">
                  Pricing
                </a>
              </nav>
            </div>

            {/* Right CTAs */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setShowSignInModal(true)}
                className="text-xs font-semibold text-stone-700 hover:text-charcoal-950 px-3 py-2 transition-colors"
              >
                Sign In
              </button>

              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-charcoal-900 text-white text-xs font-semibold shadow-sm hover:bg-charcoal-800 transition-all hover:shadow"
              >
                <Plus className="w-3.5 h-3.5 text-olive-300" />
                <span>Start Your Project</span>
              </Link>
            </div>

            {/* Mobile menu hamburger */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-600 hover:text-charcoal-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-stone-200 bg-white px-4 py-4 space-y-3 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 py-1"
            >
              Overview
            </Link>
            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-stone-700 py-1"
            >
              Projects Workspace
            </Link>
            <Link
              to="/projects/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium text-olive-800 font-semibold py-1"
            >
              + Start New Project
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowSignInModal(true);
              }}
              className="block w-full text-left font-medium text-stone-700 py-1"
            >
              Sign In
            </button>
          </div>
        )}
      </header>

      {/* Honest Sign-In POC Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 text-center animate-scaleUp">
            <div className="w-10 h-10 rounded-full bg-olive-50 text-olive-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">Forma Studio POC</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              This proof-of-concept operates with simulated local sessions and browser storage. No real login credentials or external database authentication are required for demonstration.
            </p>
            <button
              onClick={() => setShowSignInModal(false)}
              className="mt-5 w-full py-2.5 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Continue to Workspace
            </button>
          </div>
        </div>
      )}
    </>
  );
};
