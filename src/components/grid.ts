import { Grid } from "@/types";

export const grid = (blocks: Grid[]) => {
  return blocks.map((block, index) => {
    return {
      id: `grid-${index}`,
      label: block.label,
      category: block.category,
      content: `
        <div style="
          display: grid;
          grid-template-columns: repeat(${block.cols}, 1fr);
          gap: 1.5rem;
          padding: 1rem;
        ">
          ${Array.from({ length: block.cols })
            .map(
              () => `
            <div style="padding: 1rem; border: 1px dashed #dbdbdb; border-raduis : 10px"></div>`,
            )
            .join("")}
        </div>
      `,
      media: `
<i class="fa-solid fa-table-columns fa-2xl"></i>
      `,
    };
  });
};
