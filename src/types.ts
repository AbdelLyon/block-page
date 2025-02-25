import { Editor } from "grapesjs";
import { generateCustomBlocks } from "./helpers";

export interface IEditorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  border: string;
}

export interface IBlock {
  id: string;
  label: string;
  category: string;
  content?: string | { type: string };
  media?: string;
}

export interface IStyleCategory {
  name: string;
  open: boolean;
  buildProps: string[];
  properties: {
    name: string;
    property: string;
    type: string;
    options?: Array<{ value: string; name: string }>;
  }[];
}

export interface IEditorProps {
  theme: IEditorTheme;
  styleCategories: IStyleCategory[];
  onInit: (editor: Editor) => void;
  onChange: (editor: Editor) => void;
  onSave: (html: string, css: string) => void;
  blockGrid?: Grid[];
  blockTitle?: IBlock;
  blockText?: IBlock;
  blockButton: IBlock;
  blockImage: IBlock;
}

export type Grid = IBlock & { cols: number };

export interface Theme {
  primary: string;
  accent: string;
  border: string;
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

export type Device = "Desktop" | "Tablet" | "Mobile";

export interface DeviceConfig {
  name: string;
  width: string;
  widthMedia?: string;
}
export type Action = "create" | "update";

export type IAPayload = {
  description: string;
  action: Action;
  existingTemplate?: string;
};

export interface GrapesConfig {
  height: string;
  fromElement: boolean;
  storageManager: boolean;
  blockManager: {
    appendTo: string;
    blocks: ReturnType<typeof generateCustomBlocks>;
  };
  panels: {
    defaults: never[];
  };
  canvas: {
    styles: string[];
  };
}
