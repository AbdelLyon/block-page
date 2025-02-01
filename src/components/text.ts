import { IBlock } from "@/types";

export const text = ({ label, category, id }: IBlock) => {
  return {
    id,
    label,
    category,
    content: {
      type: "text",
      content: "Double-cliquez pour éditer le texte",
      style: { padding: "10px" },
    },
    media: `<i class="fa-solid fa-font fa-2xl"></i>`,
  };
};
