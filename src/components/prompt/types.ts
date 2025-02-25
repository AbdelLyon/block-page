import { Theme } from "@/types";

export type ComponentCategory = "TEMPLATE" | "CUSTOM";

export type ComponentType = "TEMPLATE" | "CUSTOM";

export type ColorScheme =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "brand";
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
export type TemplateStyle =
  | "minimal"
  | "modern"
  | "classic"
  | "bold"
  | "playful"
  | "corporate"
  | "creative";

export interface ExtendedComponentOptions extends ComponentOptions {
  responsiveStrategy?: "mobile-first" | "desktop-first";
  templateBreakpoints?: string[];
  accessibilityLevel?: "A" | "AA" | "AAA";
  performanceOptimizations?: boolean;
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
  // Options de style
  colorScheme?: ColorScheme;
  hasBackground?: boolean;
  hasBorder?: boolean;
  hasShadow?: boolean;
  rounded?: boolean;

  // Options de contenu
  title?: string;
  description?: string;
  customPrompt?: string;

  // Placement
  placement?: {
    targetId?: string;
    type: PlacementType;
  };

  // Options de template
  templateType?: TemplateType;
  templateStyle?: TemplateStyle;
  templateColorScheme?: string;
  templateSections?: string[];

  // Options de responsivité
  responsiveStrategy?: "mobile-first" | "desktop-first";
  templateBreakpoints?: string[];

  // Options d'accessibilité et performance
  accessibilityLevel?: "A" | "AA" | "AAA";
  performanceOptimizations?: boolean;
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
