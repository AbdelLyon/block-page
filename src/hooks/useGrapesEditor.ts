import {
  Device,
  GrapesConfig,
  IEditorProps,
  IEditorTheme,
  IStyleCategory,
} from "@/types";
import grapesjs, { Editor } from "grapesjs";
import { useEffect, useRef, useState } from "react";
import { useConfigEditor } from "./useConfiggEditor";
import { useAIStore } from "../store/useAIStore";
import { IAPayload } from "../types";

export const DEVICES = [
  { id: "Desktop", name: "Desktop", width: "1200px" },
  { id: "Tablet", name: "Tablet", width: "768px", widthMedia: "768px" },
  { id: "Mobile", name: "Mobile", width: "375px", widthMedia: "375px" },
];

interface UseGrapesEditorProps {
  theme: IEditorTheme;
  styleCategories: IStyleCategory[];
  blockGrid?: IEditorProps["blockGrid"];
  blockTitle?: IEditorProps["blockTitle"];
  blockText?: IEditorProps["blockText"];
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
  generateAIComponent: (payload: IAPayload) => void;
  isPending: boolean;
}

export const useGrapesEditor = ({
  blockGrid,
  blockTitle,
  blockText,
  blockImage,
  onInit,
  onChange,
  onSave,
}: UseGrapesEditorProps): UseGrapesEditorReturn => {
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<Device>("Desktop");
  const [isPreview, setIsPreview] = useState(false);

  const { setComponentSelected } = useAIStore();

  const { grapesConfig, isPending, generateAIComponent } = useConfigEditor({
    blockGrid,
    blockTitle,
    blockText,
    blockImage,
    editor: editorRef.current as Editor,
  });

  // Initialisation de l'éditeur
  useEffect(() => {
    if (!containerRef.current) return;

    const editor = initEditor(containerRef.current, grapesConfig);
    setupEventListeners(editor);
    registerCustomComponents(editor);

    editorRef.current = editor;
    onInit(editor);

    return () => editor.destroy();
  }, []);

  // Initialisation de l'éditeur GrapesJS
  const initEditor = (container: HTMLElement, config: GrapesConfig): Editor => {
    return grapesjs.init({
      container,
      ...config,
      deviceManager: { devices: DEVICES },
      mediaCondition: "min-width",
      selectorManager: { componentFirst: true },
    });
  };

  // Configuration des écouteurs d'événements
  const setupEventListeners = (editor: Editor) => {
    editor.on("component:selected", (component) => {
      setComponentSelected(component);
      if (component.is("grid") || component.is("section")) {
        component.addClass("gjs-dashed");
      }
    });

    editor.on("component:deselected", (component) => {
      setComponentSelected(null);
      component.removeClass("gjs-dashed");
    });

    editor.on("change:changesCount", () => onChange(editor));
  };

  // Enregistrement des composants personnalisés
  const registerCustomComponents = (editor: Editor) => {
    editor.Components.addType("ai-generated", {
      model: {
        defaults: {
          draggable: true,
          droppable: true,
          stylable: true,
          attributes: {
            "data-ai-component": "true",
          },
          traits: [
            {
              type: "button",
              label: "Régénérer",
              text: "Régénérer",
              command: (editor) => {
                const component = editor.getSelected();
                const description =
                  component?.get("attributes")?.["data-gjs-description"];
                if (description) {
                  generateAIComponent({
                    description,
                    action: "create",
                  });
                }
              },
            },
          ],
        },
      },
    });
  };

  // Gestion du changement d'appareil
  const handleDeviceChange = (device: Device) => {
    if (!editorRef.current) return;

    setActiveDevice(device);

    try {
      const devices = editorRef.current.Devices;
      const deviceModel = devices.get(device);

      if (deviceModel) {
        devices.select(deviceModel);
      } else {
        console.error(`Device ${device} not found`);
      }
    } catch (error) {
      console.error("Error changing device:", error);
    }
  };

  const handlePreview = () => {
    if (!editorRef.current) return;

    const newPreview = !isPreview;
    setIsPreview(newPreview);

    if (newPreview) {
      editorRef.current.Commands.run("core:preview");
    } else {
      editorRef.current.Commands.stop("core:preview");
    }
  };

  // Autres gestionnaires
  const handleUndo = () => editorRef.current?.UndoManager.undo();
  const handleRedo = () => editorRef.current?.UndoManager.redo();

  const handleSave = () => {
    if (editorRef.current) {
      onSave(
        editorRef.current.getHtml() || "",
        editorRef.current.getCss() || "",
      );
    }
  };

  const handleOpenCode = () =>
    editorRef.current?.Commands.run("core:open-code");
  const handleOpenSettings = () =>
    editorRef.current?.Commands.run("core:open-settings");

  return {
    containerRef,
    editor: editorRef.current,
    activeDevice,
    isPreview,
    isPending,
    handleDeviceChange,
    handlePreview,
    handleUndo,
    handleRedo,
    handleSave,
    handleOpenCode,
    handleOpenSettings,
    generateAIComponent,
  };
};
