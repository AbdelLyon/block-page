import { blockTemplates } from "@/components/blocks";

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
    blocks.push(...blockTemplates.grid(blockGrid));
  }

  if (blockText) {
    blocks.push(blockTemplates.text(blockText));
  }

  if (blockTitle) {
    blocks.push(blockTemplates.title(blockTitle));
  }

  if (blockButton) {
    blocks.push(blockTemplates.button(blockButton));
  }

  if (blockImage) {
    blocks.push(blockTemplates.image(blockImage));
  }

  return blocks;
};

export interface HTMLNode {
  tag: string;
  attributes: { [key: string]: string };
  children: (HTMLNode | string)[];
}
export function htmlToObject(html: string): HTMLNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function elementToObject(element: Element): HTMLNode {
    const attributes: { [key: string]: string } = {};
    Array.from(element.attributes).forEach((attr) => {
      attributes[attr.name] = attr.value;
    });

    const children = Array.from(element.childNodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() || "";
        }
        return elementToObject(node as Element);
      })
      .filter((child) => child !== "");

    return {
      tag: element.tagName.toLowerCase(),
      attributes,
      children,
    };
  }

  return elementToObject(doc.body.firstElementChild as Element);
}

// Objet vers HTML
export function objectToHtml(node: HTMLNode | string): string {
  if (typeof node === "string") {
    return node;
  }

  const attributes = Object.entries(node.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

  const attributeString = attributes ? ` ${attributes}` : "";

  const selfClosingTags = ["img", "input", "br", "hr", "meta", "link"];
  if (selfClosingTags.includes(node.tag)) {
    return `<${node.tag}${attributeString}/>`;
  }

  const children = node.children.map((child) => objectToHtml(child)).join("");

  return `<${node.tag}${attributeString}>${children}</${node.tag}>`;
}
