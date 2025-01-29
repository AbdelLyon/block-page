// hooks/useGrapesEditor.ts
import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import { Device, IEditorProps, IEditorTheme, IStyleCategory } from "@/types";
import { EDITOR_STYLES } from "@/style";
import { generateCustomBlocks } from "@/helpers";

interface UseGrapesEditorProps {
  theme: IEditorTheme;
  styleCategories: IStyleCategory[];
  blockGrid?: IEditorProps["blockGrid"];
  blockTitle?: IEditorProps["blockTitle"];
  blockText?: IEditorProps["blockText"];
  blockButton?: IEditorProps["blockButton"];
  blockImage?: IEditorProps["blockImage"];
  onInit: (editor: Editor) => void;
  onChange: (editor: Editor) => void;
  onSave: (html: string, css: string) => void;
}

interface UseGrapesEditorReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  editor: Editor | null;
  activeDevice: Device;
  isPreview: boolean;
  handleDeviceChange: (device: Device) => void;
  handlePreview: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleSave: () => void;
  handleOpenCode: () => void;
  handleOpenSettings: () => void;
}

const DEVICES: Record<
  Device,
  { name: string; width: string; widthMedia?: string }
> = {
  Desktop: { name: "Desktop", width: "" },
  Tablet: { name: "Tablet", width: "768px", widthMedia: "768px" },
  Mobile: { name: "Mobile", width: "375px", widthMedia: "375px" },
};

export const useGrapesEditor = ({
  theme,
  styleCategories,
  blockGrid,
  blockTitle,
  blockText,
  blockButton,
  blockImage,
  onInit,
  onChange,
  onSave,
}: UseGrapesEditorProps): UseGrapesEditorReturn => {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeDevice, setActiveDevice] = useState<Device>("Desktop");
  const [isPreview, setIsPreview] = useState(false);

  const blocks = generateCustomBlocks({
    blockGrid,
    blockTitle,
    blockText,
    blockButton,
    blockImage,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const themeStyle = document.createElement("style");
    themeStyle.textContent = `
      :root {
        --editor-primary: ${theme.primary};
        --editor-secondary: ${theme.secondary};
        --editor-accent: ${theme.accent};
        --editor-bg-primary: ${theme.background.primary};
        --editor-bg-secondary: ${theme.background.secondary};
        --editor-text-primary: ${theme.text.primary};
        --editor-text-secondary: ${theme.text.secondary};
        --editor-border: ${theme.border};
      }
      ${EDITOR_STYLES}
    `;
    document.head.appendChild(themeStyle);

    const editor = grapesjs.init({
      container: containerRef.current,
      height: "calc(100vh - 56px)",
      fromElement: false,
      storageManager: false,
      deviceManager: { devices: Object.values(DEVICES) },
      blockManager: {
        appendTo: "#blocks-container",
        blocks: blocks?.map((block) => ({
          ...block,
          content:
            typeof block.content === "string"
              ? block.content
                  .replace(/<section/g, '<section data-gjs-type="section"')
                  .replace(
                    /<div class="grid/g,
                    '<div data-gjs-type="grid" class="grid',
                  )
              : block.content,
        })),
      },
      styleManager: {
        appendTo: ".styles-container",
        sectors: styleCategories,
      },
      layerManager: {
        appendTo: ".layers-container",
      },
      panels: { defaults: [] },
      canvas: {
        styles: ["https://cdn.tailwindcss.com"],
      },
    });

    editorRef.current = editor;

    editor.on("component:selected", (component) => {
      if (component.is("grid") || component.is("section")) {
        component.addClass("gjs-dashed");
      }
    });

    editor.on("component:deselected", (component) => {
      component.removeClass("gjs-dashed");
    });

    editor.on("change:changesCount", () => onChange(editor));

    onInit(editor);

    // Nettoyage
    return () => {
      editor.destroy();
      themeStyle.remove();
    };
  }, [theme, styleCategories, onInit, onChange]);

  const handleDeviceChange = (device: Device) => {
    setActiveDevice(device);
    editorRef.current?.setDevice(device);
  };
  const handlePreview = () => {
    const editor = editorRef.current;
    if (editor) {
      if (isPreview) {
        editor.stopCommand("core:preview");
        setIsPreview(false);
      } else {
        editor.runCommand("core:preview");
        setIsPreview(true);
      }
    }
  };

  const handleUndo = () => {
    editorRef.current?.UndoManager.undo();
  };

  const handleRedo = () => {
    editorRef.current?.UndoManager.redo();
  };
  const handleSave = () => {
    const editor = editorRef.current;
    if (editor) {
      const html = editor.getHtml() ?? "";
      const css = editor.getCss() ?? "";
      onSave(html, css);
    }
  };
  const handleOpenCode = () => {
    editorRef.current?.Commands.run("core:open-code");
  };

  const handleOpenSettings = () => {
    editorRef.current?.Commands.run("core:open-settings");
  };

  return {
    containerRef,
    editor: editorRef.current,
    activeDevice,
    isPreview,
    handleDeviceChange,
    handlePreview,
    handleUndo,
    handleRedo,
    handleSave,
    handleOpenCode,
    handleOpenSettings,
  };
};
