import { IBlock } from "@/types";

export const image = ({ label, category, id }: IBlock) => {
  return {
    id: id || "image",
    label: label || "Image",
    category,
    content: { type: "image" },
    media: `<i class="fa-solid fa-image fa-2xl"></i>`,
  };
};
