"use client";

import React from "react";
import { X } from "lucide-react";
import { ComponentOptions, TimelineEvent } from "./types";

interface TimelineConfigurationProps {
  options: ComponentOptions;
  setOptions: (options: ComponentOptions) => void;
  addTimelineEvent: () => void;
  removeTimelineEvent: (index: number) => void;
  updateTimelineEvent: (index: number, updates: Partial<TimelineEvent>) => void;
}

export const TimelineConfiguration: React.FC<TimelineConfigurationProps> = ({
  options,
  addTimelineEvent,
  removeTimelineEvent,
  updateTimelineEvent,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">
          Événements de la chronologie
        </h4>
        <button
          type="button"
          onClick={addTimelineEvent}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >
          Ajouter un événement
        </button>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto bg-gray-50 p-3 rounded-lg">
        {(options.timelineEvents || []).length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucun événement ajouté
          </p>
        ) : (
          (options.timelineEvents || []).map((event, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg bg-white"
            >
              <div className="flex justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-700">
                  Événement #{index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeTimelineEvent(index)}
                  className="p-1 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={event.date}
                    onChange={(e) =>
                      updateTimelineEvent(index, {
                        date: e.target.value,
                      })
                    }
                    placeholder="Ex: 2020"
                    className="border border-gray-300 rounded p-2 w-full text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) =>
                      updateTimelineEvent(index, {
                        title: e.target.value,
                      })
                    }
                    placeholder="Titre de l'événement"
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
                  value={event.description || ""}
                  onChange={(e) =>
                    updateTimelineEvent(index, {
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
    </div>
  );
};
