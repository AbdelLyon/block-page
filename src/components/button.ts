import { IBlock } from "@/types";

export const button = ({ label, category, id }: IBlock) => {
  return {
    label: "Lien",
    category: "Typographie",
    content: {
      type: "link",
      content: "Nouveau lien",
    },
    media: `<div class="text-gray-600"><Link2 size={24} /></div>`,
  };
};
