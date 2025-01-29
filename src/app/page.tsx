"use client";

import ProfessionalEditor from "@/components/DailyAppsEditor";
import { Editor } from "grapesjs";

// Thème personnalisé
const customTheme = {
  primary: "#2563eb",
  secondary: "#64748b",
  tertiary: "#f8fafc",
  accent: "#ef4444",
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
  },
  text: {
    primary: "#1e293b",
    secondary: "#64748b",
  },
  border: "#e2e8f0",
};

const GRIDS = [
  {
    id: "grid-1",
    label: "1 Colonnes",
    category: "Mise en page",
    cols: 1,
  },
  {
    id: "grid-2",
    label: "2 Colonnes",
    category: "Mise en page",
    cols: 2,
  },
  {
    id: "grid-3",
    label: "3 Colonnes",
    category: "Mise en page",
    cols: 3,
  },
];

// Blocs personnalisés
const customBlocks = [
  {
    id: "section",
    label: "Section",
    category: "Structure",
    content: `
      <section style="padding: 3rem 1rem;">
        <div style="max-width: 1200px; margin: 0 auto; border: 1px dashed; padding: 1rem">
        </div>
      </section>
    `,
    media: '<div style="color: #4b5563;"><Layout size={24} /></div>',
  },

  {
    id: "image",
    content: { type: "image" },
    media: '<div style="color: #4b5563;"><ImageIcon size={24} /></div>',
    label: "Image",
    category: "Média",
  },
];

// Styles personnalisés
const styleCategories = [
  {
    name: "Layout",
    open: false,
    buildProps: [
      "width",
      "height",
      "min-width",
      "max-width",
      "padding",
      "margin",
      "display",
      "position",
      "top",
      "right",
      "bottom",
      "left",
    ],
    properties: [
      {
        name: "Display",
        property: "display",
        type: "select",
        defaults: "block",
        options: [
          { value: "block", name: "Block" },
          { value: "inline", name: "Inline" },
          { value: "inline-block", name: "Inline Block" },
          { value: "flex", name: "Flex" },
          { value: "grid", name: "Grid" },
        ],
      },
      {
        name: "Position",
        property: "position",
        type: "select",
        defaults: "static",
        options: [
          { value: "static", name: "Static" },
          { value: "relative", name: "Relative" },
          { value: "absolute", name: "Absolute" },
          { value: "fixed", name: "Fixed" },
        ],
      },
    ],
  },
  {
    name: "Flexbox",
    open: false,
    buildProps: [
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "align-content",
      "order",
      "flex-basis",
      "flex-grow",
      "flex-shrink",
    ],
    properties: [
      {
        name: "Direction",
        property: "flex-direction",
        type: "select",
        defaults: "row",
        options: [
          { value: "row", name: "Row" },
          { value: "row-reverse", name: "Row Reverse" },
          { value: "column", name: "Column" },
          { value: "column-reverse", name: "Column Reverse" },
        ],
      },
      {
        name: "Justify",
        property: "justify-content",
        type: "select",
        defaults: "flex-start",
        options: [
          { value: "flex-start", name: "Start" },
          { value: "flex-end", name: "End" },
          { value: "center", name: "Center" },
          { value: "space-between", name: "Space Between" },
          { value: "space-around", name: "Space Around" },
        ],
      },
    ],
  },
  {
    name: "Typographie",
    open: false,
    buildProps: [
      "font-family",
      "font-size",
      "font-weight",
      "letter-spacing",
      "line-height",
      "text-align",
      "text-decoration",
      "text-transform",
      "color",
    ],
    properties: [
      {
        name: "Font Weight",
        property: "font-weight",
        type: "select",
        defaults: "400",
        options: [
          { value: "300", name: "Light" },
          { value: "400", name: "Regular" },
          { value: "500", name: "Medium" },
          { value: "600", name: "Semi Bold" },
          { value: "700", name: "Bold" },
        ],
      },
      {
        name: "Transform",
        property: "text-transform",
        type: "select",
        defaults: "none",
        options: [
          { value: "none", name: "None" },
          { value: "uppercase", name: "Uppercase" },
          { value: "lowercase", name: "Lowercase" },
          { value: "capitalize", name: "Capitalize" },
        ],
      },
    ],
  },
];

export default function Home() {
  const handleInit = (editor: Editor) => {
    console.log("Éditeur initialisé", editor);
  };

  const handleChange = (editor: Editor) => {
    console.log("Contenu mis à jour", editor);

    // Sauvegarde automatique dans le localStorage
    const html = editor.getHtml();
    const css = editor.getCss();
    localStorage.setItem("template-draft", JSON.stringify({ html, css }));
  };

  const handleSave = async (html: string, css: string) => {
    try {
      console.log("Sauvegarde du template...", { html, css });

      // Exemple d'appel API (à adapter selon vos besoins)
      /* const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html, css }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }
      */

      // Sauvegarde locale
      localStorage.setItem("template", JSON.stringify({ html, css }));
      console.log("Template sauvegardé avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  return (
    <div className="min-h-screen">
      <ProfessionalEditor
        theme={customTheme}
        blockGrid={GRIDS}
        blockTitle={{
          id: "title",
          label: "Titre",
          category: "Typographie",
        }}
        blockText={{
          id: "text",
          label: "Texte",
          category: "Typographie",
        }}
        blockImage={{
          id: "image",
          label: "Image",
          category: "Mise en page",
        }}
        blockButton={{
          id: "button",
          category: "Typographie",
          label: "Button",
        }}
        blocks={customBlocks}
        styleCategories={styleCategories}
        onInit={handleInit}
        onChange={handleChange}
        onSave={handleSave}
      />
    </div>
  );
}
