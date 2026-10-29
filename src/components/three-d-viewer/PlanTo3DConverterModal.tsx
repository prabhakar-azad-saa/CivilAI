import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  Layers,
  Box,
  ArrowRight,
  Eye,
  FileCheck,
  Check,
  Cpu,
  Compass
} from 'lucide-react';
import { DesignConcept } from '../../types/design';
import { MockDesignService } from '../../services/mockDesignService';

interface PlanTo3DConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onDesignCreated: (newDesign: DesignConcept) => void;
}

export const PlanTo3DConverterModal: React.FC<PlanTo3DConverterModalProps> = ({
  isOpen,
  onClose,
  projectId,
  onDesignCreated
}) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'ready'>('upload');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatusText, setScanStatusText] = useState<string>('');
  const [planTitle, setPlanTitle] = useState<string>('Custom 2D Blueprint Concept');
  const [stylePreference, setStylePreference] = useState<string>('Contemporary Modernist');
  const [estimatedSqFt, setEstimatedSqFt] = useState<number>(1850);
  const [generatedDesign, setGeneratedDesign] = useState<DesignConcept | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
        setPlanTitle(file.name.replace(/\.[^/.]+$/, ''));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleBlueprint = () => {
    setUploadedImage('/renders/sample-2d-cad.jpg');
    setPlanTitle('Architectural 2D Blueprint CAD');
  };

  const startAiConversion = async () => {
    if (!uploadedImage) return;

    setStep('scanning');
    setScanProgress(10);
    setScanStatusText('Step 1/4: Analyzing vector lines and external load-bearing wall boundaries...');

    await new Promise((r) => setTimeout(r, 700));
    setScanProgress(35);
    setScanStatusText('Step 2/4: Detecting rooms, door swing arcs, and fenestration clearances...');

    await new Promise((r) => setTimeout(r, 800));
    setScanProgress(65);
    setScanStatusText('Step 3/4: Generating 3D isometric cutaways for Master Bedroom, Kitchen & Living...');

    await new Promise((r) => setTimeout(r, 700));
    setScanProgress(90);
    setScanStatusText('Step 4/4: Synchronizing 2D CAD coordinate grid with 3D BIM exterior model...');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(100);

    // Call service to generate design concept
    const created = await MockDesignService.createDesignFromUploaded2DPlan(
      projectId,
      uploadedImage,
      {
        title: planTitle || 'AI Converted 3D Model',
        builtUpAreaSqFt: estimatedSqFt,
        style: stylePreference
      }
    );

    setGeneratedDesign(created);
    setStep('ready');
  };

  const handleApplyDesign = () => {
    if (generatedDesign) {
      onDesignCreated(generatedDesign);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-olive-700 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">
                AI 2D Blueprint to 3D Floor Plan Generator
              </h3>
              <p className="text-xs text-stone-500">
                Upload your 2D CAD drawing / hand-drawn plan to generate HD 3D cutaway and exterior models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-charcoal-900 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: UPLOAD BLUEPRINT */}
          {step === 'upload' && (
            <div className="space-y-5">
              <div className="text-xs text-stone-600 leading-relaxed bg-olive-50/70 p-3.5 rounded-xl border border-olive-200 flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-olive-800 flex-shrink-0 mt-0.5" />
                <span>
                  Our Architectural AI analyzes uploaded 2D floor plans, extracts spatial dimensions, identifies room types (Bedrooms, Modular Kitchen, Bathrooms, Living Lounge), and builds both an <strong>HD 3D Cutaway Top View</strong> and a <strong>Synchronized 3D Elevation</strong>!
                </span>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-charcoal-900 mb-2">
                  1. Select or Drop Your 2D Floor Plan / Blueprint Image
                </label>
                <div className="border-2 border-dashed border-stone-300 hover:border-olive-600 rounded-2xl p-6 text-center transition-colors bg-stone-50 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Upload className="w-10 h-10 text-olive-700 mb-2" />
                    <span className="text-sm font-bold text-charcoal-900">
                      Drag and drop your 2D blueprint or CAD drawing here
                    </span>
                    <span className="text-xs text-stone-500 mt-1">
                      Accepts PNG, JPG, CAD export, or blueprint photo
                    </span>
                    <div className="mt-3">
                      <span className="px-3 py-1.5 rounded-lg bg-charcoal-900 text-white text-xs font-semibold shadow-sm">
                        Browse Device Files
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Sample Selector */}
              <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl border border-stone-200">
                <div className="text-xs">
                  <span className="font-semibold text-charcoal-900 block">
                    Don&apos;t have a file ready right now?
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    Use our pre-calibrated sample 2D architectural blueprint to test the 3D converter immediately
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUseSampleBlueprint}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-semibold shadow-sm transition-all"
                >
                  Load Sample 2D CAD
                </button>
              </div>

              {/* Attached Preview if present */}
              {uploadedImage && (
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-20 rounded-lg overflow-hidden border border-stone-300 bg-white flex-shrink-0">
                      <img
                        src={uploadedImage}
                        alt="Selected 2D Plan"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold mb-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>2D Floor Plan Loaded Successfully</span>
                      </div>
                      <input
                        type="text"
                        value={planTitle}
                        onChange={(e) => setPlanTitle(e.target.value)}
                        placeholder="Plan Name"
                        className="w-full text-xs font-semibold px-2.5 py-1 rounded border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Generation parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Target Architectural Style
                      </label>
                      <select
                        value={stylePreference}
                        onChange={(e) => setStylePreference(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs"
                      >
                        <option value="Contemporary Modernist">Contemporary Modernist</option>
                        <option value="Modern Biophilic Courtyard">Modern Biophilic Courtyard</option>
                        <option value="Minimalist Urban Duplex">Minimalist Urban Duplex</option>
                        <option value="Luxury Villa Residence">Luxury Villa Residence</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Estimated Built-Up Area (sq ft)
                      </label>
                      <input
                        type="number"
                        value={estimatedSqFt}
                        onChange={(e) => setEstimatedSqFt(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startAiConversion}
                  disabled={!uploadedImage}
                  className="px-6 py-2 rounded-lg bg-olive-700 hover:bg-olive-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Start AI 2D-to-3D Synthesis</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCANNING & SYNTHESIZING */}
          {step === 'scanning' && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-olive-50 border-2 border-olive-400 flex items-center justify-center text-olive-800 shadow-md">
                  <Cpu className="w-12 h-12 animate-pulse" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-charcoal-900 text-white text-[10px] font-mono px-2 py-0.5 rounded-full border border-white">
                  {scanProgress}%
                </div>
              </div>

              <div className="max-w-md space-y-2">
                <h4 className="font-serif text-lg font-bold text-charcoal-900">
                  Synthesizing 3D Architectural Architecture
                </h4>
                <p className="text-xs text-stone-500 font-mono">
                  {scanStatusText}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-olive-700 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 w-full max-w-md text-[11px] text-stone-500 font-mono">
                <div className="p-2 rounded bg-stone-50 border border-stone-200">
                  ✓ Walls &amp; Grid
                </div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200">
                  ✓ Rooms &amp; Doors
                </div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200">
                  ✓ 3D Cutaway
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: RESULTS READY */}
          {step === 'ready' && generatedDesign && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    3D Synthesis Complete! 3 Architectural Models Generated
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Your 2D plan was converted into an HD 3D Cutaway Top View, a 2D/3D BIM Sync layout, and an Exterior Villa Render.
                  </p>
                </div>
              </div>

              {/* 3 Generated Views Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. 3D Cutaway Top View */}
                <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-36 bg-stone-900 relative">
                    <img
                      src="/renders/concept-a-cutaway.jpg"
                      alt="3D Cutaway"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-charcoal-900/90 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      HD 3D Cutaway
                    </div>
                  </div>
                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-charcoal-900 block">
                        3D Cutaway Top-Down Plan
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Furnished Master Bed, Open Kitchen, Living Room &amp; Balcony
                      </p>
                    </div>
                    <span className="text-[10px] text-olive-700 font-semibold mt-2">
                      ✓ Ready in 3D Studio
                    </span>
                  </div>
                </div>

                {/* 2. Split Screen Sync View */}
                <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-36 bg-stone-900 relative">
                    <img
                      src="/renders/concept-a-split.png"
                      alt="Split BIM"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-charcoal-900/90 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      BIM 2D+3D Sync
                    </div>
                  </div>
                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-charcoal-900 block">
                        CAD Blueprint + 3D Sync
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Side-by-side technical drawing aligned with realistic exterior
                      </p>
                    </div>
                    <span className="text-[10px] text-olive-700 font-semibold mt-2">
                      ✓ Ready in 3D Studio
                    </span>
                  </div>
                </div>

                {/* 3. Original Uploaded 2D Blueprint */}
                <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col">
                  <div className="h-36 bg-stone-900 relative">
                    <img
                      src={uploadedImage}
                      alt="Your 2D Plan"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 left-2 bg-charcoal-900/90 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      Analyzed 2D Plan
                    </div>
                  </div>
                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-charcoal-900 block">
                        Your Uploaded Blueprint
                      </span>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        5 room zones recognized with ~{estimatedSqFt} sq ft area
                      </p>
                    </div>
                    <span className="text-[10px] text-blue-700 font-semibold mt-2">
                      ✓ Integrated with Project
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost & Vastu Summary Snapshot */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block">Built-Up Area</span>
                  <span className="font-mono font-bold text-charcoal-900">{generatedDesign.builtUpAreaSqFt} sq ft</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block">Room Count</span>
                  <span className="font-bold text-charcoal-900">{generatedDesign.roomSchedule.length} Spaces</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block">Vastu Score</span>
                  <span className="font-bold text-olive-700">{generatedDesign.vastuScorePercent}% Compliant</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block">Est. Civil Budget</span>
                  <span className="font-serif font-bold text-charcoal-900">
                    ₹{(generatedDesign.costEstimate.totalPreliminaryEstimate / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleApplyDesign}
                  className="px-6 py-2 rounded-lg bg-olive-700 hover:bg-olive-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open &amp; Inspect in 3D Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
