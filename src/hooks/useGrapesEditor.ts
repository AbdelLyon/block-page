import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor } from "grapesjs";
import { Device, IEditorProps, IEditorTheme, IStyleCategory } from "@/types";
import { useCongigEditor } from "./useConfiggEditor";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeDevice, setActiveDevice] = useState<Device>("Desktop");
  const [isPreview, setIsPreview] = useState(false);

  const { grapesConfig, richTextEditor } = useCongigEditor({
    blockGrid,
    blockTitle,
    blockText,
    blockImage,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      ...grapesConfig,
    });

    editor.RichTextEditor.add("color", richTextEditor);

    editor.on("component:selected", (component) => {
      if (component.is("grid") || component.is("section")) {
        component.addClass("gjs-dashed");
      }
    });

    editor.on("component:deselected", (component) => {
      component.removeClass("gjs-dashed");
    });

    editor.on("change:changesCount", () => onChange(editor));

    editorRef.current = editor;
    onInit(editor);

    return () => editor.destroy();
  }, []);

  const handleUndo = () => editorRef.current?.UndoManager.undo();
  const handleRedo = () => editorRef.current?.UndoManager.redo();

  const handleSave = () => {
    if (editorRef.current) {
      onSave(
        editorRef.current.getHtml() ?? "",
        editorRef.current.getCss() ?? "",
      );
    }
  };

  const handleOpenCode = () =>
    editorRef.current?.Commands.run("core:open-code");
  const handleOpenSettings = () =>
    editorRef.current?.Commands.run("core:open-settings");

  const handleDeviceChange = (device: Device) => {
    setActiveDevice(device);
    editorRef.current?.setDevice(device);
  };

  const handlePreview = () => {
    setIsPreview((prev) => !prev);
    editorRef.current?.setDevice(activeDevice);
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
