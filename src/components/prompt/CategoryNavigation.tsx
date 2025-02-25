"use client";

import React from "react";
import { ComponentCategory, ComponentType } from "./types";
import { useIAPrompt } from "./useIAPrompt";

interface CategoryNavigationProps {
  activeCategory: ComponentCategory;
  setActiveCategory: (category: ComponentCategory) => void;
  setSelectedComponentType: React.Dispatch<React.SetStateAction<ComponentType>>;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  activeCategory,
  setActiveCategory,
  setSelectedComponentType,
}) => {
  const { COMPONENT_BY_CATEGORY, CATEGORIES } = useIAPrompt();
  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat as ComponentCategory);
    setSelectedComponentType(
      COMPONENT_BY_CATEGORY[cat as ComponentCategory][0].type,
    );
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3">Catégories</h3>
      <div className="grid grid-cols-1 gap-2 mb-6">
        {Object.entries(CATEGORIES).map(([cat, { name, icon, color }]) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategorySelect(cat)}
            className={`
              py-2 px-3 rounded-lg flex items-center gap-3 transition-all
              ${
                activeCategory === cat
                  ? "bg-white shadow-sm font-medium border-l-4"
                  : "hover:bg-white/80 text-gray-600"
              }
            `}
            style={{
              borderLeftColor: activeCategory === cat ? color : "transparent",
            }}
          >
            <span
              className="w-5 h-5 flex items-center justify-center"
              style={{ color }}
            >
              {icon}
            </span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
