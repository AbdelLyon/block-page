"use client";

import React, { useState } from "react";
import {
  Globe,
  ChevronDown,
  User,
  Undo,
  Redo,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Code,
  Settings,
} from "lucide-react";
import { Device, IEditorProps } from "@/types";
import { useGrapesEditor } from "@/hooks/useGrapesEditor";

const DEVICES: Record<
  Device,
  { name: string; width: string; widthMedia?: string }
> = {
  Desktop: { name: "Desktop", width: "" },
  Tablet: { name: "Tablet", width: "768px", widthMedia: "768px" },
  Mobile: { name: "Mobile", width: "375px", widthMedia: "375px" },
};

const ProfessionalEditor: React.FC<IEditorProps> = ({
  theme,
  styleCategories,
  onInit,
  onChange,
  onSave,
  blockGrid,
  blockTitle,
  blockText,

  blockImage,
}) => {
  const [activeTab, setActiveTab] = useState<"elements" | "pages">("elements");

  const {
    containerRef,
    activeDevice,
    handleDeviceChange,
    handleUndo,
    handleRedo,
    handleSave,
    handleOpenCode,
    handleOpenSettings,
    editor,
    isPreview,
  } = useGrapesEditor({
    theme,
    styleCategories,
    blockGrid,
    blockTitle,
    blockText,
    blockImage,
    onInit,
    onChange,
    onSave,
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <div
        className="h-14 flex items-center justify-between px-4"
        style={{
          backgroundColor: theme.background.primary,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        {/* Logo et titre */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            DAILYAPPS
          </span>
          <span className="text-sm" style={{ color: theme.text.secondary }}>
            {"Livret d'accueil"}
          </span>
        </div>

        {/* Controls centraux */}
        <div className="flex items-center space-x-6">
          {/* Device switcher */}
          <div
            className="flex items-center space-x-1 border-r pr-4"
            style={{ borderColor: theme.border }}
          >
            {Object.entries(DEVICES).map(([device, config]) => (
              <button
                key={device}
                onClick={() => handleDeviceChange(device as Device)}
                className={`p-1.5 rounded transition-colors ${
                  activeDevice === device ? "bg-blue-50" : "hover:bg-gray-100"
                }`}
                title={config.name}
              >
                {device === "Desktop" && (
                  <Monitor
                    className="w-5 h-5"
                    style={{
                      color:
                        activeDevice === device
                          ? theme.primary
                          : theme.text.secondary,
                    }}
                  />
                )}
                {device === "Tablet" && (
                  <Tablet
                    className="w-5 h-5"
                    style={{
                      color:
                        activeDevice === device
                          ? theme.primary
                          : theme.text.secondary,
                    }}
                  />
                )}
                {device === "Mobile" && (
                  <Smartphone
                    className="w-5 h-5"
                    style={{
                      color:
                        activeDevice === device
                          ? theme.primary
                          : theme.text.secondary,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Undo/Redo */}
          <div
            className="flex items-center space-x-1 border-r pr-4"
            style={{ borderColor: theme.border }}
          >
            <button
              onClick={handleUndo}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              <Undo
                className="w-5 h-5"
                style={{ color: theme.text.secondary }}
              />
            </button>
            <button
              onClick={handleRedo}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              <Redo
                className="w-5 h-5"
                style={{ color: theme.text.secondary }}
              />
            </button>
          </div>

          {/* View controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                if (editor) {
                  editor.runCommand("toggle-fullscreen");
                }
              }}
              className={`p-1.5 rounded transition-colors ${
                isPreview ? "bg-blue-50" : "hover:bg-gray-100"
              }`}
            >
              <Eye
                className="w-5 h-5"
                style={{
                  color: isPreview ? theme.primary : theme.text.secondary,
                }}
              />
            </button>
            <button
              onClick={handleOpenCode}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              <Code
                className="w-5 h-5"
                style={{ color: theme.text.secondary }}
              />
            </button>
            <button
              onClick={handleOpenSettings}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            >
              <Settings
                className="w-5 h-5"
                style={{ color: theme.text.secondary }}
              />
            </button>
          </div>
        </div>

        {/* Actions de droite */}
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 px-3 py-1.5 border rounded hover:bg-gray-50 transition-colors"
            style={{
              borderColor: theme.border,
              color: theme.text.secondary,
            }}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">FR</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            className="px-4 py-1.5 rounded text-white text-sm font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: theme.accent }}
            onClick={handleSave}
          >
            Publier
          </button>

          <button
            className="flex items-center space-x-1 p-1.5 rounded hover:bg-gray-50 transition-colors"
            style={{ color: theme.text.secondary }}
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!isPreview && (
          <div
            className="w-64 bg-white border-r flex flex-col"
            style={{ borderColor: theme.border }}
          >
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("elements")}
                  className={`flex-1 py-2.5 text-sm font-medium text-center focus:outline-none ${
                    activeTab === "elements"
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Éléments
                </button>
                <button
                  onClick={() => setActiveTab("pages")}
                  className={`flex-1 py-2.5 text-sm font-medium text-center focus:outline-none ${
                    activeTab === "pages"
                      ? "text-red-500 border-b-2 border-red-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Pages
                </button>
              </div>
            </div>

            {/* Fixed container for blocks */}
            <div
              id="blocks-container"
              className={`flex-1 overflow-y-auto ${
                activeTab === "elements" ? "block" : "hidden"
              }`}
            />

            {/* Pages content */}
            <div
              className={`flex-1 overflow-y-auto ${
                activeTab === "pages" ? "block" : "hidden"
              }`}
            >
              <div className="p-4">
                <p className="text-sm text-gray-500">
                  Contenu des pages à venir
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Editor Canvas */}
        <div ref={containerRef} className="flex-1" />
      </div>
    </div>
  );
};

export default ProfessionalEditor;
