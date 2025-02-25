import { IAPayload } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useMutation } from "@tanstack/react-query";
import { Editor } from "grapesjs";
import { useRef, useState } from "react";

interface UseAIReturn {
  generateAIComponent: (payload: IAPayload) => void;
  isPending: boolean;
}

const AI_CONFIG = {
  model: "gemini-2.0-flash-001",
  apiKey:
    process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY ||
    "AIzaszBq0Fncy7OF3ktGBMhPla-tkk-XkOX_kcE",
  settings: {
    temperature: 0.2,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_ONLY_HIGH",
    },
  ],
} as const;
export const useAI = ({ editor }: { editor: Editor | null }): UseAIReturn => {
  const blockCounterRef = useRef(0);
  const [modificationHistory, setModificationHistory] = useState<string[]>([]);

  const generateStableId = () => {
    blockCounterRef.current += 1;
    return `ai-block-${blockCounterRef.current}`;
  };
  const generatePrompt = (
    description: string,
    existingTemplate?: string,
  ): string => `
🤖 Contexte de génération de composant pour builder visuel

Historique des modifications : ${
    modificationHistory.length > 0
      ? modificationHistory.join(" → ")
      : "Première génération"
  }

Instruction actuelle : ${description}

📋 RÈGLES ABSOLUES :
- Génération UNIQUEMENT en HTML/CSS inline
- Zéro dépendance externe
- Aucun script ou import
- 100% responsive
- Adaptabilité totale
- Performance optimale

🎨 PRINCIPES DE DESIGN :
- Mobile-first IMPÉRATIF
- Unités relatives exclusives (%, vh, vw, rem)
- Flexbox/Grid comme mise en page principale
- Palette limitée à 3-4 couleurs maximum
- Typographie claire et lisible
- Espacements modulaires (multiples de 4/8)
- Contraste suffisant
- Interactions intuitives

🚀 CONTRAINTES TECHNIQUES :
- Max 5 éléments par composant
- Largeur adaptable de 320px à 1920px
- Hauteur dynamique
- Accessible et léger
- Styles calculés proportionnellement
- Interactions subtiles sans surcharge

🔍 FOCUS UTILISATEUR :
- Clarté avant tout
- Intention précise de chaque élément
- Parcours utilisateur fluide
- Éliminer le superflu
- Design épuré et moderne

${
  existingTemplate
    ? `🔄 Template source à transformer :
${existingTemplate}`
    : "🆕 Nouveau composant"
}
`;
  const cleanCode = (code: string): string =>
    code
      .replace(/```html|```/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .match(/<[^>]+>[\s\S]*<\/[^>]+>/)![0];

  const generateAICode = async (payload: IAPayload) => {
    const { description, existingTemplate, action } = payload;

    const genAI = new GoogleGenerativeAI(AI_CONFIG.apiKey);
    const model = genAI.getGenerativeModel({
      model: AI_CONFIG.model,
      generationConfig: AI_CONFIG.settings,
    });

    const prompt = generatePrompt(
      description,
      action === "update" ? existingTemplate : undefined,
    );

    const result = await model.generateContent(prompt);
    return {
      generatedCode: cleanCode(result.response.text()),
      success: true,
    };
  };

  const mutation = useMutation({
    mutationFn: generateAICode,
    onSuccess: (response, payload) => {
      if (!editor) return;

      const { action, description } = payload;
      console.log(description);

      const blockId = generateStableId();

      // Mise à jour de l'historique des modifications
      setModificationHistory((prev) => [...prev, description]);

      if (action === "update") {
        const selectedComponent = editor.getSelected();
        if (selectedComponent) {
          selectedComponent.set("content", response.generatedCode);
          selectedComponent.addAttributes({
            "data-gjs-type": "ai-generated",
            "data-gjs-description": description,
          });

          // Récupérer l'ID du bloc existant
          const existingBlockId = selectedComponent.get("blockId");

          if (existingBlockId) {
            // Mettre à jour le bloc existant dans la sidebar
            const existingBlock = editor.BlockManager.get(existingBlockId);
            if (existingBlock) {
              existingBlock.set("content", selectedComponent.toHTML());
            }
          } else {
            // Si pas de bloc existant, en créer un nouveau
            const newBlockId = generateStableId();
            selectedComponent.set("blockId", newBlockId);

            editor.BlockManager.add(newBlockId, {
              label: `AI: ${description.slice(0, 20)}...`,
              category: "AI Generated",
              content: selectedComponent.toHTML(),
              attributes: {
                class: "gjs-block-ai",
                "data-block-id": newBlockId,
              },
            });
          }
        }
      } else {
        const component = editor.addComponents({
          type: "ai-generated",
          content: response.generatedCode,
          attributes: {
            "data-gjs-type": "ai-generated",
            "data-gjs-description": description,
            "data-block-id": blockId,
          },
          blockId: blockId,
        })[0];

        editor.BlockManager.add(blockId, {
          label: `AI: ${description.slice(0, 20)}...`,
          category: "AI Generated",
          content: component.toHTML(),
          attributes: {
            class: "gjs-block-ai",
            "data-block-id": blockId,
          },
        });
      }
    },
  });
  return {
    generateAIComponent: mutation.mutate,
    isPending: mutation.isPending,
  };
};
