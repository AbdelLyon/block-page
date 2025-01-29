import { button } from "@/components/button";
import { grid } from "@/components/grid";
import { image } from "@/components/image";
import { text } from "@/components/text";
import { title } from "@/components/title";
import { Grid, IBlock } from "@/types";

type GenerateBlocksParams = {
  blockGrid?: Grid[];
  blockText?: IBlock;
  blockTitle?: IBlock;
  blockButton?: IBlock;
  blockImage?: IBlock;
};

export const generateCustomBlocks = ({
  blockGrid,
  blockText,
  blockTitle,
  blockButton,
  blockImage,
}: GenerateBlocksParams) => {
  const blocks = [];

  if (blockGrid) {
    blocks.push(...grid(blockGrid));
  }

  if (blockText) {
    blocks.push(text(blockText));
  }

  if (blockTitle) {
    blocks.push(title(blockTitle));
  }

  if (blockButton) {
    blocks.push(button(blockButton));
  }

  if (blockImage) {
    blocks.push(image(blockImage));
  }

  return blocks;
};
