"use client";

import React from "react";
import { ComponentCategory, ComponentType } from "./types";
import { useIAPrompt } from "./useIAPrompt";

interface TypeSelectorProps {
  activeCategory: ComponentCategory;
  selectedComponentType: ComponentType;
  setSelectedComponentType: (type: ComponentType) => void;
}

export const TypeSelector: React.FC<TypeSelectorProps> = ({
  activeCategory,
  selectedComponentType,
  setSelectedComponentType,
}) => {
  const { COMPONENT_BY_CATEGORY } = useIAPrompt();
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Type de composant
      </h3>
      <div
        className="grid grid-cols-2 gap-2 mb-6 overflow-y-auto pr-1"
        style={{ maxHeight: "250px" }}
      >
        {COMPONENT_BY_CATEGORY[activeCategory].map(({ type, name, icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => setSelectedComponentType(type)}
            className={`
              p-3 rounded-lg flex flex-col items-center justify-center text-xs gap-2
              ${
                selectedComponentType === type
                  ? "bg-white border-blue-400 border shadow-sm text-blue-700"
                  : "bg-gray-100 border border-gray-200 hover:bg-white hover:border-gray-300"
              }
              transition-all duration-200
            `}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {icon}
            </span>
            <span className="text-center">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
