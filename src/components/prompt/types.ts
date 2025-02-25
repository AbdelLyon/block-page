import { Theme } from "@/types";

export type ComponentCategory = "layout" | "content" | "interaction" | "custom";

export type ComponentType =
  // Layout
  | "columns"
  | "section"
  | "container"
  | "card"
  | "grid"
  // Content
  | "heading"
  | "text"
  | "testimonial"
  | "team"
  | "timeline"
  | "infobox"
  // Interaction
  | "form"
  | "accordion"
  | "tabs"
  // Custom
  | "custom"
  | "fullTemplate";

export type ColumnCount = 1 | 2 | 3 | 4;
export type Spacing = "none" | "small" | "medium" | "large";
export type Alignment = "left" | "center" | "right" | "stretch";
export type Position = "top" | "left" | "right" | "bottom" | "background";
export type ColorScheme =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "brand";
export type Size = "small" | "medium" | "large" | "xlarge";
export type PlacementType =
  | "after"
  | "before"
  | "inside"
  | "replace"
  | "at-end";

export type TemplateType =
  | "landing"
  | "blog"
  | "portfolio"
  | "ecommerce"
  | "business";
export type TemplateStyle = "minimal" | "modern" | "classic" | "bold";

export interface FormField {
  name: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface TemplateComponent {
  id: string;
  type: ComponentType;
  label: string;
  parentId?: string;
  options: ComponentOptions;
  children: string[];
}

export interface ComponentOptions {
  // Options de mise en page
  columnCount?: ColumnCount;
  columnContents?: string[];
  gap?: Spacing;
  alignment?: Alignment;

  // Options de style
  colorScheme?: ColorScheme;
  hasBackground?: boolean;
  hasBorder?: boolean;
  hasShadow?: boolean;
  rounded?: boolean;

  // Options de contenu
  title?: string;
  titleSize?: Size;
  subtitle?: string;
  description?: string;
  hasImage?: boolean;
  imagePosition?: Position;
  buttonText?: string;

  // Options pour témoignages
  personName?: string;
  personRole?: string;
  personQuote?: string;

  // Options pour équipe
  teamMembers?: {
    name: string;
    role: string;
    description?: string;
  }[];

  // Options pour formulaires
  formFields?: FormField[];
  submitButtonText?: string;

  // Options pour chronologie
  timelineEvents?: {
    date: string;
    title: string;
    description?: string;
  }[];

  // Mode personnalisé
  customPrompt?: string;

  // Placement
  placement?: {
    targetId?: string;
    type: PlacementType;
  };
  templateType?: TemplateType;
  templateStyle?: TemplateStyle;
  templateColorScheme?: string;
  templateSections?: string[];
}

export interface TemplateStructure {
  components: Record<string, TemplateComponent>;
  rootComponents: string[];
}

export interface AIPromptSectionProps {
  theme: Theme;
  handleAISubmit: (generatedPrompt: string) => Promise<void>;
  isPending: boolean;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description?: string;
}
