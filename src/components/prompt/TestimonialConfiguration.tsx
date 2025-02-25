"use client";

import React from "react";
import { ComponentOptions } from "./types";

interface TestimonialConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
}

export const TestimonialConfiguration: React.FC<
  TestimonialConfigurationProps
> = ({ options, setOptions }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Nom de la personne
          </label>
          <input
            type="text"
            value={options.personName || ""}
            onChange={(e) =>
              setOptions({
                ...options,
                personName: e.target.value,
              })
            }
            placeholder="Ex: Jean Dupont"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Poste / Rôle
          </label>
          <input
            type="text"
            value={options.personRole || ""}
            onChange={(e) =>
              setOptions({
                ...options,
                personRole: e.target.value,
              })
            }
            placeholder="Ex: Directeur Marketing"
            className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">Citation</label>
        <textarea
          value={options.personQuote || ""}
          onChange={(e) =>
            setOptions({
              ...options,
              personQuote: e.target.value,
            })
          }
          placeholder="Témoignage de la personne..."
          className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={options.hasImage}
            onChange={(e) =>
              setOptions({
                ...options,
                hasImage: e.target.checked,
              })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Inclure une photo de profil</span>
        </label>
      </div>
    </div>
  );
};
