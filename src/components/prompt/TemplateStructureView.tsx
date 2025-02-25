"use client";

import React from "react";
import {
  Eye,
  PlusCircle,
  X,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { ComponentOptions, PlacementType, TemplateStructure } from "./types";
import { useIAPrompt } from "./useIAPrompt";

interface TemplateStructureViewProps {
  templateStructure: TemplateStructure;
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
  setShowStructure: (show: boolean) => void;
}

export const TemplateStructureView: React.FC<TemplateStructureViewProps> = ({
  templateStructure,
  options,
  setOptions,
  setShowStructure,
}) => {
  const { renderComponentIcons } = useIAPrompt();

  const renderComponentTree = (
    componentIds: string[],
    level = 0,
  ): React.ReactNode => {
    if (!componentIds.length) return null;

    return (
      <ul className={`pl-${level > 0 ? "5" : "0"} space-y-1`}>
        {componentIds.map((id) => {
          const component = templateStructure.components[id];
          if (!component) return null;

          return (
            <li key={id} className="py-1">
              <div
                className={`flex items-center ${
                  level > 0 ? "pl-3 border-l-2 border-gray-200" : ""
                }`}
              >
                <button
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-2 ${
                    options.placement?.targetId === id
                      ? "bg-blue-100 border border-blue-300"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    setOptions({
                      ...options,
                      placement: {
                        targetId: id,
                        type: options.placement?.type || "after",
                      },
                    })
                  }
                >
                  {renderComponentIcons(component.type)}
                  <span>{component.label}</span>
                </button>

                {options.placement?.targetId === id && (
                  <div className="flex items-center ml-2 bg-gray-100 rounded-md p-1">
                    {(
                      [
                        "before",
                        "after",
                        "inside",
                        "replace",
                      ] as PlacementType[]
                    ).map((type) => (
                      <button
                        key={type}
                        className={`p-1 rounded ${
                          options.placement?.type === type
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-200"
                        }`}
                        onClick={() =>
                          setOptions({
                            ...options,
                            placement: { targetId: id, type },
                          })
                        }
                        title={`Placer ${type}`}
                      >
                        {type === "before" && <ArrowUp className="w-3 h-3" />}
                        {type === "after" && <ArrowDown className="w-3 h-3" />}
                        {type === "inside" && (
                          <ArrowRight className="w-3 h-3" />
                        )}
                        {type === "replace" && <X className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {component.children.length > 0 &&
                renderComponentTree(component.children, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="col-span-12 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-800">
          Structure du template
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {Object.keys(templateStructure.components).length} composants
          </span>
          <button
            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
            onClick={() => setShowStructure(false)}
          >
            <Eye className="w-3 h-3" />
            <span>Masquer</span>
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto border rounded-lg p-2 bg-white">
        {templateStructure.rootComponents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-3">
            Aucun composant ajouté
          </p>
        ) : (
          renderComponentTree(templateStructure.rootComponents)
        )}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="flex gap-1 items-center text-xs text-gray-500">
          <PlusCircle className="w-3 h-3" />
          <span>
            Sélectionnez un élément pour définir le placement du prochain
            composant
          </span>
        </div>

        {options.placement?.targetId && (
          <button
            className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() =>
              setOptions({
                ...options,
                placement: { type: "at-end" },
              })
            }
          >
            Placer à la fin
          </button>
        )}
      </div>
    </div>
  );
};
