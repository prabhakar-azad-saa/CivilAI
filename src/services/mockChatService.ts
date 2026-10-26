import { ChatMessage, DesignConcept, RoomScheduleItem } from '../types/design';
import { MockDesignService } from './mockDesignService';

export interface ChatRefinementResult {
  message: ChatMessage;
  updatedDesign?: DesignConcept;
  appliedSummary?: string;
}

export class MockChatService {
  private static CHAT_STORAGE_PREFIX = 'forma_chat_history_';

  static getHistory(designId: string): ChatMessage[] {
    try {
      const raw = localStorage.getItem(`${this.CHAT_STORAGE_PREFIX}${designId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to parse chat history', e);
    }
    // Default initial greeting
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        content: "I've synthesized this architectural concept based on your plot constraints and room brief. What would you like to refine? You can adjust room proportions, add specialty spaces, optimize Vastu alignments, or explore cost reductions.",
        timestamp: 'Just now'
      }
    ];
  }

  static saveHistory(designId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(`${this.CHAT_STORAGE_PREFIX}${designId}`, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }

  static async processUserMessage(
    design: DesignConcept,
    userText: string
  ): Promise<ChatRefinementResult> {
    // Simulate natural thinking delay (500ms - 800ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = userText.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Make living room larger
    if (lower.includes('living') && (lower.includes('large') || lower.includes('bigger') || lower.includes('expand') || lower.includes('spacious'))) {
      const updatedSchedule = design.roomSchedule.map((item) => {
        if (item.name.toLowerCase().includes('living')) {
          return {
            ...item,
            dimensions: '22\'0" × 16\'0"',
            areaSqFt: 352
          };
        }
        return item;
      });

      const areaDelta = 70;
      const newBuiltUp = design.builtUpAreaSqFt + areaDelta;
      const newBaseCost = Math.round(newBuiltUp * design.costEstimate.ratePerSqFt);
      const totalCost = newBaseCost + Object.values(design.costEstimate.allowances).reduce((a, b) => a + b, 0);

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Expanded living and entertaining lounge (+70 sq ft)',
        ['roomSchedule', 'builtUpAreaSqFt', 'costEstimate'],
        {
          roomSchedule: updatedSchedule,
          builtUpAreaSqFt: newBuiltUp,
          costEstimate: {
            ...design.costEstimate,
            builtUpAreaSqFt: newBuiltUp,
            baseConstructionCost: newBaseCost,
            totalPreliminaryEstimate: totalCost
          }
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've expanded the main living room from 261 sq ft to 352 sq ft (22'0\" × 16'0\"). We reallocated space from the internal circulation buffer to keep structural column alignments intact. Total built-up area is now " + newBuiltUp + " sq ft with an updated preliminary civil estimate.",
        timestamp,
        summaryOfChange: 'Living Room expanded to 352 sq ft (+70 sq ft)',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 2. Add or enlarge Pooja room
    if (lower.includes('pooja') || lower.includes('puja') || lower.includes('prayer') || lower.includes('mandir')) {
      let updatedSchedule = [...design.roomSchedule];
      const existingIdx = updatedSchedule.findIndex((r) => r.name.toLowerCase().includes('pooja'));

      if (existingIdx !== -1) {
        updatedSchedule[existingIdx] = {
          ...updatedSchedule[existingIdx],
          dimensions: '8\'0" × 6\'6"',
          areaSqFt: 52,
          vastuZone: 'North-East (Ishanya Sanctum)'
        };
      } else {
        const newPooja: RoomScheduleItem = {
          id: `rm-pooja-${Date.now()}`,
          name: 'Dedicated Pooja Sanctum',
          floor: 'Ground Floor',
          dimensions: '7\'0" × 6\'0"',
          areaSqFt: 42,
          vastuZone: 'North-East (Ishanya Corner)'
        };
        updatedSchedule.splice(3, 0, newPooja);
      }

      const areaDelta = 40;
      const newBuiltUp = design.builtUpAreaSqFt + areaDelta;
      const newBaseCost = Math.round(newBuiltUp * design.costEstimate.ratePerSqFt);
      const totalCost = newBaseCost + Object.values(design.costEstimate.allowances).reduce((a, b) => a + b, 0);

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Integrated dedicated Vastu-compliant Pooja Sanctum in North-East',
        ['roomSchedule', 'builtUpAreaSqFt'],
        {
          roomSchedule: updatedSchedule,
          builtUpAreaSqFt: newBuiltUp,
          costEstimate: {
            ...design.costEstimate,
            builtUpAreaSqFt: newBuiltUp,
            baseConstructionCost: newBaseCost,
            totalPreliminaryEstimate: totalCost
          }
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've created a dedicated Vastu-compliant Pooja Sanctum positioned in the auspicious North-East (Ishanya) zone. It features brass jali screens for ventilation and sacred isolation from foot traffic. Room schedule and 2D floor plan have been updated.",
        timestamp,
        summaryOfChange: 'Added Dedicated Pooja Sanctum (42 sq ft, Ishanya NE)',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 3. Reduce budget
    if (lower.includes('budget') || lower.includes('cost') || lower.includes('reduce') || lower.includes('cheaper') || lower.includes('economy')) {
      const newRate = Math.max(1900, design.costEstimate.ratePerSqFt - 200);
      const newBaseCost = Math.round(design.builtUpAreaSqFt * newRate);
      const updatedAllowances = {
        ...design.costEstimate.allowances,
        interiorsModularKitchen: Math.round(design.costEstimate.allowances.interiorsModularKitchen * 0.85),
        landscapingHardscape: Math.round(design.costEstimate.allowances.landscapingHardscape * 0.8),
        smartHomeSecurity: Math.round(design.costEstimate.allowances.smartHomeSecurity * 0.75)
      };
      const totalCost = newBaseCost + Object.values(updatedAllowances).reduce((a, b) => a + b, 0);
      const savings = design.costEstimate.totalPreliminaryEstimate - totalCost;

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        `Value-engineered specification reduction (Estimated savings: ₹${(savings / 100000).toFixed(2)} Lakhs)`,
        ['costEstimate'],
        {
          costEstimate: {
            ...design.costEstimate,
            ratePerSqFt: newRate,
            baseConstructionCost: newBaseCost,
            allowances: updatedAllowances,
            totalPreliminaryEstimate: totalCost,
            rateCategory: 'standard'
          }
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: `I've recalibrated the construction assumptions for value engineering: optimized RCC column spans, standardized tile allowances (600×600mm), and rationalized custom millwork. This saves approximately ₹${(savings / 100000).toFixed(2)} Lakhs, bringing the total estimate down to ₹${(totalCost / 100000).toFixed(2)} Lakhs without reducing room dimensions.`,
        timestamp,
        summaryOfChange: `Reduced total estimate by ₹${(savings / 100000).toFixed(2)} Lakhs`,
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 4. Add Balcony / Terrace Deck
    if (lower.includes('balcony') || lower.includes('deck') || lower.includes('sitout') || lower.includes('veranda')) {
      let updatedSchedule = [...design.roomSchedule];
      const newBalcony: RoomScheduleItem = {
        id: `rm-balcony-${Date.now()}`,
        name: 'Cantilever Sunset Deck',
        floor: 'First Floor',
        dimensions: '16\'0" × 6\'6"',
        areaSqFt: 104,
        vastuZone: 'East / Open Breeze'
      };
      updatedSchedule.push(newBalcony);

      const areaDelta = 80;
      const newBuiltUp = design.builtUpAreaSqFt + areaDelta;
      const newBaseCost = Math.round(newBuiltUp * design.costEstimate.ratePerSqFt);
      const totalCost = newBaseCost + Object.values(design.costEstimate.allowances).reduce((a, b) => a + b, 0);

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Added 104 sq ft cantilevered sunset deck on first floor',
        ['roomSchedule', 'builtUpAreaSqFt'],
        {
          roomSchedule: updatedSchedule,
          builtUpAreaSqFt: newBuiltUp,
          costEstimate: {
            ...design.costEstimate,
            builtUpAreaSqFt: newBuiltUp,
            baseConstructionCost: newBaseCost,
            totalPreliminaryEstimate: totalCost
          }
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've integrated a generous 104 sq ft cantilevered sunset deck attached to the First Floor family zone. It includes structural pergolas for shade and glass safety balustrades. Check the updated First Floor plan and 3D concept.",
        timestamp,
        summaryOfChange: 'Added First Floor Cantilever Deck (104 sq ft)',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 5. Kitchen & Vastu direction
    if (lower.includes('kitchen') || lower.includes('vastu') || lower.includes('direction') || lower.includes('agni')) {
      const updatedSchedule = design.roomSchedule.map((item) => {
        if (item.name.toLowerCase().includes('kitchen')) {
          return {
            ...item,
            name: 'Vastu-Aligned Modular Kitchen & Utility',
            vastuZone: 'South-East (Agni Corner — Ideal)'
          };
        }
        return item;
      });

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Re-aligned kitchen zoning to South-East Agni quadrant for 100% Vastu compliance',
        ['roomSchedule', 'vastuNotes'],
        {
          roomSchedule: updatedSchedule,
          vastuScorePercent: 98,
          vastuNotes: 'Full compliance achieved: Kitchen placed in Agni (SE), Master bedroom in Nairutya (SW), Main entry North.'
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've re-aligned the kitchen layout strictly into the South-East (Agni) quadrant with the cooking hob facing East. This improves overall Vastu compliance to 98% while ensuring optimal morning light and natural smoke ventilation away from living rooms.",
        timestamp,
        summaryOfChange: 'Kitchen re-aligned to South-East (Agni corner, 98% Vastu score)',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 6. Covered parking
    if (lower.includes('parking') || lower.includes('car') || lower.includes('garage') || lower.includes('portico')) {
      const updatedSchedule = design.roomSchedule.map((item) => {
        if (item.name.toLowerCase().includes('portico') || item.name.toLowerCase().includes('carport') || item.name.toLowerCase().includes('parking')) {
          return {
            ...item,
            name: 'Covered Dual-Vehicle Portico with Louvered Pergola',
            dimensions: '18\'0" × 14\'0"',
            areaSqFt: 252
          };
        }
        return item;
      });

      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Upgraded to all-weather covered dual vehicle portico',
        ['roomSchedule', 'parkingSpaces', 'parkingType'],
        {
          roomSchedule: updatedSchedule,
          parkingSpaces: 2,
          parkingType: 'Covered Dual Portico'
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've upgraded the parking bay to a covered all-weather dual-vehicle portico with architectural metal louvers. It protects your vehicles from monsoon rains while keeping the facade clean and modern.",
        timestamp,
        summaryOfChange: 'Upgraded to Covered Dual Vehicle Portico',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 7. Ventilation & daylight
    if (lower.includes('ventilation') || lower.includes('sunlight') || lower.includes('light') || lower.includes('air') || lower.includes('courtyard')) {
      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Optimized passive thermal ventilation and clerestory window placement',
        ['openSpacePercentage', 'description'],
        {
          openSpacePercentage: Math.min(35, design.openSpacePercentage + 4)
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've enhanced the passive cooling envelope by introducing high-level clerestory louvers above the stairwell and widening the courtyard lightwell by 4%. This creates a stack ventilation effect, pulling cooler ground air through living zones.",
        timestamp,
        summaryOfChange: 'Passive cross-ventilation stack & lightwell widened',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 8. Privacy
    if (lower.includes('privacy') || lower.includes('sound') || lower.includes('screen') || lower.includes('road')) {
      const { design: updatedDesign } = await MockDesignService.addRevision(
        design.id,
        'Introduced double-skin terracotta jali screen for street privacy',
        ['keyAdvantages'],
        {
          keyAdvantages: [
            ...design.keyAdvantages.slice(0, 3),
            'Double-skin terracotta jali provides acoustic dampening and 100% street privacy'
          ]
        }
      );

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've incorporated a double-skin terracotta jali screening element along the front-facing windows. This buffers street noise, shields ground-floor rooms from pedestrian sightlines, and casts beautiful architectural shadows during peak daylight.",
        timestamp,
        summaryOfChange: 'Terracotta jali street privacy screen added',
        appliedRevisionId: updatedDesign.currentRevision
      };

      return { message: reply, updatedDesign, appliedSummary: reply.summaryOfChange };
    }

    // 9. Reset to original design
    if (lower.includes('reset') || lower.includes('original') || lower.includes('revert')) {
      const firstRev = design.revisions[design.revisions.length - 1];
      const restored = await MockDesignService.restoreRevision(design.id, firstRev.id);

      const reply: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        content: "I've reset this concept back to its original baseline state (Rev 1.0). All room schedules, built-up dimensions, and preliminary cost estimates have returned to initial values.",
        timestamp,
        summaryOfChange: 'Design restored to Rev 1.0 (Original baseline)',
        appliedRevisionId: restored.currentRevision
      };

      return { message: reply, updatedDesign: restored, appliedSummary: reply.summaryOfChange };
    }

    // Generic consultative architectural reply for custom queries
    const reply: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `I've analyzed your suggestion: "${userText}". In this layout, that modification can be achieved by adjusting the structural bay spacing or shifting internal partition walls. Would you like me to enlarge the living room, add a pooja room, add a balcony, or recalibrate the budget?`,
      timestamp
    };

    return { message: reply };
  }
}
