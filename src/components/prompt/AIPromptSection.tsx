"use client";

import React from "react";
import { Wand2 } from "lucide-react";
import { AIPromptSectionProps } from "./types";
import { useIAPrompt } from "./useIAPrompt";
import { CommonStyleOptions } from "./CommonStyleOptions";
import { TemplateStructureView } from "./TemplateStructureView";
import { CategoryNavigation } from "./CategoryNavigation";
import { TypeSelector } from "./TypeSelector";
import { PlacementOptions } from "./PlacementOptions";
import { PromptPreview } from "./PromptPreview";
import { AIPromptSectionLayout } from "./IPromptSectionLayout";
import { TemplateConfiguration } from "./TemplateConfiguration";
import { v4 as uuidv4 } from "uuid";

export const AIPromptSection: React.FC<AIPromptSectionProps> = ({
  theme,
  handleAISubmit,
  isPending,
}) => {
  const {
    activeCategory,
    addComponentToStructure,
    isModifying,
    isOpen,
    options,
    generateComponentPrompt,
    generatePlacementPrompt,
    resetTemplate,
    error,
    setActiveCategory,
    setIsOpen,
    setOptions,
    setSelectedComponentType,
    setShowStructure,
    showStructure,
    templateStructure,
    toggleOpen,
    selectedComponentType,
    generateStructuredPrompt,
    COMPONENT_NAMES,
  } = useIAPrompt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const componentId = `component-${uuidv4()}`;

    const generatedPrompt =
      selectedComponentType === "CUSTOM"
        ? options.customPrompt || ""
        : generateStructuredPrompt(componentId, selectedComponentType, options);

    addComponentToStructure(componentId, selectedComponentType, options);
    if (!error) setIsOpen(false);
    await handleAISubmit(generatedPrompt);
  };

  const renderComponentConfiguration = () => {
    if (selectedComponentType === "CUSTOM") {
      return (
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-3">
            Description personnalisée
          </h3>
          <textarea
            value={options.customPrompt}
            onChange={(e) =>
              setOptions({ ...options, customPrompt: e.target.value })
            }
            placeholder="Décrivez le composant que vous voulez générer en détail..."
            className="border border-gray-300 rounded-lg p-4 w-full h-64 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          Configuration pour {COMPONENT_NAMES[selectedComponentType]}
        </h3>

        <CommonStyleOptions options={options} setOptions={setOptions} />

        {selectedComponentType === "TEMPLATE" && (
          <TemplateConfiguration options={options} setOptions={setOptions} />
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        transition-all duration-300 ease-in-out
        bg-white shadow-xl border-t border-gray-200
        ${isOpen ? "h-[95vh]" : "h-14"}
        overflow-hidden
      `}
      style={{
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
      }}
    >
      <AIPromptSectionLayout
        isOpen={isOpen}
        isModifying={isModifying}
        showStructure={showStructure}
        toggleOpen={toggleOpen}
        setShowStructure={setShowStructure}
        hasComponents={Object.keys(templateStructure.components).length > 0}
        resetTemplate={resetTemplate}
      />

      <div
        className={`
          pt-16 px-4 pb-4 
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          transition-all duration-300
          h-full overflow-y-auto
          grid grid-cols-12 gap-5
        `}
      >
        {error && (
          <div className="col-span-12 mb-4 bg-red-50 border border-red-200 p-3 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {showStructure && (
          <TemplateStructureView
            templateStructure={templateStructure}
            options={options}
            setOptions={setOptions}
            setShowStructure={setShowStructure}
          />
        )}

        <div className="col-span-3 h-full flex flex-col">
          <div className="bg-gray-50 rounded-xl p-4 h-full flex flex-col">
            <CategoryNavigation
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              setSelectedComponentType={setSelectedComponentType}
            />

            <TypeSelector
              activeCategory={activeCategory}
              selectedComponentType={selectedComponentType}
              setSelectedComponentType={setSelectedComponentType}
            />

            <PlacementOptions
              templateStructure={templateStructure}
              options={options}
              showStructure={showStructure}
              setOptions={setOptions}
            />

            <PromptPreview
              selectedComponentType={selectedComponentType}
              options={options}
              generateComponentPrompt={generateComponentPrompt}
              generatePlacementPrompt={generatePlacementPrompt}
            />
          </div>
        </div>

        <div className="col-span-9 flex flex-col h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="bg-white rounded-xl border border-gray-200 p-5 flex-grow overflow-y-auto">
              {renderComponentConfiguration()}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className={`
                  py-3
                  px-6
                  rounded-lg 
                  flex items-center 
                  justify-center 
                  gap-2
                  transition-all 
                  ${
                    isPending
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }
                `}
                style={{
                  backgroundColor: theme.accent,
                  color: "white",
                }}
              >
                <Wand2 className="w-5 h-5" />
                <span className="font-medium text-base">
                  {isModifying ? "Modifier" : "Ajouter au template"}
                </span>
                {isPending && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-white animate-pulse"></div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
