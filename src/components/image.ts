import { IBlock } from "@/types";

export const image = ({ label, category, id }: IBlock) => {
  return {
    id: id || "image",
    label: label || "Image",
    category,
    content: { type: "image" },
    media: '<div style="color: #4b5563;"><ImageIcon size={24} /></div>',
  };
};
