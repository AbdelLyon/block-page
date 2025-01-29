import { IBlock } from "@/types";

export const button = ({ label, category, id }: IBlock) => {
  return {
    id: id || "button",
    label: label || "Button",
    category,
    content: `
      <button style="padding: 0.425rem 1.5rem; font-weight: 500; font-size: 0.875rem; border-radius: 0.375rem; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1); transition: background-color 0.15s;">
        Cliquez ici
      </button>
    `,
    media: '<div style="color: #4b5563;"><Box size={24} /></div>',
  };
};
