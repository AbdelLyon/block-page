"use client";

import React from "react";
import { ComponentOptions, ComponentType, PlacementType } from "./types";

interface PromptPreviewProps {
  selectedComponentType: ComponentType;
  options: ComponentOptions;
  generateComponentPrompt: (
    type: ComponentType,
    options: ComponentOptions,
  ) => string;
  generatePlacementPrompt: (placement?: {
    targetId?: string;
    type: PlacementType;
  }) => string;
}

export const PromptPreview: React.FC<PromptPreviewProps> = ({
  selectedComponentType,
  options,
  generateComponentPrompt,
  generatePlacementPrompt,
}) => {
  return (
    <div className="mt-auto">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Aperçu du prompt
      </h3>
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          {selectedComponentType === "custom"
            ? options.customPrompt || "Entrez une description personnalisée..."
            : generateComponentPrompt(selectedComponentType, options) +
              generatePlacementPrompt(
                options.placement?.type ? options.placement : undefined,
              )}
        </p>
      </div>
    </div>
  );
};
