import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  MessageSquare,
  Wand2,
  RefreshCw,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, ShoppableItem, StyleOption } from '../types';

interface ConsultantChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onApplyVisualRefinement?: (prompt: string) => void;
  isSending: boolean;
  currentStyle: StyleOption;
  shoppableItems: ShoppableItem[];
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({
  messages,
  onSendMessage,
  onApplyVisualRefinement,
  isSending,
  currentStyle,
  shoppableItems,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'shoppable'>('chat');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    const msg = inputText.trim();
    setInputText('');
    await onSendMessage(msg);
  };

  const quickPrompts = [
    'Keep this layout but make the rug navy blue',
    'Add an arched brass floor lamp and warm lighting',
    'What coffee table and side tables would complete this space?',
    'How can I achieve this look on a budget under $800?',
    'Swap the sofa with a caramel cognac leather sectional',
  ];

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[600px]">
      {/* Top Bar with Tabs */}
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>Design Consultant & Curated Sourcing</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-stone-500">
              Style: <span className="font-medium text-stone-700">{currentStyle.name}</span>
            </p>
          </div>
        </div>

        {/* View Switcher: Chat vs Shoppable Catalog */}
        <div className="flex items-center p-0.5 bg-stone-200/80 rounded-lg text-xs font-medium">
          <button
            id="tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Consultant Chat</span>
          </button>
          <button
            id="tab-shoppable"
            onClick={() => setActiveTab('shoppable')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
              activeTab === 'shoppable'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>Shoppable Items</span>
            {shoppableItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
                {shoppableItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'chat' ? (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Messages Thread */}
          <div
            id="chat-messages-container"
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
          >
            {messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]">
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 shrink-0 flex items-center justify-center text-xs font-serif mt-0.5">
                        AI
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isUser
                          ? 'bg-stone-900 text-stone-50 rounded-tr-xs'
                          : 'bg-stone-50 text-stone-800 border border-stone-200/90 rounded-tl-xs'
                      }`}
                    >
                      {/* Action summary badge if present */}
                      {message.actionSummary && (
                        <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-200">
                          <Wand2 className="w-3 h-3 text-amber-700" />
                          <span>{message.actionSummary}</span>
                        </div>
                      )}

                      <p className="whitespace-pre-line">{message.text}</p>

                      {/* Embedded Shoppable Item Mini-Cards inside Chat */}
                      {message.shoppableItems && message.shoppableItems.length > 0 && (
                        <div className="mt-3.5 pt-3 border-t border-stone-200/80">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-900 mb-2">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                            <span>Recommended Shoppable Matches</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {message.shoppableItems.map((item) => (
                              <a
                                key={item.id}
                                href={item.searchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/item flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all"
                              >
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-400">
                                    <Tag className="w-4 h-4" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-semibold text-stone-900 truncate group-hover/item:text-amber-800">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-0.5">
                                    <span className="font-semibold text-stone-800">{item.price}</span>
                                    <span className="text-[10px] text-stone-500">{item.retailer}</span>
                                  </div>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover/item:text-stone-800 shrink-0 ml-1" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Visual Refinement Trigger if user proposed a direct visual change */}
                      {message.refinedImageUrl && onApplyVisualRefinement && (
                        <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between">
                          <span className="text-[11px] text-stone-600 font-medium">
                            Visual makeover refined
                          </span>
                          <button
                            id="btn-apply-refined-image"
                            onClick={() => onApplyVisualRefinement(message.refinedImageUrl!)}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <span>View in Slider</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {message.timestamp}
                  </span>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 shrink-0 flex items-center justify-center text-xs font-serif">
                  AI
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-xs p-3 text-xs text-stone-600 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Consultant is analyzing space and curating items...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-4 py-2 border-t border-stone-100 bg-stone-50/70 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-stone-400 shrink-0 mr-1">
              Suggestions:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                id={`btn-quick-prompt-${i}`}
                type="button"
                disabled={isSending}
                onClick={() => onSendMessage(prompt)}
                className="inline-flex items-center text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200/90 rounded-full px-2.5 py-1 transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              id="input-chat-message"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask consultant to refine this ${currentStyle.name} room (e.g. 'Make the rug navy blue')...`}
              disabled={isSending}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-60"
            />
            <button
              id="btn-send-chat"
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* Sourced Shoppable Items Grid View */
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-stone-50/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-semibold text-stone-900">
                Curated Shoppable Recommendations
              </h4>
              <p className="text-xs text-stone-500">
                Selected by AI Consultant to match your {currentStyle.name} space
              </p>
            </div>
            <span className="text-xs text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded-md">
              {shoppableItems.length} items curated
            </span>
          </div>

          {shoppableItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-xs">No shoppable items generated yet.</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Ask the consultant in chat (e.g., "Recommend a coffee table") to source pieces!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shoppableItems.map((item) => (
                <div
                  key={item.id}
                  id={`shoppable-card-${item.id}`}
                  className="bg-white rounded-xl border border-stone-200 p-3 flex flex-col justify-between hover:shadow-sm hover:border-amber-400 transition-all"
                >
                  <div>
                    {item.imageUrl && (
                      <div className="aspect-4/3 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{item.price}</span>
                    </div>
                    <h5 className="text-xs font-semibold text-stone-900 leading-snug">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-medium">{item.retailer}</span>
                    <a
                      href={item.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800"
                    >
                      <span>Find item</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
