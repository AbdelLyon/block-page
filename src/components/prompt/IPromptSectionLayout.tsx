"use client";

import React from "react";
import { Wand2, ChevronDown, Layers, X } from "lucide-react";

interface AIPromptSectionLayoutProps {
  isOpen: boolean;
  isModifying: boolean;
  showStructure: boolean;
  toggleOpen: () => void;
  setShowStructure: (show: boolean) => void;
  hasComponents: boolean;
  resetTemplate: () => void;
}

export const AIPromptSectionLayout: React.FC<AIPromptSectionLayoutProps> = ({
  isOpen,
  isModifying,
  showStructure,
  toggleOpen,
  setShowStructure,
  hasComponents,
  resetTemplate,
}) => {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-14 px-4 flex items-center justify-between cursor-pointer z-10 border-b border-gray-100"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
      onClick={toggleOpen}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-blue-500" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800">Assistant IA</h4>
        {isModifying && (
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
            Mode modification
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isOpen && (
          <>
            <button
              className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                showStructure
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowStructure(!showStructure);
              }}
            >
              <Layers className="w-3 h-3" />
              <span>Structure</span>
            </button>

            {hasComponents && (
              <button
                className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm(
                      "Êtes-vous sûr de vouloir réinitialiser le template ?",
                    )
                  ) {
                    resetTemplate();
                  }
                }}
              >
                <X className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </>
        )}

        <button
          className="bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toggleOpen();
          }}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};
