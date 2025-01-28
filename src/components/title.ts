import { IBlock } from "@/types";

export const title = ({ label, category, id }: IBlock) => {
  return {
    id,
    label,
    category,
    content: `
      <h2 style="font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 1rem;">
        Votre titre
      </h2>
    `,
    media: '<div style="color: #4b5563;"><Type size={24} /></div>',
  };
};
