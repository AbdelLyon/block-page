"use client";

import React from "react";
import { ColumnCount, ComponentOptions, Spacing } from "./types";

interface ColumnsGridConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
  type: "columns" | "grid";
}

export const ColumnsGridConfiguration: React.FC<
  ColumnsGridConfigurationProps
> = ({ options, setOptions, type }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Structure</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Nombre de colonnes
            </label>
            <div className="grid grid-cols-4 gap-1">
              {([1, 2, 3, 4] as ColumnCount[]).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() =>
                    setOptions({
                      ...options,
                      columnCount: count,
                    })
                  }
                  className={`
                    py-2 px-3 rounded border text-sm font-medium
                    ${
                      options.columnCount === count
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Espacement
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: "small", label: "Petit" },
                { id: "medium", label: "Moyen" },
                { id: "large", label: "Grand" },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() =>
                    setOptions({
                      ...options,
                      gap: size.id as Spacing,
                    })
                  }
                  className={`
                    py-2 px-3 rounded border text-sm font-medium
                    ${
                      options.gap === size.id
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {type === "columns"
            ? "Contenu des colonnes"
            : "Contenu des éléments de la grille"}
        </label>
        <div
          className={`grid gap-2 ${
            type === "grid" ? `grid-cols-${options.columnCount}` : "grid-cols-1"
          }`}
        >
          {Array.from({
            length: options.columnCount || 3,
          }).map((_, index) => (
            <div key={index} className="relative">
              <div className="absolute top-0 left-0 w-6 h-6 bg-blue-100 rounded-tl-lg rounded-br-lg flex items-center justify-center text-blue-700 text-xs font-medium">
                {index + 1}
              </div>
              <textarea
                value={options.columnContents?.[index] || ""}
                onChange={(e) => {
                  const newContents = [...(options.columnContents || [])];
                  newContents[index] = e.target.value;
                  setOptions({
                    ...options,
                    columnContents: newContents,
                  });
                }}
                placeholder={
                  type === "columns"
                    ? `Contenu colonne ${index + 1}`
                    : `Élément ${index + 1}`
                }
                className="border border-gray-300 rounded-lg pt-7 px-3 pb-3 w-full h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
