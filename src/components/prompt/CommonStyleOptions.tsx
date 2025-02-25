"use client";

import React from "react";
import { ColorScheme, ComponentOptions } from "./types";

interface CommonStyleOptionsProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
}

export const CommonStyleOptions: React.FC<CommonStyleOptionsProps> = ({
  options,
  setOptions,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Style</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Thème de couleur
          </label>
          <select
            value={options.colorScheme}
            onChange={(e) =>
              setOptions({
                ...options,
                colorScheme: e.target.value as ColorScheme,
              })
            }
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="primary">Principal</option>
            <option value="secondary">Secondaire</option>
            <option value="accent">Accent</option>
            <option value="neutral">Neutre</option>
            <option value="brand">Marque</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { key: "hasBackground", label: "Arrière-plan coloré" },
            { key: "hasBorder", label: "Ajouter bordure" },
            { key: "hasShadow", label: "Ajouter ombre" },
            { key: "rounded", label: "Coins arrondis" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                checked={options[key as keyof ComponentOptions] as boolean}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    [key]: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
