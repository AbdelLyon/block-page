import { Grid, IBlock } from "@/types";
import { styles } from "./styles";

export const blockTemplates = {
  text: ({ label, category, id }: IBlock) => ({
    id,
    label,
    category,
    content: {
      type: "text",
      content: "Double-cliquez pour éditer le texte",
      style: {
        ...(typeof styles.base.text === "object" ? styles.base.text : {}),
      },
    },
    media: `<i class="fa-solid fa-font fa-2xl"></i>`,
  }),

  title: ({ label, category, id }: IBlock) => ({
    id,
    label,
    category,
    content: `
     <h2 style="${styles.base.title}">
       Votre titre
     </h2>
   `,
    media: `<i class="fa-solid fa-heading fa-2xl"></i>`,
  }),

  grid: (blocks: Grid[]) =>
    blocks.map((block, index) => ({
      id: `grid-${index}`,
      label: block.label,
      category: block.category,
      content: `
     <div style="${styles.base.grid}">
       ${Array.from({ length: block.cols })
         .map(
           () => `
           <div style="${styles.base.card.glass}; min-height: 120px; ${styles.base.effects.hover}; cursor: pointer;"></div>
         `,
         )
         .join("")}
     </div>
   `,
      media: `<i class="fa-solid fa-table-columns fa-2xl"></i>`,
    })),

  image: ({ label, category, id }: IBlock) => ({
    id: id || "image",
    label: label || "Image",
    category,
    content: { type: "image" },
    media: `<i class="fa-solid fa-image fa-2xl"></i>`,
  }),

  button: ({ label, category, id }: IBlock) => ({
    id: id || "button",
    label: label || "Bouton",
    category: category || "Actions",
    content: `
     <a href="#" style="${styles.base.button.primary}">
       Cliquez ici
     </a>
   `,
    media: `<i class="fa-solid fa-hand-pointer fa-2xl"></i>`,
  }),
};
