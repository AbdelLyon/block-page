// FullTemplateConfiguration.tsx
import React from "react";
import { ComponentOptions, TemplateStyle, TemplateType } from "./types";
import { useIAPrompt } from "./useIAPrompt";

interface TemplateConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
}

export const TemplateConfiguration: React.FC<TemplateConfigurationProps> = ({
  options,
  setOptions,
}) => {
  const { getSectionsForTemplateType } = useIAPrompt();
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Type de template
        </h4>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {[
            { id: "landing", label: "Landing Page" },
            { id: "blog", label: "Blog" },
            { id: "portfolio", label: "Portfolio" },
            { id: "ecommerce", label: "E-commerce" },
            { id: "business", label: "Entreprise" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                setOptions({
                  ...options,
                  templateType: type.id as TemplateType,
                })
              }
              className={`
                py-2 px-3 rounded border text-sm font-medium
                ${
                  options.templateType === type.id
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Style visuel</h4>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { id: "minimal", label: "Minimaliste" },
            { id: "modern", label: "Moderne" },
            { id: "classic", label: "Classique" },
            { id: "bold", label: "Audacieux" },
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() =>
                setOptions({
                  ...options,
                  templateStyle: style.id as TemplateStyle,
                })
              }
              className={`
                py-2 px-3 rounded border text-sm font-medium
                ${
                  options.templateStyle === style.id
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Palette de couleurs
        </h4>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            { id: "blue", label: "Bleue", bg: "bg-blue-500" },
            { id: "green", label: "Verte", bg: "bg-green-500" },
            { id: "purple", label: "Violette", bg: "bg-purple-500" },
            { id: "red", label: "Rouge", bg: "bg-red-500" },
            { id: "orange", label: "Orange", bg: "bg-orange-500" },
            { id: "teal", label: "Turquoise", bg: "bg-teal-500" },
            { id: "gray", label: "Grise", bg: "bg-gray-500" },
            {
              id: "custom",
              label: "Personnalisée",
              bg: "bg-gradient-to-r from-blue-500 to-purple-500",
            },
          ].map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() =>
                setOptions({
                  ...options,
                  templateColorScheme: color.id,
                })
              }
              className={`
                py-2 px-3 rounded border text-sm font-medium flex items-center
                ${
                  options.templateColorScheme === color.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }
              `}
            >
              <span className={`w-4 h-4 rounded-full mr-2 ${color.bg}`}></span>
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sections à inclure
        </label>
        <div className="grid grid-cols-2 gap-2">
          {getSectionsForTemplateType(options.templateType).map((section) => (
            <div key={section.id} className="flex items-center">
              <input
                type="checkbox"
                id={`section-${section.id}`}
                checked={
                  options.templateSections?.includes(section.id) || false
                }
                onChange={(e) => {
                  const currentSections = options.templateSections || [];
                  const newSections = e.target.checked
                    ? [...currentSections, section.id]
                    : currentSections.filter((id) => id !== section.id);

                  setOptions({
                    ...options,
                    templateSections: newSections,
                  });
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`section-${section.id}`}
                className="ml-2 text-sm text-gray-600"
              >
                {section.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="template-description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Instructions supplémentaires
        </label>
        <div className="relative">
          <div className="absolute top-0 left-0 w-6 h-6 bg-blue-100 rounded-tl-lg rounded-br-lg flex items-center justify-center text-blue-700 text-xs font-medium">
            +
          </div>
          <textarea
            id="template-description"
            value={options.description || ""}
            onChange={(e) => {
              setOptions({
                ...options,
                description: e.target.value,
              });
            }}
            placeholder="Décrivez votre template idéal avec des instructions spécifiques pour l'IA..."
            className="border border-gray-300 rounded-lg pt-7 px-3 pb-3 w-full h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
