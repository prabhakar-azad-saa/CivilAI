import React, { useState } from 'react';
import { IndianRupee, Sliders, CheckCircle2, AlertTriangle, Info, RefreshCw, Save } from 'lucide-react';
import { DesignConcept, CostEstimate } from '../../types/design';
import { MockCostService, RATE_TIERS } from '../../services/mockCostService';

interface CostEstimatorViewProps {
  design: DesignConcept;
  onUpdateCost?: (updatedCost: CostEstimate) => void;
}

export const CostEstimatorView: React.FC<CostEstimatorViewProps> = ({
  design,
  onUpdateCost
}) => {
  const [area, setArea] = useState<number>(design.builtUpAreaSqFt);
  const [rateTier, setRateTier] = useState<'basic' | 'standard' | 'premium' | 'luxury'>(
    design.costEstimate.rateCategory
  );
  const [ratePerSqFt, setRatePerSqFt] = useState<number>(design.costEstimate.ratePerSqFt);

  // Allowances state
  const [interiorAllowance, setInteriorAllowance] = useState<number>(
    design.costEstimate.allowances.interiorsModularKitchen
  );
  const [landscapeAllowance, setLandscapeAllowance] = useState<number>(
    design.costEstimate.allowances.landscapingHardscape
  );
  const [smartSecurityAllowance, setSmartSecurityAllowance] = useState<number>(
    design.costEstimate.allowances.smartHomeSecurity
  );
  const [solarRainwaterAllowance, setSolarRainwaterAllowance] = useState<number>(
    design.costEstimate.allowances.solarRainwater
  );
  const [contingencyPct, setContingencyPct] = useState<number>(5);

  const [hasSavedNotice, setHasSavedNotice] = useState<boolean>(false);

  // Calculations
  const baseCost = Math.round(area * ratePerSqFt);
  const contingencyCost = Math.round(baseCost * (contingencyPct / 100));
  const totalAllowances =
    interiorAllowance + landscapeAllowance + smartSecurityAllowance + solarRainwaterAllowance + contingencyCost;
  const grandTotal = baseCost + totalAllowances;
  const effectiveRate = Math.round(grandTotal / area);

  // Breakdown percentages
  const structurePct = Math.round((baseCost * 0.6) / grandTotal * 100);
  const finishesPct = Math.round((baseCost * 0.4) / grandTotal * 100);
  const interiorsPct = Math.round(interiorAllowance / grandTotal * 100);
  const servicesPct = Math.round((smartSecurityAllowance + solarRainwaterAllowance) / grandTotal * 100);
  const landscapingPct = Math.round(landscapeAllowance / grandTotal * 100);
  const contingencySharePct = Math.max(1, 100 - (structurePct + finishesPct + interiorsPct + servicesPct + landscapingPct));

  const handleTierChange = (tier: 'basic' | 'standard' | 'premium' | 'luxury') => {
    setRateTier(tier);
    const newRate = RATE_TIERS[tier].rate;
    setRatePerSqFt(newRate);
    setInteriorAllowance(Math.round(area * (tier === 'luxury' ? 350 : tier === 'premium' ? 240 : 180)));
  };

  const handleSaveToDesign = () => {
    const updated: CostEstimate = {
      builtUpAreaSqFt: area,
      ratePerSqFt,
      baseConstructionCost: baseCost,
      allowances: {
        interiorsModularKitchen: interiorAllowance,
        landscapingHardscape: landscapeAllowance,
        smartHomeSecurity: smartSecurityAllowance,
        solarRainwater: solarRainwaterAllowance,
        contingencyReserve: contingencyCost
      },
      totalPreliminaryEstimate: grandTotal,
      rateCategory: rateTier,
      assumptions: design.costEstimate.assumptions,
      exclusions: design.costEstimate.exclusions
    };
    onUpdateCost?.(updated);
    setHasSavedNotice(true);
    setTimeout(() => setHasSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Total and Save button */}
      <div className="bg-charcoal-900 text-white rounded-xl p-6 shadow-elevated border border-charcoal-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-olive-700/80 text-olive-100 text-xs font-mono tracking-wider uppercase">
                Preliminary Civil Estimate
              </span>
              <span className="text-stone-400 text-xs">
                Based on {area.toLocaleString()} sq ft built-up area
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-white">
                {MockCostService.formatINR(grandTotal)}
              </h2>
              <span className="text-stone-300 font-mono text-sm">
                (≈ ₹{effectiveRate.toLocaleString('en-IN')}/sq ft all-in)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToDesign}
              className="px-4 py-2 bg-olive-600 hover:bg-olive-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Apply to Workspace</span>
            </button>
          </div>
        </div>

        {hasSavedNotice && (
          <div className="mt-3 bg-olive-800/80 border border-olive-600 px-3 py-2 rounded text-xs text-olive-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-olive-300" />
            <span>Updated estimate synced to selected design revisions and export package!</span>
          </div>
        )}

        {/* Visual Progress Breakdown Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-[11px] text-stone-300 mb-1.5 font-medium">
            <span>Cost Allocation Breakdown</span>
            <span>100% of Preliminary Budget</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-charcoal-800 border border-charcoal-700">
            <div style={{ width: `${structurePct}%` }} className="bg-stone-300" title={`Civil Structure: ${structurePct}%`} />
            <div style={{ width: `${finishesPct}%` }} className="bg-olive-500" title={`Finishes & Glazing: ${finishesPct}%`} />
            <div style={{ width: `${interiorsPct}%` }} className="bg-amber-600" title={`Interiors: ${interiorsPct}%`} />
            <div style={{ width: `${servicesPct}%` }} className="bg-sky-600" title={`MEP & Smart: ${servicesPct}%`} />
            <div style={{ width: `${landscapingPct}%` }} className="bg-emerald-600" title={`Landscaping: ${landscapingPct}%`} />
            <div style={{ width: `${contingencySharePct}%` }} className="bg-terracotta-500" title={`Contingency: ${contingencySharePct}%`} />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300"></span> RCC Structure ({structurePct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-olive-500"></span> Architectural Finishes ({finishesPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Modular Woodwork ({interiorsPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> MEP &amp; Solar ({servicesPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500"></span> Contingency ({contingencySharePct}%)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders and Rate Tiers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Construction Quality Tier Picker */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-subtle">
            <h3 className="font-serif text-base font-bold text-charcoal-900 mb-3 flex items-center justify-between">
              <span>Construction Quality Specification</span>
              <span className="text-xs font-sans font-normal text-stone-500">Select standard rate baseline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(RATE_TIERS) as Array<keyof typeof RATE_TIERS>).map((tierKey) => {
                const tier = RATE_TIERS[tierKey];
                const isSelected = rateTier === tierKey;
                return (
                  <div
                    key={tierKey}
                    onClick={() => handleTierChange(tierKey)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-olive-600 bg-olive-50/50 ring-1 ring-olive-600'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-charcoal-900">{tier.label}</span>
                      <span className="font-mono text-xs font-bold text-olive-800">
                        ₹{tier.rate}/sq ft
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom rate slider */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-semibold text-charcoal-800">
                  Custom Base Rate per Sq Ft
                </label>
                <p className="text-[11px] text-stone-500">Adjust to reflect regional vendor rates</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1600"
                  max="4500"
                  step="50"
                  value={ratePerSqFt}
                  onChange={(e) => setRatePerSqFt(Number(e.target.value))}
                  className="w-40 accent-olive-700"
                />
                <span className="font-mono text-sm font-bold text-charcoal-900 bg-stone-100 px-2.5 py-1 rounded border border-stone-200 w-24 text-right">
                  ₹{ratePerSqFt}
                </span>
              </div>
            </div>
          </div>

          {/* Built-Up Area Adjustment */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-charcoal-900">
                  Built-Up Construction Area
                </h3>
                <p className="text-[11px] text-stone-500">Total enclosed and slab area across all floors</p>
              </div>
              <span className="font-mono text-base font-bold text-olive-800 bg-olive-50 px-3 py-1 rounded border border-olive-200">
                {area} sq ft
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="4500"
              step="25"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full accent-olive-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
              <span>1,000 sq ft</span>
              <span>2,500 sq ft</span>
              <span>4,500 sq ft</span>
            </div>
          </div>

          {/* Optional Add-on Allowances */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-subtle space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900">
              Custom Allowances &amp; Package Packages
            </h3>

            {/* Modular Kitchen & Interior Woodwork */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-800">Modular Kitchen &amp; Wardrobes</span>
                <p className="text-[11px] text-stone-500">Marine ply, acrylic/laminate shutters, Blum hardware</p>
              </div>
              <input
                type="number"
                step="25000"
                value={interiorAllowance}
                onChange={(e) => setInteriorAllowance(Number(e.target.value))}
                className="w-32 text-right font-mono text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50"
              />
            </div>

            {/* Landscaping & Hardscaping */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-800">Garden Landscaping &amp; Pavers</span>
                <p className="text-[11px] text-stone-500">Perimeter planters, lawn turf, stone driveway pavers</p>
              </div>
              <input
                type="number"
                step="10000"
                value={landscapeAllowance}
                onChange={(e) => setLandscapeAllowance(Number(e.target.value))}
                className="w-32 text-right font-mono text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50"
              />
            </div>

            {/* Smart Home Automation */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-800">Smart Home Automation &amp; Security</span>
                <p className="text-[11px] text-stone-500">Video door phone, smart locks, CCTV, motorized gate</p>
              </div>
              <input
                type="number"
                step="10000"
                value={smartSecurityAllowance}
                onChange={(e) => setSmartSecurityAllowance(Number(e.target.value))}
                className="w-32 text-right font-mono text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50"
              />
            </div>

            {/* Solar & Rainwater */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-charcoal-800">Solar PV (3kW) &amp; Rainwater Harvesting</span>
                <p className="text-[11px] text-stone-500">On-grid rooftop solar inverters and recharge pit</p>
              </div>
              <input
                type="number"
                step="10000"
                value={solarRainwaterAllowance}
                onChange={(e) => setSolarRainwaterAllowance(Number(e.target.value))}
                className="w-32 text-right font-mono text-xs px-2.5 py-1.5 border border-stone-200 rounded-md bg-stone-50"
              />
            </div>

            {/* Contingency */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-stone-100">
              <div>
                <span className="text-xs font-semibold text-charcoal-800">Unforeseen Contingency Reserve</span>
                <p className="text-[11px] text-stone-500">Recommended 5% buffer for material inflation</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={contingencyPct}
                  onChange={(e) => setContingencyPct(Number(e.target.value))}
                  className="text-xs font-mono px-2 py-1.5 border border-stone-200 rounded-md bg-stone-50"
                >
                  <option value="3">3%</option>
                  <option value="5">5%</option>
                  <option value="8">8%</option>
                  <option value="10">10%</option>
                </select>
                <span className="font-mono text-xs text-stone-700 w-24 text-right">
                  ₹{contingencyCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cost Itemization & Professional Exclusions */}
        <div className="space-y-6">
          {/* Summary Breakdown Card */}
          <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-subtle">
            <h3 className="font-serif text-base font-bold text-charcoal-900 mb-3">
              Cost Itemization
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Base Civil Structure</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{baseCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Modular Kitchen &amp; Woodwork</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{interiorAllowance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Landscaping &amp; Exterior Pavers</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{landscapeAllowance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Smart Home &amp; Security</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{smartSecurityAllowance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Solar &amp; Rainwater Harvesting</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  ₹{solarRainwaterAllowance.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-600">Contingency Reserve ({contingencyPct}%)</span>
                <span className="font-mono font-semibold text-terracotta-700">
                  ₹{contingencyCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-charcoal-900">
                <span>Total Preliminary Estimate</span>
                <span className="font-mono text-olive-800">
                  {MockCostService.formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Important Disclaimers & Assumptions Card */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-terracotta-700 font-semibold">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Planning Disclaimer &amp; Exclusions</span>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              This preliminary civil calculation is for budgeting and feasibility assessment only. It does not constitute a legally binding quote or final general contractor bill of quantities (BOQ).
            </p>
            <div className="space-y-1.5 text-[11px] text-stone-600">
              <div className="font-medium text-charcoal-800">Explicit Exclusions:</div>
              <ul className="list-disc pl-4 space-y-1 text-stone-500">
                <li>Land plot acquisition, boundary dispute, and stamp registry fees</li>
                <li>Local municipal plan sanction and betterment charges</li>
                <li>Soil stabilization, black cotton deep pile foundation</li>
                <li>Loose furniture, decorative art, and soft furnishings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
