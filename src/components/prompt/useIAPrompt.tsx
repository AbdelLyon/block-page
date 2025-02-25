import { ReactNode, useState } from "react";
import {
  ComponentCategory,
  ComponentOptions,
  ComponentType,
  ExtendedComponentOptions,
  PlacementType,
  TemplateComponent,
  TemplateStructure,
} from "./types";
import { Layout, PenTool, Wand2 } from "lucide-react";
import { useAIStore } from "@/store/useAIStore";

export const useIAPrompt = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [options, setOptions] = useState<ExtendedComponentOptions>({
    colorScheme: "primary",
    hasBackground: true,
    hasBorder: false,
    hasShadow: true,
    rounded: true,
    title: "",
    description: "",
    customPrompt: "",
    placement: {
      type: "at-end",
    },
    // Valeurs par défaut pour le template
    templateType: "business",
    templateStyle: "modern",
    templateColorScheme: "blue",
    templateSections: [],
    // Options de responsivité avancées
    responsiveStrategy: "mobile-first",
    templateBreakpoints: ["sm", "md", "lg", "xl"],
    // Options d'accessibilité
    accessibilityLevel: "AA",
    // Options de performances
    performanceOptimizations: true,
  });

  const [templateStructure, setTemplateStructure] = useState<TemplateStructure>(
    {
      components: {},
      rootComponents: [],
    },
  );

  const CATEGORIES: Record<
    ComponentCategory,
    { name: string; icon: ReactNode; color: string }
  > = {
    TEMPLATE: {
      name: "Templates",
      icon: <Layout />,
      color: "rgb(59, 130, 246)",
    },
    CUSTOM: {
      name: "Personnalisé",
      icon: <Wand2 />,
      color: "rgb(82, 82, 91)",
    },
  };

  const { componentSelected, error } = useAIStore();
  const attributes = componentSelected?.getAttributes();
  const isModifying = attributes?.["data-gjs-type"] === "ai-generated";

  const [activeCategory, setActiveCategory] =
    useState<ComponentCategory>("TEMPLATE");
  const [selectedComponentType, setSelectedComponentType] =
    useState<ComponentType>("TEMPLATE");

  const [showStructure, setShowStructure] = useState(false);

  const addComponentToStructure = (
    id: string,
    type: ComponentType,
    options: ComponentOptions,
  ): void => {
    const placement = options.placement || { type: "at-end" };
    const componentLabel = getComponentLabel(type, options);

    setTemplateStructure((prev) => {
      const newStructure = { ...prev };
      const newComponent: TemplateComponent = {
        id,
        type,
        label: componentLabel,
        options,
        children: [],
      };

      newStructure.components = {
        ...newStructure.components,
        [id]: newComponent,
      };

      if (placement.targetId && newStructure.components[placement.targetId]) {
        const targetComponent = newStructure.components[placement.targetId];

        switch (placement.type) {
          case "inside":
            targetComponent.children.push(id);
            newComponent.parentId = placement.targetId;
            break;

          case "before":
          case "after": {
            const parentId = targetComponent.parentId;
            if (parentId) {
              const parent = newStructure.components[parentId];
              const targetIndex = parent.children.indexOf(placement.targetId);

              if (targetIndex !== -1) {
                const insertIndex =
                  placement.type === "after" ? targetIndex + 1 : targetIndex;
                parent.children.splice(insertIndex, 0, id);
                newComponent.parentId = parentId;
              }
            } else {
              const targetIndex = newStructure.rootComponents.indexOf(
                placement.targetId,
              );

              if (targetIndex !== -1) {
                const insertIndex =
                  placement.type === "after" ? targetIndex + 1 : targetIndex;
                newStructure.rootComponents.splice(insertIndex, 0, id);
              }
            }
            break;
          }

          case "replace":
            if (targetComponent.parentId) {
              const parent = newStructure.components[targetComponent.parentId];
              const targetIndex = parent.children.indexOf(placement.targetId);

              if (targetIndex !== -1) {
                parent.children[targetIndex] = id;
                newComponent.parentId = targetComponent.parentId;
              }
            } else {
              const targetIndex = newStructure.rootComponents.indexOf(
                placement.targetId,
              );

              if (targetIndex !== -1) {
                newStructure.rootComponents[targetIndex] = id;
              }
            }
            break;
        }
      } else {
        newStructure.rootComponents.push(id);
      }

      return newStructure;
    });
  };

  const generateStructuredPrompt = (
    componentId: string,
    componentType: ComponentType,
    componentOptions: ComponentOptions,
  ): string => {
    const basePrompt = generateComponentPrompt(componentType, componentOptions);
    const placementPrompt = generatePlacementPrompt(componentOptions.placement);
    const structureContext =
      Object.keys(templateStructure.components).length > 0
        ? "en conservant tous les éléments existants"
        : "";

    // Instructions de développeur pour les standards de qualité
    const devInstructions = `
Utilise les meilleures pratiques suivantes pour le développement:
1. HTML sémantique avec les balises appropriées (header, nav, main, section, article, aside, footer)
4. Utilisation correcte des attributs ARIA pour l'accessibilité
5. Breakpoints responsifs harmonisés pour toutes les tailles d'écran
6. Animations et transitions fluides et subtiles 
9. Palette de couleurs cohérente avec contraste suffisant
10. Gestion des états (hover, focus, active) pour tous les éléments interactifs
`.trim();

    return `${basePrompt}${placementPrompt} ${structureContext}

${devInstructions}`.trim();
  };

  const generatePlacementPrompt = (placement?: {
    targetId?: string;
    type: PlacementType;
  }): string => {
    if (
      !placement ||
      !placement.targetId ||
      !templateStructure.components[placement.targetId]
    ) {
      return placement?.type === "at-end"
        ? ", placer à la fin du document"
        : "";
    }

    const targetComponent = templateStructure.components[placement.targetId];
    const targetLabel = targetComponent.label;

    switch (placement.type) {
      case "inside":
        return `, placer à l'intérieur de "${targetLabel}"`;
      case "after":
        return `, placer juste après "${targetLabel}"`;
      case "before":
        return `, placer juste avant "${targetLabel}"`;
      case "replace":
        return `, remplacer "${targetLabel}"`;
      default:
        return "";
    }
  };

  const generateComponentPrompt = (
    type: ComponentType,
    options: ComponentOptions,
  ): string => {
    const basePrompt = `Générer un composant ${getCategoryName(
      type,
    )} de type ${getComponentName(type)}`;

    let stylePrompt = `avec style ${options.colorScheme || "standard"}`;
    if (options.hasBackground) stylePrompt += ", avec arrière-plan";
    if (options.hasBorder) stylePrompt += ", avec bordure";
    if (options.hasShadow) stylePrompt += ", avec ombre";
    if (options.rounded) stylePrompt += ", coins arrondis";

    let layoutPrompt = "";
    let contentPrompt = "";
    let responsivePrompt = "";
    let accessibilityPrompt = "";
    let performancePrompt = "";
    let seoPrompt = "";

    // Configurations avancées de responsivité
    responsivePrompt =
      options.responsiveStrategy === "mobile-first"
        ? "utilisant une approche mobile-first avec des media queries progressives"
        : "adapté à toutes les tailles d'écran avec des breakpoints spécifiques";

    responsivePrompt += options.templateBreakpoints?.length
      ? ` pour les breakpoints: ${options.templateBreakpoints.join(", ")}`
      : " standards";

    // Configuration d'accessibilité
    accessibilityPrompt = `conforme aux standards d'accessibilité WCAG ${
      options.accessibilityLevel || "AA"
    }`;

    // Configuration de performance
    if (options.performanceOptimizations) {
      performancePrompt =
        "avec optimisations de performance (lazy loading, CSS/JS minifiés, images optimisées)";
    }

    // Configuration SEO
    seoPrompt =
      "optimisé pour le référencement avec structure sémantique appropriée";

    switch (type) {
      case "TEMPLATE": {
        const templateType = options.templateType || "business";
        layoutPrompt = `structuré comme un site ${templateType} professionnel et complet`;

        stylePrompt += `, avec un design ${
          options.templateStyle || "modern"
        } de haute qualité`;
        if (options.templateColorScheme) {
          stylePrompt += `, utilisant une palette de couleurs ${options.templateColorScheme} harmonieuse avec contrastes optimaux`;
        }

        contentPrompt +=
          ", intégrant les éléments suivants avec cohérence visuelle et tonalité unifiée";

        if (options.templateSections && options.templateSections.length > 0) {
          contentPrompt += `:\n`;

          options.templateSections.forEach((section, index) => {
            const sectionData = getSectionsForTemplateType(
              options.templateType,
            ).find((s) => s.id === section);
            if (sectionData) {
              contentPrompt += `- Section ${index + 1}: ${
                sectionData.label
              } (${getDetailedSectionDescription(
                section,
                options.templateType,
              )})\n`;
            }
          });
        } else {
          switch (options.templateType) {
            case "landing":
              contentPrompt += `:\n- Hero impactant avec proposition de valeur claire et CTA visible\n- Section caractéristiques avec icônes et descriptions concises\n- Témoignages clients avec photos et citations authentiques\n- Section tarification transparente et compréhensible\n- Formulaire de contact simple et accessible`;
              break;
            case "blog":
              contentPrompt += `:\n- En-tête élégant avec navigation intuitive\n- Section articles à la une avec images optimisées\n- Liste d'articles récents avec métadonnées\n- Barre latérale avec catégories et recherche\n- Pied de page avec liens importants et inscription newsletter`;
              break;
            case "portfolio":
              contentPrompt += `:\n- Introduction personnelle impactante et professionnelle\n- Galerie de projets organisée avec filtres\n- Section compétences avec indicateurs visuels\n- Témoignages clients/employeurs valorisants\n- Contact professionnel avec informations complètes`;
              break;
            case "ecommerce":
              contentPrompt += `:\n- En-tête avec navigation par catégories et panier\n- Bannière promotionnelle attrayante et saisonnière\n- Grille de produits vedettes avec prix et notations\n- Section catégories avec navigation facile\n- Pied de page avec informations de confiance (paiement, livraison)`;
              break;
            case "business":
            default:
              contentPrompt += `:\n- En-tête professionnel avec navigation claire\n- Section "À propos" authentique et convaincante\n- Présentation des services avec bénéfices clients\n- Section équipe mettant en valeur l'expertise\n- Témoignages clients stratégiques\n- Contact avec carte et formulaire`;
              break;
          }
        }

        if (options.description) {
          contentPrompt += `\n\nInstructions spécifiques supplémentaires: "${options.description}"`;
        }

        break;
      }

      case "CUSTOM": {
        if (options.customPrompt) {
          contentPrompt += `\n\nInstructions personnalisées: "${options.customPrompt}"`;
        }
        break;
      }
    }

    return `${basePrompt} ${stylePrompt} ${layoutPrompt} ${contentPrompt}

SPÉCIFICATIONS TECHNIQUES:
- Responsive: ${responsivePrompt}
- Accessibilité: ${accessibilityPrompt}
- Performance: ${performancePrompt}
- SEO: ${seoPrompt}
- Compatible avec tous les navigateurs modernes`.trim();
  };

  // Fonction pour obtenir des descriptions détaillées par section
  const getDetailedSectionDescription = (
    sectionId: string,
    templateType?: string,
  ): string => {
    const sectionDescriptions: Record<string, Record<string, string>> = {
      landing: {
        hero: "avec headline accrocheur, sous-titre explicatif, CTA principal et image d'illustration pertinente",
        features:
          "présentant 3-4 caractéristiques clés avec icônes, titres courts et descriptions impactantes",
        testimonials:
          "affichant des témoignages authentiques avec photos, noms et entreprises",
        pricing:
          "comparant clairement les offres avec tableaux de prix, fonctionnalités et boutons d'action",
        faq: "répondant aux objections courantes avec questions regroupées par thème",
        contact:
          "avec formulaire simple, informations de contact et carte interactive",
      },
      blog: {
        header: "avec logo, navigation principale et recherche",
        featured:
          "mettant en avant 3 articles principaux avec grandes images et extraits",
        recent:
          "listant les derniers articles avec date, auteur et temps de lecture",
        categories: "organisées de façon intuitive avec compteur d'articles",
        sidebar:
          "incluant recherche, articles populaires et inscription newsletter",
        newsletter: "avec formulaire simple et proposition de valeur claire",
        footer: "avec liens de navigation, médias sociaux et mentions légales",
      },
      portfolio: {
        intro:
          "avec photo professionnelle, titre accrocheur et courte biographie",
        projects: "présentant les meilleurs travaux avec filtres par catégorie",
        skills: "organisées par domaine avec indicateurs de niveau",
        experience: "chronologie claire des postes et réalisations clés",
        testimonials: "témoignages sélectifs de clients ou collaborateurs",
        contact: "avec multiples moyens de contact et disponibilité",
      },
      // Ajoutez d'autres types de template au besoin
    };

    const defaultDescription =
      "avec mise en page optimale et contenu pertinent";

    if (
      !templateType ||
      !sectionDescriptions[templateType] ||
      !sectionDescriptions[templateType][sectionId]
    ) {
      return defaultDescription;
    }

    return sectionDescriptions[templateType][sectionId];
  };

  const COMPONENT_BY_CATEGORY: Record<
    ComponentCategory,
    Array<{ type: ComponentType; name: string; icon: ReactNode }>
  > = {
    TEMPLATE: [
      {
        type: "TEMPLATE",
        name: "Template Complet",
        icon: <Layout className="stroke-2" />,
      },
    ],
    CUSTOM: [{ type: "CUSTOM", name: "Personnalisé", icon: <PenTool /> }],
  };

  const getCategoryName = (type: ComponentType): string => {
    for (const [cat, components] of Object.entries(COMPONENT_BY_CATEGORY)) {
      if (components.some((c) => c.type === type)) {
        return CATEGORIES[cat as ComponentCategory].name.toLowerCase();
      }
    }
    return "standard";
  };

  const getComponentName = (type: ComponentType): string => {
    for (const components of Object.values(COMPONENT_BY_CATEGORY)) {
      const component = components.find((c) => c.type === type);
      if (component) return component.name;
    }
    return type;
  };

  const getComponentLabel = (
    type: ComponentType,
    options: ComponentOptions,
  ): string => {
    let label = getComponentName(type);

    if (options.title) {
      label += `: ${options.title.substring(0, 20)}${
        options.title.length > 20 ? "..." : ""
      }`;
    } else if (type === "TEMPLATE" && options.templateType) {
      label += `: ${getTemplateTypeName(options.templateType)}`;
    }

    return label;
  };

  const getTemplateTypeName = (templateType: string): string => {
    const typeNames: Record<string, string> = {
      landing: "Landing Page",
      blog: "Blog",
      portfolio: "Portfolio",
      ecommerce: "E-commerce",
      business: "Site Entreprise",
    };

    return typeNames[templateType] || templateType;
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const resetTemplate = () => {
    setTemplateStructure({
      components: {},
      rootComponents: [],
    });
  };

  const renderComponentIcons = (type: ComponentType) => {
    const iconMap = {
      TEMPLATE: <Layout className="w-3 h-3" />,
      CUSTOM: <PenTool className="w-3 h-3" />,
    };

    return iconMap[type] || null;
  };

  const COMPONENT_NAMES: Record<string, string> = {
    TEMPLATE: "Template Complet",
    CUSTOM: "Personnalisé",
  };

  const getSectionsForTemplateType = (templateType?: string) => {
    switch (templateType) {
      case "landing":
        return [
          { id: "hero", label: "Hero avec CTA", required: true },
          {
            id: "features",
            label: "Caractéristiques/Avantages",
            required: true,
          },
          { id: "how-it-works", label: "Comment ça marche", required: false },
          { id: "testimonials", label: "Témoignages clients", required: false },
          { id: "pricing", label: "Tarification", required: false },
          { id: "faq", label: "Questions fréquentes", required: false },
          { id: "cta", label: "CTA secondaire", required: false },
          { id: "contact", label: "Formulaire de contact", required: true },
          { id: "trust", label: "Éléments de confiance", required: false },
          { id: "footer", label: "Pied de page", required: true },
        ];
      case "blog":
        return [
          { id: "header", label: "En-tête avec navigation", required: true },
          { id: "featured", label: "Articles à la une", required: true },
          { id: "recent", label: "Articles récents", required: true },
          { id: "categories", label: "Catégories", required: false },
          { id: "sidebar", label: "Barre latérale", required: false },
          {
            id: "newsletter",
            label: "Inscription newsletter",
            required: false,
          },
          { id: "about", label: "À propos du blog", required: false },
          { id: "popular", label: "Articles populaires", required: false },
          { id: "footer", label: "Pied de page", required: true },
        ];
      case "portfolio":
        return [
          { id: "intro", label: "Introduction personnelle", required: true },
          { id: "projects", label: "Projets/Travaux", required: true },
          { id: "skills", label: "Compétences", required: true },
          {
            id: "experience",
            label: "Expérience professionnelle",
            required: false,
          },
          { id: "education", label: "Formation", required: false },
          { id: "testimonials", label: "Témoignages", required: false },
          { id: "services", label: "Services proposés", required: false },
          { id: "contact", label: "Contact", required: true },
          { id: "footer", label: "Pied de page", required: true },
        ];
      case "ecommerce":
        return [
          {
            id: "header",
            label: "En-tête avec navigation et panier",
            required: true,
          },
          { id: "banner", label: "Bannière promotionnelle", required: false },
          { id: "featured", label: "Produits vedettes", required: true },
          { id: "categories", label: "Catégories de produits", required: true },
          { id: "bestsellers", label: "Meilleures ventes", required: false },
          { id: "new-arrivals", label: "Nouveautés", required: false },
          { id: "promo", label: "Offres spéciales", required: false },
          { id: "collections", label: "Collections", required: false },
          { id: "testimonials", label: "Avis clients", required: false },
          {
            id: "benefits",
            label: "Avantages (livraison, etc.)",
            required: true,
          },
          {
            id: "newsletter",
            label: "Inscription newsletter",
            required: false,
          },
          { id: "instagram", label: "Flux Instagram", required: false },
          { id: "footer", label: "Pied de page", required: true },
        ];
      case "business":
      default:
        return [
          { id: "header", label: "En-tête avec navigation", required: true },
          { id: "hero", label: "Hero d'accueil", required: true },
          { id: "about", label: "À propos", required: true },
          { id: "services", label: "Services/Produits", required: true },
          { id: "process", label: "Processus de travail", required: false },
          { id: "team", label: "Équipe", required: false },
          { id: "portfolio", label: "Portfolio/Réalisations", required: false },
          { id: "clients", label: "Clients/Partenaires", required: false },
          { id: "testimonials", label: "Témoignages", required: false },
          { id: "stats", label: "Statistiques/Chiffres clés", required: false },
          { id: "blog", label: "Articles de blog", required: false },
          { id: "contact", label: "Contact", required: true },
          { id: "cta", label: "Call-to-action", required: false },
          { id: "footer", label: "Pied de page", required: true },
        ];
    }
  };

  const getTemplatePalettes = () => [
    { id: "blue", label: "Bleue", primary: "#3B82F6", secondary: "#1E40AF" },
    { id: "green", label: "Verte", primary: "#10B981", secondary: "#065F46" },
    {
      id: "purple",
      label: "Violette",
      primary: "#8B5CF6",
      secondary: "#5B21B6",
    },
    { id: "red", label: "Rouge", primary: "#EF4444", secondary: "#B91C1C" },
    { id: "orange", label: "Orange", primary: "#F97316", secondary: "#C2410C" },
    {
      id: "teal",
      label: "Turquoise",
      primary: "#14B8A6",
      secondary: "#0F766E",
    },
    { id: "gray", label: "Grise", primary: "#6B7280", secondary: "#374151" },
    { id: "pink", label: "Rose", primary: "#EC4899", secondary: "#BE185D" },
    { id: "amber", label: "Ambre", primary: "#F59E0B", secondary: "#B45309" },
    { id: "indigo", label: "Indigo", primary: "#6366F1", secondary: "#4338CA" },
    {
      id: "monochrome",
      label: "Monochrome",
      primary: "#262626",
      secondary: "#737373",
    },
    { id: "custom", label: "Personnalisée", primary: "", secondary: "" },
  ];

  const getTemplateStyles = () => [
    {
      id: "minimal",
      label: "Minimaliste",
      description: "Design épuré, espaces blancs, typographie élégante",
    },
    {
      id: "modern",
      label: "Moderne",
      description: "Tendances actuelles, dynamique, effets subtils",
    },
    {
      id: "classic",
      label: "Classique",
      description: "Intemporel, formel, structure traditionnelle",
    },
    {
      id: "bold",
      label: "Audacieux",
      description: "Contrastes forts, typographie imposante, visuels marquants",
    },
    {
      id: "playful",
      label: "Ludique",
      description: "Couleurs vives, formes organiques, animations",
    },
    {
      id: "corporate",
      label: "Corporate",
      description: "Professionnel, structuré, orienté business",
    },
    {
      id: "creative",
      label: "Créatif",
      description: "Mise en page unique, expérimental, artistique",
    },
  ];

  return {
    CATEGORIES,
    COMPONENT_BY_CATEGORY,
    getComponentLabel,
    getComponentName,
    getCategoryName,
    toggleOpen,
    resetTemplate,
    options,
    setOptions,
    isOpen,
    setIsOpen,
    templateStructure,
    setTemplateStructure,
    isModifying,
    activeCategory,
    setActiveCategory,
    showStructure,
    setShowStructure,
    setSelectedComponentType,
    generateStructuredPrompt,
    addComponentToStructure,
    generateComponentPrompt,
    generatePlacementPrompt,
    selectedComponentType,
    error,
    renderComponentIcons,
    COMPONENT_NAMES,
    getSectionsForTemplateType,
    getTemplatePalettes,
    getTemplateStyles,
    getTemplateTypeName,
  };
};
