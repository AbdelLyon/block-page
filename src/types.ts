import { Editor } from "grapesjs";

export type Device = "Desktop" | "Tablet" | "Mobile";

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
  blocks: IBlock[];
  styleCategories: IStyleCategory[];
  onInit: (editor: Editor) => void;
  onChange: (editor: Editor) => void;
  onSave: (html: string, css: string) => void;
  blockGrid?: Grid[];
  blockTitle?: IBlock;
  blockText?: IBlock;
}

export type Grid = IBlock & { cols: number };
