import { grid } from "@/components/grid";
import { text } from "@/components/text";
import { title } from "@/components/title";
import { Grid, IBlock } from "@/types";

type GenerateBlocksParams = {
  blockGrid?: Grid[];
  blockText?: IBlock;
  blockTitle?: IBlock;
};

export const generateCustomBlocks = ({
  blockGrid,
  blockText,
  blockTitle,
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

  return blocks;
};
