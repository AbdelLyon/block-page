import { generateCustomBlocks } from "@/helpers";
import { IEditorProps } from "@/types";

type UseCongigEditorProps = {
  blockGrid?: IEditorProps["blockGrid"];
  blockTitle?: IEditorProps["blockTitle"];
  blockText?: IEditorProps["blockText"];
  blockImage?: IEditorProps["blockImage"];
  blockButton?: IEditorProps["blockButton"];
};
export const useCongigEditor = ({
  blockGrid,
  blockTitle,
  blockText,
  blockImage,
  blockButton,
}: UseCongigEditorProps) => {
  const grapesConfig = {
    height: "calc(100vh - 56px)",
    fromElement: false,
    storageManager: false,
    blockManager: {
      appendTo: "#blocks-container",
      blocks: generateCustomBlocks({
        blockButton,
        blockGrid,
        blockTitle,
        blockText,
        blockImage,
      }),
    },
    panels: { defaults: [] },
    canvas: {
      styles: ["https://cdn.tailwindcss.com"],
    },
  };

  const richTextEditor = {
    icon: '<span class="gjs-rte-color-action"><i class="fa fa-palette"></i></span>',
    event: "click",
    attributes: { title: "Couleur du texte" },
    result: (rte: { exec: (arg0: string, arg1: string) => void }) => {
      let colorPicker = document.querySelector<HTMLInputElement>(
        ".gjs-rte-color-picker",
      );

      if (!colorPicker) {
        colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "gjs-rte-color-picker";
        document.body.appendChild(colorPicker);

        colorPicker.addEventListener("change", (e) => {
          rte.exec("foreColor", (e.target as HTMLInputElement).value);
          colorPicker?.remove();
        });

        colorPicker.addEventListener("blur", () => colorPicker?.remove());
      }

      colorPicker.click();
    },
  };
  return {
    grapesConfig,
    richTextEditor,
  };
};
