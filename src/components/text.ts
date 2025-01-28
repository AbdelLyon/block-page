import { IBlock } from "@/types";

export const text = ({ label, category, id }: IBlock) => {
  return {
    id: id || "text",
    label: label || "Texte",
    category,
    content: `
      <p style="
        font-size: 1rem;
        line-height: 1.625;
        color: red;
        margin-bottom: 1rem;
      ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
        Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
      </p>
    `,
    media: '<div style="color: #4b5563;"><List size={24} /></div>',
  };
};
