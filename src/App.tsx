/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CompareSlider } from './components/CompareSlider';
import { StyleCarousel } from './components/StyleCarousel';
import { ConsultantChat } from './components/ConsultantChat';
import { UploadModal } from './components/UploadModal';
import { DesignInsights } from './components/DesignInsights';
import { STYLE_OPTIONS, PRESET_ROOMS } from './data/styles';
import { StyleOption, PresetRoom, ShoppableItem, ChatMessage } from './types';

export default function App() {
  const [currentPreset, setCurrentPreset] = useState<PresetRoom>(PRESET_ROOMS[0]);
  const [originalImage, setOriginalImage] = useState<string>(PRESET_ROOMS[0].imageUrl);
  const [roomName, setRoomName] = useState<string>(PRESET_ROOMS[0].name);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLE_OPTIONS[0]);
  const [reimaginedImage, setReimaginedImage] = useState<string>(
    PRESET_ROOMS[0].styleImages['mid-century-modern']
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [shoppableItems, setShoppableItems] = useState<ShoppableItem[]>(
    PRESET_ROOMS[0].initialShoppableItems
  );
  const [colorPalette, setColorPalette] = useState<string[]>(STYLE_OPTIONS[0].colors);

  // Chat consultation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I'm your AI Interior Design Consultant. I've prepared a ${STYLE_OPTIONS[0].name} transformation of your space, pairing warm walnut woods, iconic seating, and layered brass lighting.\n\nHow would you like to refine this? You can ask to change specific colors (e.g. "make the rug navy blue"), swap furniture pieces, or ask for budget-friendly shoppable recommendations!`,
      timestamp: 'Just now',
      shoppableItems: PRESET_ROOMS[0].initialShoppableItems.slice(0, 2),
      actionSummary: 'Initial Makeover Analysis',
    },
  ]);
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  /**
   * Style selection handler
   */
  const handleSelectStyle = async (style: StyleOption, customPrompt?: string) => {
    setSelectedStyle(style);
    setIsGenerating(true);
    setStatusMessage(`Applying ${style.name} design aesthetic...`);

    // Check if we have pre-computed preset asset
    const cachedPresetImage = currentPreset.styleImages[style.id];

    try {
      // Call server backend makeover endpoint
      const response = await fetch('/api/makeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: originalImage,
          styleName: style.name,
          styleDescription: style.promptDescription,
          customPrompt: customPrompt || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Use AI-generated image if returned, or fallback to curated style imagery
        if (data.generatedImageUrl) {
          setReimaginedImage(data.generatedImageUrl);
        } else if (cachedPresetImage) {
          setReimaginedImage(cachedPresetImage);
        } else {
          setReimaginedImage(style.thumbnail);
        }

        if (data.analysis) {
          if (data.analysis.colorPalette?.length) {
            setColorPalette(data.analysis.colorPalette);
          }
          if (data.analysis.shoppableItems?.length) {
            setShoppableItems((prev) => [...data.analysis.shoppableItems, ...prev]);
          }

          // Add consultant update to chat
          setMessages((prev) => [
            ...prev,
            {
              id: `style-update-${Date.now()}`,
              sender: 'assistant',
              text: `${data.analysis.makeoverSummary || `Reimagined space in ${style.name} style.`}\n\nKey updates: ${
                data.analysis.keyModifications?.join(' • ') || 'Elevated textures and tailored lighting.'
              }`,
              timestamp: 'Just now',
              shoppableItems: data.analysis.shoppableItems?.slice(0, 2),
              actionSummary: `Applied ${style.name}`,
            },
          ]);
        }
      } else {
        if (cachedPresetImage) {
          setReimaginedImage(cachedPresetImage);
        } else {
          setReimaginedImage(style.thumbnail);
        }
      }
    } catch (err) {
      console.warn('Backend styling note, using curated style view:', err);
      if (cachedPresetImage) {
        setReimaginedImage(cachedPresetImage);
      } else {
        setReimaginedImage(style.thumbnail);
      }
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  /**
   * Custom style submission
   */
  const handleCustomStyleSubmit = async (customPrompt: string) => {
    setIsGenerating(true);
    setStatusMessage(`Synthesizing custom style: "${customPrompt}"...`);
    try {
      const response = await fetch('/api/makeover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: originalImage,
          styleName: 'Custom Bespoke Aesthetic',
          styleDescription: customPrompt,
          customPrompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.generatedImageUrl) {
          setReimaginedImage(data.generatedImageUrl);
        }
        if (data.analysis?.shoppableItems?.length) {
          setShoppableItems((prev) => [...data.analysis.shoppableItems, ...prev]);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `custom-style-${Date.now()}`,
            sender: 'assistant',
            text: `I've tailored your space to your custom vision: "${customPrompt}".\n\n${
              data.analysis?.makeoverSummary || 'The design incorporates personalized furniture and atmospheric lighting.'
            }`,
            timestamp: 'Just now',
            shoppableItems: data.analysis?.shoppableItems?.slice(0, 2),
            actionSummary: 'Custom Aesthetic Makeover',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  /**
   * Chat message submission & multi-turn consultation
   */
  const handleSendMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentImageBase64: reimaginedImage,
          context: {
            currentStyle: selectedStyle.name,
            roomOverview: roomName,
            palette: colorPalette,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // If new shoppable items were recommended, add them to our master catalog
        if (data.shoppableItems && data.shoppableItems.length > 0) {
          setShoppableItems((prev) => {
            const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
            const newUnique = data.shoppableItems.filter(
              (i: ShoppableItem) => !existingNames.has(i.name.toLowerCase())
            );
            return [...newUnique, ...prev];
          });
        }

        let refinedImageUrl: string | undefined = undefined;

        // If the user requested a visual refinement, trigger image refinement
        if (data.imageRefinementPrompt) {
          try {
            const visualRes = await fetch('/api/refine-visual', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageBase64: reimaginedImage,
                refinementPrompt: data.imageRefinementPrompt,
              }),
            });
            if (visualRes.ok) {
              const visualData = await visualRes.json();
              if (visualData.imageUrl) {
                refinedImageUrl = visualData.imageUrl;
                setReimaginedImage(visualData.imageUrl);
              }
            }
          } catch (vErr) {
            console.warn('Visual refinement notice:', vErr);
          }
        }

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: 'Just now',
          shoppableItems: data.shoppableItems,
          actionSummary: data.actionSummary,
          refinedImageUrl,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Chat service unavailable');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `I understand your request for that adjustment! In the ${selectedStyle.name} style, maintaining warm natural light and balanced scale is essential. Let me know if you would like me to curate specific items like rugs, lighting, or chairs for this space.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  /**
   * Upload custom photo handler
   */
  const handleUploadCustomImage = (dataUrl: string, fileName: string) => {
    setOriginalImage(dataUrl);
    setRoomName(fileName.replace(/\.[^/.]+$/, ''));
    // Trigger makeover on newly uploaded image
    handleSelectStyle(selectedStyle);
  };

  /**
   * Preset room selection
   */
  const handleSelectPreset = (preset: PresetRoom) => {
    setCurrentPreset(preset);
    setOriginalImage(preset.imageUrl);
    setRoomName(preset.name);
    const styleImg = preset.styleImages[selectedStyle.id] || preset.imageUrl;
    setReimaginedImage(styleImg);
    if (preset.initialShoppableItems?.length) {
      setShoppableItems(preset.initialShoppableItems);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentStyle={selectedStyle}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onResetToSample={() => setIsUploadModalOpen(true)}
        roomName={roomName}
      />

      {/* Main Studio Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Visualizer Hero Section: Compare Slider & Real-time Split */}
        <section aria-label="Visualizer Compare Slider">
          <CompareSlider
            originalImage={originalImage}
            reimaginedImage={reimaginedImage}
            styleName={selectedStyle.name}
            isGenerating={isGenerating}
            statusMessage={statusMessage}
          />
        </section>

        {/* Carousel of Reimagined Styles */}
        <section aria-label="Style Carousel">
          <StyleCarousel
            styles={STYLE_OPTIONS}
            selectedStyleId={selectedStyle.id}
            onSelectStyle={(style) => handleSelectStyle(style)}
            onCustomStyleSubmit={handleCustomStyleSubmit}
            isGenerating={isGenerating}
          />
        </section>

        {/* Two-Column Grid: Design Insights & Context-Aware Chat Consultant */}
        <section aria-label="Design Consultant and Dossier" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Design Insights & Palette Dossier */}
          <div className="lg:col-span-5 space-y-6">
            <DesignInsights
              currentStyle={selectedStyle}
              colorPalette={colorPalette}
              keyElements={selectedStyle.keyElements}
              onDownloadComparison={() => {
                const link = document.createElement('a');
                link.href = reimaginedImage;
                link.download = `${roomName}-${selectedStyle.id}-makeover.png`;
                link.click();
              }}
            />

            {/* Quick Sourcing Overview Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                  Featured Sourced Pieces ({shoppableItems.length})
                </h4>
                <span className="text-[11px] text-amber-700 font-medium">Direct Links</span>
              </div>
              <div className="space-y-2">
                {shoppableItems.slice(0, 3).map((item) => (
                  <a
                    key={item.id}
                    href={item.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-stone-100 hover:border-amber-300 hover:bg-amber-50/30 transition-all text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-amber-800">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.retailer} • <span className="font-semibold text-stone-700">{item.price}</span>
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-stone-400 group-hover:text-amber-700 shrink-0">
                      Shop &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Context-Aware Chat Interface */}
          <div className="lg:col-span-7">
            <ConsultantChat
              messages={messages}
              onSendMessage={handleSendMessage}
              onApplyVisualRefinement={(refinedUrl) => setReimaginedImage(refinedUrl)}
              isSending={isChatSending}
              currentStyle={selectedStyle}
              shoppableItems={shoppableItems}
            />
          </div>
        </section>
      </main>

      {/* Upload and Sample Room Picker Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadCustomImage={handleUploadCustomImage}
        onSelectPreset={handleSelectPreset}
        currentRoomId={currentPreset.id}
      />
    </div>
  );
}
