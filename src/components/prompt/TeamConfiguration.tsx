"use client";

import React from "react";
import { X } from "lucide-react";
import { ComponentOptions, TeamMember } from "./types";

interface TeamConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
  addTeamMember: () => void;
  removeTeamMember: (index: number) => void;
  updateTeamMember: (index: number, updates: Partial<TeamMember>) => void;
}

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({
  options,
  setOptions,
  addTeamMember,
  removeTeamMember,
  updateTeamMember,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          {"Membres de l'équipe"}
        </h4>
        <button
          type="button"
          onClick={addTeamMember}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >
          Ajouter un membre
        </button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto bg-gray-50 p-3 rounded-lg">
        {(options.teamMembers || []).length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucun membre ajouté
          </p>
        ) : (
          (options.teamMembers || []).map((member, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg bg-white"
            >
              <div className="flex justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700">
                  Membre #{index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeTeamMember(index)}
                  className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      updateTeamMember(index, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Nom du membre"
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Poste / Rôle
                  </label>
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) =>
                      updateTeamMember(index, {
                        role: e.target.value,
                      })
                    }
                    placeholder="Ex: Directeur"
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Description (optionnelle)
                </label>
                <input
                  type="text"
                  value={member.description || ""}
                  onChange={(e) =>
                    updateTeamMember(index, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Brève description..."
                  className="border border-gray-300 rounded p-2 w-full text-sm"
                />
              </div>
            </div>
          ))
        )}
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
          <span>Inclure photos de profil</span>
        </label>
      </div>
    </div>
  );
};
