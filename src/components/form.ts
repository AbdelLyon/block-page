import { Component } from "grapesjs";

export const form = (component: Component) =>
  `<form class="p-6 bg-white rounded-lg shadow-md">
      <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">URL du lien</label>
      <input 
         type="url" 
         name="link-url"
         class="w-full px-3 py-2 border border-gray-300 rounded-md"
         value="${
           component.getAttributes().href !== "#"
             ? component.getAttributes().href
             : ""
         }"
         placeholder="https://example.com..."
      />
      </div>

      <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Texte du lien</label>
      <input 
         type="text" 
         name="link-text"
         class="w-full px-3 py-2 border border-gray-300 rounded-md"
         value="${component.get("content")}"
         placeholder="Texte du lien"
      />
      </div>

      <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">Ouvrir dans</label>
      <select 
         name="link-target"
         class="w-full px-3 py-2 border border-gray-300 rounded-md"
      >
         <option value="_self" ${
           component.getAttributes().target === "_self" ? "selected" : ""
         }>
            Même fenêtre
         </option>
         <option value="_blank" ${
           component.getAttributes().target === "_blank" ? "selected" : ""
         }>
            Nouvelle fenêtre
         </option>
      </select>
      </div>

      <div class="flex justify-end gap-3">
      <button type="button" class="cancel-btn px-4 py-2 border rounded-md">
         Annuler
      </button>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">
         Appliquer
      </button>
      </div>
   </form>`;
