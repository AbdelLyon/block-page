import { ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ComponentCategory,
  ComponentOptions,
  ComponentType,
  FormField,
  PlacementType,
  TemplateComponent,
  TemplateStructure,
} from "./types";
import {
  CheckSquare,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  Grid,
  Info,
  Layout,
  MessageSquare,
  PenTool,
  Rows,
  Users,
  Wand2,
} from "lucide-react";
import { useAIStore } from "@/store/useAIStore";

export const useIAPrompt = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [options, setOptions] = useState<ComponentOptions>({
    columnCount: 3,
    columnContents: ["", "", "", ""],
    gap: "medium",
    alignment: "stretch",
    colorScheme: "primary",
    hasBackground: true,
    hasBorder: false,
    hasShadow: true,
    rounded: true,
    title: "",
    subtitle: "",
    description: "",
    hasImage: false,
    imagePosition: "top",
    buttonText: "",
    formFields: [
      { name: "Nom", type: "text", required: true, placeholder: "Votre nom" },
      {
        name: "Email",
        type: "email",
        required: true,
        placeholder: "Votre email",
      },
    ],
    submitButtonText: "Envoyer",
    customPrompt: "",
    placement: {
      type: "at-end",
    },
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
    layout: {
      name: "Mise en page",
      icon: <Layout />,
      color: "rgb(59, 130, 246)",
    },
    content: {
      name: "Contenu",
      icon: <FileText />,
      color: "rgb(14, 165, 233)",
    },
    interaction: {
      name: "Interaction",
      icon: <CheckSquare />,
      color: "rgb(168, 85, 247)",
    },
    custom: {
      name: "Personnalisé",
      icon: <Wand2 />,
      color: "rgb(82, 82, 91)",
    },
  };

  const { componentSelected, error } = useAIStore();
  const attributes = componentSelected?.getAttributes();
  const isModifying = attributes?.["data-gjs-type"] === "ai-generated";

  // États pour la navigation et les options
  const [activeCategory, setActiveCategory] =
    useState<ComponentCategory>("layout");
  const [selectedComponentType, setSelectedComponentType] =
    useState<ComponentType>("columns");

  // Système de suivi de structure du template

  // État pour activer la prévisualisation de la structure
  const [showStructure, setShowStructure] = useState(false);

  // Structure des catégories et composants

  // Générer un ID unique pour les composants
  const generateComponentId = () => `component-${uuidv4()}`;

  // Obtenir un libellé pour le composant

  // Ajouter un composant à la structure du template
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

      // Ajouter le composant à la liste des composants
      newStructure.components = {
        ...newStructure.components,
        [id]: newComponent,
      };

      // Placer le composant selon les options de placement
      if (placement.targetId && newStructure.components[placement.targetId]) {
        const targetComponent = newStructure.components[placement.targetId];

        switch (placement.type) {
          case "inside":
            // Ajouter comme enfant du composant cible
            targetComponent.children.push(id);
            newComponent.parentId = placement.targetId;
            break;

          case "before":
          case "after": {
            // Trouver le parent du composant cible
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
              // Le composant cible est un composant racine
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
            // Remplacer le composant cible
            if (targetComponent.parentId) {
              const parent = newStructure.components[targetComponent.parentId];
              const targetIndex = parent.children.indexOf(placement.targetId);

              if (targetIndex !== -1) {
                parent.children[targetIndex] = id;
                newComponent.parentId = targetComponent.parentId;
              }
            } else {
              // Le composant cible est un composant racine
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
        // Pas de cible ou cible invalide, ajouter à la fin
        newStructure.rootComponents.push(id);
      }

      return newStructure;
    });
  };

  // Gestion du formulaire

  // Générer le prompt basé sur les options sélectionnées et la structure existante
  const generateStructuredPrompt = (
    componentId: string,
    componentType: ComponentType,
    componentOptions: ComponentOptions,
  ): string => {
    // Obtenir le prompt de base pour ce composant
    const basePrompt = generateComponentPrompt(componentType, componentOptions);

    // Ajouter des instructions de placement
    const placementPrompt = generatePlacementPrompt(componentOptions.placement);

    // Ajouter des informations sur la structure existante si nécessaire
    const structureContext =
      Object.keys(templateStructure.components).length > 0
        ? "en conservant tous les éléments existants"
        : "";

    // Assembler le prompt final
    return `${basePrompt}${placementPrompt} ${structureContext}`.trim();
  };

  // Générer des instructions de placement
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

  // Générer le prompt de base pour un composant spécifique
  /**
   * Génère une description textuelle complète pour un composant UI en fonction de son type et de ses options.
   *
   * @param type - Le type de composant (ex. "columns", "grid", "card", etc.)
   * @param options - Un objet contenant les options de configuration spécifiques au composant
   * @returns Une chaîne de caractères décrivant le composant de façon détaillée
   */
  const generateComponentPrompt = (
    type: ComponentType,
    options: ComponentOptions,
  ): string => {
    // --- 1. Construction du prompt de base ---
    // On commence par indiquer la catégorie et le type de composant à générer.
    const basePrompt = `Générer un composant ${getCategoryName(
      type,
    )} de type ${getComponentName(type)}`;

    // --- 2. Définition du style général ---
    // Le style initial est défini à partir du schéma de couleurs, ou "standard" par défaut.
    let stylePrompt = `avec style ${options.colorScheme || "standard"}`;
    if (options.hasBackground) stylePrompt += ", avec arrière-plan";
    if (options.hasBorder) stylePrompt += ", avec bordure";
    if (options.hasShadow) stylePrompt += ", avec ombre";
    if (options.rounded) stylePrompt += ", coins arrondis";

    // --- 3. Initialisation des descriptions de mise en page et de contenu ---
    let layoutPrompt = "";
    let contentPrompt = "";

    // --- 4. Adaptation du prompt en fonction du type de composant ---
    switch (type) {
      case "columns": {
        // Mise en page : organisation en colonnes verticales
        layoutPrompt = `organisé en ${options.columnCount} colonnes verticales`;
        if (options.gap && options.gap !== "none")
          layoutPrompt += ` avec espacement ${options.gap}`;
        if (options.alignment)
          layoutPrompt += `, alignement ${options.alignment}`;

        // Style spécifique : ajout de séparateurs si une bordure est activée
        if (options.hasBorder)
          stylePrompt += ", avec séparateurs entre colonnes";

        // Contenu : description de chaque colonne (si des contenus ont été fournis)
        if (
          options.columnContents &&
          options.columnContents.filter((c) => c).length > 0
        ) {
          const columns = options.columnContents
            .slice(0, options.columnCount || 3)
            .map((content, i) =>
              content ? `Colonne ${i + 1}: ${content}` : null,
            )
            .filter(Boolean);
          if (columns.length > 0)
            contentPrompt = "contenant: " + columns.join(", ");
        }
        break;
      }

      case "grid": {
        // Mise en page : grille responsive qui s'adapte à la largeur de l'écran
        layoutPrompt = `organisé en grille responsive avec ${options.columnCount} colonnes`;
        if (options.gap && options.gap !== "none")
          layoutPrompt += ` avec espacement ${options.gap} entre les éléments pour une séparation claire et élégante`;

        // Style spécifique : effet d'élévation pour créer de la profondeur ou design épuré
        stylePrompt += options.hasShadow
          ? ", avec élévation subtile des éléments pour créer une profondeur visuelle"
          : ", design épuré et contemporain";

        // Contenu : éléments de la grille, soit personnalisés, soit générés par défaut
        if (
          options.columnContents &&
          options.columnContents.filter((c) => c).length > 0
        ) {
          const elements = options.columnContents
            .slice(0, options.columnCount)
            .map((content, i) =>
              content
                ? `Élément ${
                    i + 1
                  }: ${content} (contenu unique et contextualisé)`
                : `Élément ${i + 1}: Espace réservé modulaire`,
            );
          contentPrompt =
            "avec des éléments de grille soigneusement conçus : " +
            elements.join(", ");
        } else {
          const defaultElements = Array.from({
            length: options.columnCount || 3,
          }).map((_, i) => `Élément ${i + 1}: Contenu dynamique`);
          contentPrompt = defaultElements.join(", ");
        }
        break;
      }

      case "card": {
        // Contenu : titre, sous-titre, description, image et bouton pour une carte
        if (options.title) contentPrompt += ` avec titre "${options.title}"`;
        if (options.titleSize)
          contentPrompt += ` (taille ${options.titleSize})`;
        if (options.subtitle)
          contentPrompt += `, sous-titre "${options.subtitle}"`;
        if (options.description)
          contentPrompt += `, et texte "${options.description}"`;
        if (options.hasImage)
          contentPrompt += `, avec une image en ${
            options.imagePosition || "arrière-plan"
          }`;
        if (options.buttonText)
          contentPrompt += `, et un bouton "${options.buttonText}"`;

        // Style spécifique : aspect surélevé et ombre portée si activée
        stylePrompt += ", avec aspect carte surélevée";
        if (options.hasShadow) stylePrompt += " et ombre portée";
        break;
      }

      case "section": {
        // Contenu : similaire à la carte, mais pour une section de page
        if (options.title) contentPrompt += ` avec titre "${options.title}"`;
        if (options.titleSize)
          contentPrompt += ` (taille ${options.titleSize})`;
        if (options.subtitle)
          contentPrompt += `, sous-titre "${options.subtitle}"`;
        if (options.description)
          contentPrompt += `, et texte "${options.description}"`;
        if (options.hasImage)
          contentPrompt += `, avec une image en ${
            options.imagePosition || "arrière-plan"
          }`;
        if (options.buttonText)
          contentPrompt += `, et un bouton "${options.buttonText}"`;

        // Style spécifique : arrière-plan en pleine largeur si activé
        if (options.hasBackground)
          stylePrompt += ", avec arrière-plan en pleine largeur";
        break;
      }

      case "infobox": {
        // Contenu : titre, sous-titre, description, image et bouton pour une infobox
        if (options.title) contentPrompt += ` avec titre "${options.title}"`;
        if (options.titleSize)
          contentPrompt += ` (taille ${options.titleSize})`;
        if (options.subtitle)
          contentPrompt += `, sous-titre "${options.subtitle}"`;
        if (options.description)
          contentPrompt += `, et texte "${options.description}"`;
        if (options.hasImage)
          contentPrompt += `, avec une image en ${
            options.imagePosition || "arrière-plan"
          }`;
        if (options.buttonText)
          contentPrompt += `, et un bouton "${options.buttonText}"`;

        // Style spécifique : aspect informatif et adaptation du schéma de couleurs
        stylePrompt += ", avec aspect informatif";
        if (options.colorScheme === "primary") stylePrompt += " en bleu";
        else if (options.colorScheme === "secondary") stylePrompt += " en gris";
        else if (options.colorScheme === "accent") stylePrompt += " en violet";
        else if (options.colorScheme === "brand")
          stylePrompt += " aux couleurs de l'entreprise";
        break;
      }

      case "form": {
        // Contenu : description des champs du formulaire et du bouton de soumission
        if (options.formFields && options.formFields.length > 0) {
          const fields = options.formFields
            .map((field) => {
              let desc = `${field.name} (type: ${field.type}${
                field.required ? ", obligatoire" : ""
              })`;
              if (field.placeholder)
                desc += `, placeholder: "${field.placeholder}"`;
              if (field.options && field.options.length > 0)
                desc += ` avec options: ${field.options.join(", ")}`;
              return desc;
            })
            .join(", ");
          contentPrompt += `, avec les champs: ${fields}`;
        }
        if (options.submitButtonText)
          contentPrompt += `, et bouton de soumission "${options.submitButtonText}"`;

        // Style spécifique : espacement des inputs, bordures et coins arrondis selon les options
        stylePrompt += ", avec inputs bien espacés";
        if (options.hasBorder) stylePrompt += ", champs avec bordure visible";
        if (options.rounded) stylePrompt += ", champs avec coins arrondis";
        break;
      }

      case "testimonial": {
        // Contenu : informations sur la personne (nom, rôle, citation, photo)
        if (options.personName) contentPrompt += ` de ${options.personName}`;
        if (options.personRole) contentPrompt += `, ${options.personRole}`;
        if (options.personQuote)
          contentPrompt += `, avec citation "${options.personQuote}"`;
        if (options.hasImage) contentPrompt += `, avec photo de profil`;

        // Style spécifique : guillemets décoratifs et effet surélevé si l'ombre est activée
        stylePrompt += ", avec guillemets décoratifs";
        if (options.hasShadow) stylePrompt += ", effet carte surélevée";
        break;
      }

      case "team": {
        // Contenu : liste des membres de l'équipe avec leurs rôles et descriptions facultatives
        if (options.teamMembers && options.teamMembers.length > 0) {
          const members = options.teamMembers
            .map(
              (member) =>
                `${member.name} (${member.role})${
                  member.description ? ` - ${member.description}` : ""
                }`,
            )
            .join(", ");
          contentPrompt += ` avec ${options.teamMembers.length} membres: ${members}`;
        }
        if (options.hasImage) contentPrompt += `, avec photos de profil`;

        // Style spécifique : disposition en grille ou en ligne selon le nombre de membres
        stylePrompt += ", avec disposition harmonieuse";
        if (options.teamMembers && options.teamMembers.length > 3)
          stylePrompt += ", affichage en grille";
        else stylePrompt += ", affichage en ligne";
        break;
      }

      case "timeline": {
        // Contenu : liste d'événements avec date, titre et description facultative
        if (options.timelineEvents && options.timelineEvents.length > 0) {
          const events = options.timelineEvents
            .map(
              (event) =>
                `${event.date}: ${event.title}${
                  event.description ? ` - ${event.description}` : ""
                }`,
            )
            .join(", ");
          contentPrompt += ` avec les événements: ${events}`;
        }

        // Style spécifique : ligne temporelle verticale, schéma de couleurs et alternance des positions
        stylePrompt += ", avec ligne temporelle verticale";
        if (options.colorScheme === "primary") stylePrompt += " bleue";
        else if (options.colorScheme === "brand")
          stylePrompt += " aux couleurs de l'entreprise";
        stylePrompt += ", événements alternés gauche/droite";
        break;
      }

      case "accordion": {
        // Contenu : titre et contenu textuel pour un accordéon
        if (options.title) contentPrompt += ` avec titre "${options.title}"`;
        if (options.description)
          contentPrompt += `, et contenu "${options.description}"`;

        // Style spécifique : transitions fluides, séparateurs et coins arrondis si activés
        stylePrompt += ", avec transitions fluides";
        if (options.hasBorder) stylePrompt += ", séparateurs entre items";
        if (options.rounded) stylePrompt += ", coins arrondis";
        break;
      }

      case "tabs": {
        // Contenu : titre et contenu pour une navigation par onglets
        if (options.title) contentPrompt += ` avec titre "${options.title}"`;
        if (options.description)
          contentPrompt += `, et contenu "${options.description}"`;

        // Style spécifique : navigation par onglets et adaptation du schéma de couleurs
        stylePrompt += ", avec navigation par onglets";
        if (options.colorScheme === "primary") stylePrompt += " bleus";
        else if (options.colorScheme === "brand")
          stylePrompt += " aux couleurs de l'entreprise";
        break;
      }
      case "fullTemplate": {
        // Définir le type de template et son style
        const templateType = options.templateType || "business";
        layoutPrompt = `structuré comme un site ${templateType} complet`;

        // Style du template
        stylePrompt += `, avec un design ${options.templateStyle || "modern"}`;
        if (options.templateColorScheme) {
          stylePrompt += `, utilisant une palette de couleurs ${options.templateColorScheme}`;
        }

        // Sections à inclure
        if (options.templateSections && options.templateSections.length > 0) {
          contentPrompt += `, comprenant les sections suivantes: ${options.templateSections.join(
            ", ",
          )}`;
        } else {
          // Sections par défaut selon le type de template
          switch (options.templateType) {
            case "landing":
              contentPrompt +=
                ", comprenant un hero avec CTA, section caractéristiques, témoignages, et formulaire de contact";
              break;
            case "blog":
              contentPrompt +=
                ", comprenant un en-tête, liste d'articles, barre latérale avec catégories, et pied de page";
              break;
            case "portfolio":
              contentPrompt +=
                ", comprenant une intro personnelle, galerie de projets, compétences, et formulaire de contact";
              break;
            case "ecommerce":
              contentPrompt +=
                ", comprenant une bannière promotionnelle, grille de produits, section catégories, et panier";
              break;
            case "business":
            default:
              contentPrompt +=
                ", comprenant une présentation de l'entreprise, services, équipe, et coordonnées";
              break;
          }
        }

        // Si un texte personnalisé est fourni
        if (options.description) {
          contentPrompt += `, suivant ces instructions spécifiques: "${options.description}"`;
        }

        break;
      }
    }

    // --- 5. Optimisation pour mobile ---
    const responsivePrompt = ", optimisé pour mobile";

    // --- 6. Assemblage final ---
    // On combine toutes les parties pour former le prompt complet, en retirant les espaces superflus.
    return `${basePrompt} ${stylePrompt} ${layoutPrompt} ${contentPrompt} ${responsivePrompt}`.trim();
  };

  const COMPONENT_BY_CATEGORY: Record<
    ComponentCategory,
    Array<{ type: ComponentType; name: string; icon: ReactNode }>
  > = {
    layout: [
      { type: "columns", name: "Colonnes", icon: <Rows /> },
      { type: "section", name: "Section", icon: <Layout /> },
      {
        type: "fullTemplate",
        name: "Template Complet",
        icon: <Layout className="stroke-2" />, // Ou une icône plus spécifique
      },
      {
        type: "container",
        name: "Conteneur",
        icon: <div className="w-4 h-4 border border-current rounded" />,
      },
      { type: "card", name: "Carte", icon: <CreditCard /> },
      { type: "grid", name: "Grille", icon: <Grid /> },
    ],
    content: [
      {
        type: "heading",
        name: "Titre",
        icon: <div className="text-xs font-bold">H</div>,
      },
      { type: "text", name: "Texte", icon: <FileText /> },
      { type: "testimonial", name: "Témoignage", icon: <MessageSquare /> },
      { type: "team", name: "Équipe", icon: <Users /> },
      { type: "timeline", name: "Chronologie", icon: <Clock /> },
      { type: "infobox", name: "Info", icon: <Info /> },
    ],
    interaction: [
      { type: "form", name: "Formulaire", icon: <CheckSquare /> },
      { type: "accordion", name: "Accordéon", icon: <ChevronDown /> },
      {
        type: "tabs",
        name: "Onglets",
        icon: <div className="text-xs font-bold">T</div>,
      },
    ],
    custom: [{ type: "custom", name: "Personnalisé", icon: <PenTool /> }],
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
    } else if (type === "columns") {
      label += ` (${options.columnCount || 2})`;
    } else if (type === "grid") {
      label += ` (${options.columnCount || 3} grilles)`;
    } else if (
      type === "team" &&
      options.teamMembers &&
      options.teamMembers.length > 0
    ) {
      label += ` (${options.teamMembers.length} membres)`;
    }

    return label;
  };

  const addFormField = () => {
    setOptions({
      ...options,
      formFields: [
        ...(options.formFields || []),
        { name: "", type: "text", required: false },
      ],
    });
  };

  const updateFormField = (index: number, field: Partial<FormField>) => {
    const newFields = [...(options.formFields || [])];
    newFields[index] = { ...newFields[index], ...field };
    setOptions({ ...options, formFields: newFields });
  };

  const removeFormField = (index: number) => {
    const newFields = (options.formFields || []).filter((_, i) => i !== index);
    setOptions({ ...options, formFields: newFields });
  };

  const addTeamMember = () => {
    setOptions({
      ...options,
      teamMembers: [
        ...(options.teamMembers || []),
        { name: "", role: "", description: "" },
      ],
    });
  };

  const updateTeamMember = (
    index: number,
    member: Partial<{ name: string; role: string; description?: string }>,
  ) => {
    const newMembers = [...(options.teamMembers || [])];
    newMembers[index] = { ...newMembers[index], ...member };
    setOptions({ ...options, teamMembers: newMembers });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = (options.teamMembers || []).filter(
      (_, i) => i !== index,
    );
    setOptions({ ...options, teamMembers: newMembers });
  };

  const addTimelineEvent = () => {
    setOptions({
      ...options,
      timelineEvents: [
        ...(options.timelineEvents || []),
        { date: "", title: "", description: "" },
      ],
    });
  };

  const updateTimelineEvent = (
    index: number,
    event: Partial<{ date: string; title: string; description?: string }>,
  ) => {
    const newEvents = [...(options.timelineEvents || [])];
    newEvents[index] = { ...newEvents[index], ...event };
    setOptions({ ...options, timelineEvents: newEvents });
  };

  const removeTimelineEvent = (index: number) => {
    const newEvents = (options.timelineEvents || []).filter(
      (_, i) => i !== index,
    );
    setOptions({ ...options, timelineEvents: newEvents });
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Réinitialiser le template
  const resetTemplate = () => {
    setTemplateStructure({
      components: {},
      rootComponents: [],
    });
  };

  const renderComponentIcons = (type: ComponentType) => {
    const iconMap = {
      columns: <Rows className="w-3 h-3" />,
      grid: <Grid className="w-3 h-3" />,
      section: <Layout className="w-3 h-3" />,
      card: <CreditCard className="w-3 h-3" />,
      heading: <div className="w-3 h-3 text-xs font-bold">H</div>,
      text: <FileText className="w-3 h-3" />,
      testimonial: <MessageSquare className="w-3 h-3" />,
      team: <Users className="w-3 h-3" />,
      timeline: <Clock className="w-3 h-3" />,
      form: <CheckSquare className="w-3 h-3" />,
      accordion: <ChevronDown className="w-3 h-3" />,
      tabs: <div className="w-3 h-3 text-xs font-bold">T</div>,
      infobox: <Info className="w-3 h-3" />,
      custom: <div className="w-3 h-3 text-xs font-bold">C</div>,
      container: <div className="w-3 h-3 border border-current rounded" />,
    };

    return iconMap[type] || null;
  };

  const COMPONENT_NAMES: Record<string, string> = {
    fullTemplate: "Template Complet",
    columns: "Colonnes",
    grid: "Grille",
    section: "Section",
    card: "Carte",
    testimonial: "Témoignage",
    team: "Équipe",
    timeline: "Chronologie",
    form: "Formulaire",
    accordion: "Accordéon",
    custom: "Personnalisé",
  };

  return {
    CATEGORIES,
    COMPONENT_BY_CATEGORY,
    getComponentLabel,
    getComponentName,
    getCategoryName,
    addFormField,
    updateFormField,
    removeFormField,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    addTimelineEvent,
    updateTimelineEvent,
    removeTimelineEvent,
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
    generateComponentId,
    addComponentToStructure,
    generateComponentPrompt,
    generatePlacementPrompt,
    selectedComponentType,
    error,
    renderComponentIcons,
    COMPONENT_NAMES,
  };
};
