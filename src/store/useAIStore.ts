// stores/useAIStore.ts
import { Component } from "grapesjs";
import { create } from "zustand";

interface AIStore {
  isModifying: boolean;
  setIsModifying: (value: boolean) => void;
  componentSelected: Component | null;
  setComponentSelected: (component: Component | null) => void;
  error: string;
  setError: (error: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  isModifying: false,
  setIsModifying: (value) => set({ isModifying: value }),
  componentSelected: null,
  setComponentSelected: (component) => set({ componentSelected: component }),
  error: "",
  setError: (error) => set({ error }),
}));
