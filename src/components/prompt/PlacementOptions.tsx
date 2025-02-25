"use client";

import React from "react";
import { ArrowUp, ArrowDown, ArrowRight, X } from "lucide-react";
import { ComponentOptions, PlacementType, TemplateStructure } from "./types";

interface PlacementOptionsProps {
  templateStructure: TemplateStructure;
  options: ComponentOptions;
  showStructure: boolean;
  setOptions: (options: ComponentOptions) => void;
}

export const PlacementOptions: React.FC<PlacementOptionsProps> = ({
  templateStructure,
  options,
  showStructure,
  setOptions,
}) => {
  if (Object.keys(templateStructure.components).length === 0 || showStructure) {
    return null;
  }

  return (
    <div className="bg-blue-50 p-3 rounded-lg mb-4">
      <h4 className="text-xs font-medium text-blue-700 mb-2">
        Position du composant
      </h4>
      <div className="flex flex-col gap-2">
        <select
          value={options.placement?.targetId || ""}
          onChange={(e) =>
            setOptions({
              ...options,
              placement: {
                ...options.placement,
                targetId: e.target.value || undefined,
                type: e.target.value
                  ? options.placement?.type || "after"
                  : "at-end",
              },
            })
          }
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        >
          <option value="">À la fin du document</option>
          {Object.values(templateStructure.components).map((component) => (
            <option key={component.id} value={component.id}>
              {component.label}
            </option>
          ))}
        </select>

        {options.placement?.targetId && (
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              {
                value: "before",
                label: "Avant",
                icon: <ArrowUp className="w-4 h-4" />,
              },
              {
                value: "after",
                label: "Après",
                icon: <ArrowDown className="w-4 h-4" />,
              },
              {
                value: "inside",
                label: "À l'intérieur",
                icon: <ArrowRight className="w-4 h-4" />,
              },
              {
                value: "replace",
                label: "Remplacer",
                icon: <X className="w-4 h-4" />,
              },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setOptions({
                    ...options,
                    placement: {
                      ...options.placement,
                      type: item.value as PlacementType,
                    },
                  })
                }
                className={`
                  py-1 px-2 rounded text-xs font-medium flex items-center justify-center gap-1
                  ${
                    options.placement?.type === item.value
                      ? "bg-blue-500 text-white"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
