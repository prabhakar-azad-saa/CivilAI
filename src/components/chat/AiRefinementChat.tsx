import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RotateCcw, Check, ArrowRight, History, Bot, User, Clock, ChevronRight } from 'lucide-react';
import { DesignConcept, ChatMessage } from '../../types/design';
import { MockChatService } from '../../services/mockChatService';
import { MockDesignService } from '../../services/mockDesignService';

interface AiRefinementChatProps {
  design: DesignConcept;
  onDesignUpdated: (updatedDesign: DesignConcept) => void;
  onNavigateToTab?: (tab: string) => void;
}

const QUICK_PROMPT_CHIPS = [
  'Make the living room larger',
  'Add a pooja room',
  'Reduce the estimated construction budget',
  'Add a balcony',
  'Move the kitchen towards the preferred direction',
  'Add a covered parking space',
  'Improve ventilation',
  'Make the design more private',
  'Reset to the original design'
];

export const AiRefinementChat: React.FC<AiRefinementChatProps> = ({
  design,
  onDesignUpdated,
  onNavigateToTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => MockChatService.getHistory(design.id));
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showRevisionDrawer, setShowRevisionDrawer] = useState<boolean>(false);
  const [lastAppliedChange, setLastAppliedChange] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    MockChatService.saveHistory(design.id, messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, design.id]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await MockChatService.processUserMessage(design, text);
      setIsTyping(false);
      setMessages((prev) => [...prev, result.message]);

      if (result.updatedDesign) {
        onDesignUpdated(result.updatedDesign);
        if (result.appliedSummary) {
          setLastAppliedChange(result.appliedSummary);
        }
      }
    } catch (err) {
      setIsTyping(false);
      console.error('Refinement error', err);
    }
  };

  const handleRestoreRevision = async (revId: string) => {
    try {
      const restored = await MockDesignService.restoreRevision(design.id, revId);
      onDesignUpdated(restored);
      setShowRevisionDrawer(false);

      const restoreNotice: ChatMessage = {
        id: `msg-restore-${Date.now()}`,
        sender: 'system',
        content: `Restored concept state to ${restored.currentRevision}. Room schedule and budget recalculated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, restoreNotice]);
    } catch (e) {
      console.error('Failed to restore revision', e);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-subtle flex flex-col h-[650px] relative overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-olive-700 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-sm font-bold text-charcoal-900">
                Forma AI Architectural Assistant
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-olive-100 text-olive-800">
                {design.currentRevision}
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Interactive design refinement &amp; automated spatial recalculation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Revisions History Button */}
          <button
            onClick={() => setShowRevisionDrawer(!showRevisionDrawer)}
            className="px-2.5 py-1.5 text-xs font-medium border border-stone-200 rounded-md bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
            title="View revision history"
          >
            <History className="w-3.5 h-3.5 text-stone-500" />
            <span>Revisions ({design.revisions.length})</span>
          </button>
        </div>
      </div>

      {/* Applied Change Notification Banner */}
      {lastAppliedChange && (
        <div className="bg-olive-50 border-b border-olive-200 px-4 py-2 flex items-center justify-between text-xs text-olive-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-olive-600 flex-shrink-0" />
            <span className="font-medium">Applied: {lastAppliedChange}</span>
          </div>
          <button
            onClick={() => onNavigateToTab?.('plan')}
            className="text-olive-800 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            Inspect Plan <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[11px] bg-stone-200/80 text-stone-700 px-3 py-1 rounded-full font-medium">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                  isUser
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-olive-700 text-white shadow-sm'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-charcoal-900 text-white rounded-tr-none'
                    : 'bg-white border border-stone-200 text-charcoal-800 rounded-tl-none shadow-subtle'
                }`}
              >
                <p>{msg.content}</p>

                {msg.summaryOfChange && (
                  <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-olive-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> {msg.summaryOfChange}
                    </span>
                    <button
                      onClick={() => onNavigateToTab?.('plan')}
                      className="text-stone-500 hover:text-charcoal-900 font-medium underline"
                    >
                      View on Plan
                    </button>
                  </div>
                )}

                <div
                  className={`mt-1 text-[10px] text-right ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-olive-700 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-stone-500 shadow-subtle flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-olive-600 animate-spin" />
              <span>Analyzing layout constraints &amp; adjusting grid...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 bg-white border-t border-stone-200">
        <div className="text-[11px] font-semibold text-stone-500 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-terracotta-500" />
          <span>Suggested Architectural Refinements:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {QUICK_PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isTyping}
              className="text-left text-[11px] whitespace-nowrap bg-stone-100 hover:bg-olive-50 hover:border-olive-300 hover:text-olive-800 text-stone-700 px-2.5 py-1.5 rounded-full border border-stone-200 transition-all font-medium disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Text Input Footer */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputValue);
          }}
          placeholder="E.g., Make living room larger, add pooja room, reduce budget..."
          disabled={isTyping}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-charcoal-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-olive-700"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isTyping}
          className="p-2.5 bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-40 text-white rounded-lg shadow-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Revisions History Drawer Modal */}
      {showRevisionDrawer && (
        <div className="absolute inset-0 bg-charcoal-950/40 backdrop-blur-sm z-20 flex justify-end">
          <div className="w-80 h-full bg-white shadow-2xl flex flex-col p-4 animate-slideIn">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-olive-700" />
                <h4 className="font-serif text-sm font-bold text-charcoal-900">Revision History</h4>
              </div>
              <button
                onClick={() => setShowRevisionDrawer(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {design.revisions.map((rev, i) => {
                const isCurrent = rev.revisionNumber === design.currentRevision;
                return (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-lg border text-xs transition-all ${
                      isCurrent
                        ? 'border-olive-600 bg-olive-50/50'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-charcoal-900">
                        {rev.revisionNumber}
                      </span>
                      <span className="text-[10px] text-stone-500">{rev.timestamp}</span>
                    </div>
                    <p className="text-stone-600 mt-1 text-[11px] leading-relaxed">
                      {rev.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-stone-500">
                        {rev.snapshot.builtUpArea} sq ft
                      </span>
                      {!isCurrent && (
                        <button
                          onClick={() => handleRestoreRevision(rev.id)}
                          className="text-terracotta-600 hover:text-terracotta-700 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore
                        </button>
                      )}
                      {isCurrent && (
                        <span className="text-olive-700 font-semibold text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" /> Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
