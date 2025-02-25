"use client";

import React from "react";
import { X } from "lucide-react";
import { ComponentOptions, FormField } from "./types";

interface FormConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
  addFormField: () => void;
  removeFormField: (index: number) => void;
  updateFormField: (index: number, updates: Partial<FormField>) => void;
}

export const FormConfiguration: React.FC<FormConfigurationProps> = ({
  options,
  setOptions,
  addFormField,
  removeFormField,
  updateFormField,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          Champs du formulaire
        </h4>
        <button
          type="button"
          onClick={addFormField}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >
          Ajouter un champ
        </button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto bg-gray-50 p-3 rounded-lg">
        {(options.formFields || []).length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucun champ ajouté
          </p>
        ) : (
          (options.formFields || []).map((field, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg bg-white"
            >
              <div className="flex justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700">
                  Champ #{index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeFormField(index)}
                  className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Nom du champ
                  </label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      updateFormField(index, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Ex: Nom, Email..."
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Type de champ
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateFormField(index, {
                        type: e.target.value as FormField["type"],
                      })
                    }
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  >
                    <option value="text">Texte</option>
                    <option value="email">Email</option>
                    <option value="textarea">Zone de texte</option>
                    <option value="select">Liste déroulante</option>
                    <option value="checkbox">Case à cocher</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      updateFormField(index, {
                        placeholder: e.target.value,
                      })
                    }
                    placeholder="Texte indicatif..."
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center h-10 space-x-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        updateFormField(index, {
                          required: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Champ obligatoire</span>
                  </label>
                </div>
              </div>

              {field.type === "select" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Options (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    value={(field.options || []).join(", ")}
                    onChange={(e) =>
                      updateFormField(index, {
                        options: e.target.value
                          .split(",")
                          .map((o) => o.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Option 1, Option 2, Option 3..."
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Texte du bouton de soumission
        </label>
        <input
          type="text"
          value={options.submitButtonText || ""}
          onChange={(e) =>
            setOptions({
              ...options,
              submitButtonText: e.target.value,
            })
          }
          placeholder="Ex: Envoyer"
          className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  );
};
