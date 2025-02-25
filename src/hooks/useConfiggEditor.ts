import { generateCustomBlocks } from "@/helpers";
import { GrapesConfig, IAPayload, IEditorProps } from "@/types";
import { Editor } from "grapesjs";
import { useAI } from "./useAI";

interface RichTextEditor {
  icon: string;
  event: string;
  attributes: {
    title: string;
  };
  result: (rte: RichTextEditorInterface) => void;
}

interface RichTextEditorInterface {
  exec: (command: string, value: string) => void;
}
type UseConfigEditorProps = {
  blockGrid?: IEditorProps["blockGrid"];
  blockTitle?: IEditorProps["blockTitle"];
  blockText?: IEditorProps["blockText"];
  blockImage?: IEditorProps["blockImage"];
  blockButton?: IEditorProps["blockButton"];
  editor: Editor | null;
};

type UseConfigEditorReturn = {
  grapesConfig: GrapesConfig;
  richTextEditor: RichTextEditor;
  generateAIComponent: (payload: IAPayload) => void;
  isPending: boolean;
};

export const useConfigEditor = ({
  blockGrid,
  blockTitle,
  blockText,
  blockImage,
  blockButton,
  editor,
}: UseConfigEditorProps): UseConfigEditorReturn => {
  const { generateAIComponent, isPending } = useAI({
    editor,
  });

  const grapesConfig: GrapesConfig = {
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

  const richTextEditor: RichTextEditor = {
    icon: '<span class="gjs-rte-color-action"><i class="fa fa-palette"></i></span>',
    event: "click",
    attributes: { title: "Couleur du texte" },
    result: (rte: RichTextEditorInterface) => {
      let colorPicker = document.querySelector<HTMLInputElement>(
        ".gjs-rte-color-picker",
      );

      if (!colorPicker) {
        colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.className = "gjs-rte-color-picker";
        document.body.appendChild(colorPicker);

        colorPicker.addEventListener("change", (e) => {
          const target = e.target as HTMLInputElement;
          rte.exec("foreColor", target.value);
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
    generateAIComponent,
    isPending,
  };
};
