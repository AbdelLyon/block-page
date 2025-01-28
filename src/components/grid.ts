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
            <div style="padding: 1rem; border: 1px dashed #1f2937;"></div>`,
            )
            .join("")}
        </div>
      `,
      media: `
        <div style="color: #4b5563; border: 1px solid;">
          <Grid size={24} />
        </div>
      `,
    };
  });
};
