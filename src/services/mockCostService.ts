import { CostEstimate } from '../types/design';

export const RATE_TIERS = {
  basic: {
    label: 'Basic / Rental Grade',
    rate: 1800,
    description: 'RCC frame, red clay brick or solid concrete block, basic ceramic flooring (up to ₹45/sq ft), standard flush doors, anchor switches.'
  },
  standard: {
    label: 'Standard Quality',
    rate: 2200,
    description: 'Fe550 TMT steel, M25 concrete, vitrified tiles (up to ₹85/sq ft), teakwood main frame, branded CP fittings (Jaquar/Cera), concealed wiring.'
  },
  premium: {
    label: 'Architectural Premium',
    rate: 2800,
    description: 'Large-format glazed vitrified tiles, granite stairs, UPVC/aluminum 3-track sliding windows, Grohe/Kohler sanitaryware, texture exterior paint.'
  },
  luxury: {
    label: 'High-End Luxury',
    rate: 3500,
    description: 'Italian marble in common spaces, engineered timber flooring in master suite, double-glazed acoustic windows, smart home automation, bespoke elevation screens.'
  }
};

export class MockCostService {
  static calculateEstimate(
    builtUpAreaSqFt: number,
    rateCategory: 'basic' | 'standard' | 'premium' | 'luxury',
    customRate?: number,
    customAllowances?: Partial<CostEstimate['allowances']>
  ): CostEstimate {
    const ratePerSqFt = customRate ?? RATE_TIERS[rateCategory].rate;
    const baseConstructionCost = Math.round(builtUpAreaSqFt * ratePerSqFt);

    // Standard multipliers based on area
    const defaultAllowances = {
      interiorsModularKitchen: Math.round(builtUpAreaSqFt * (rateCategory === 'luxury' ? 350 : rateCategory === 'premium' ? 240 : 180)),
      landscapingHardscape: Math.round(builtUpAreaSqFt * 50),
      smartHomeSecurity: Math.round(builtUpAreaSqFt * (rateCategory === 'luxury' ? 80 : 40)),
      solarRainwater: 125000,
      contingencyReserve: Math.round(baseConstructionCost * 0.05)
    };

    const allowances = {
      ...defaultAllowances,
      ...customAllowances
    };

    const totalPreliminaryEstimate =
      baseConstructionCost +
      allowances.interiorsModularKitchen +
      allowances.landscapingHardscape +
      allowances.smartHomeSecurity +
      allowances.solarRainwater +
      allowances.contingencyReserve;

    return {
      builtUpAreaSqFt,
      ratePerSqFt,
      baseConstructionCost,
      allowances,
      totalPreliminaryEstimate,
      rateCategory,
      assumptions: [
        `Base structural rate computed at ₹${ratePerSqFt.toLocaleString('en-IN')}/sq ft for ${builtUpAreaSqFt.toLocaleString()} sq ft`,
        'Includes RCC framed columns, beams, footings, and external/internal masonry walls',
        'Standard foundation depth assumed at 5 to 6 feet below natural ground level',
        'Internal wall plastering with smooth lime finish and 2 coats of premium acrylic emulsion'
      ],
      exclusions: [
        'Land acquisition, registration, stamp duty, and mutation charges',
        'Municipal plan approval sanction fees and architect liaison charges',
        'Deep soil piling or black cotton soil stabilization if required by geo-tech report',
        'Bespoke loose furniture, artwork, and curtains'
      ]
    };
  }

  static formatINR(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
