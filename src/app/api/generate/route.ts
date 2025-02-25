import { styles } from "@/components/styles";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBq0Fncy7OF3ktGBMhPla-tkk-XkOX_kcE");

interface RequestData {
  description: string;
  existingTemplate?: string;
  action?: "create" | "modify";
}

export async function POST(request: Request) {
  try {
    const { description, existingTemplate, action }: RequestData =
      await request.json();

    console.log(existingTemplate);

    if (!description) {
      return Response.json({ error: "Description required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });
    const basePrompt = `
     Tu es un expert en développement web spécialisé dans la génération de composants HTML/CSS modernes.
     
     ${
       action === "create"
         ? `Crée un composant web pour : ${description}`
         : `Modifie ce composant existant selon ces instructions : ${description}
          Composant actuel : ${existingTemplate}`
     }

     Styles à utiliser : ${JSON.stringify(styles.base)}

     Instructions précises :
     1. Génère uniquement du HTML avec styles inline (style="")
     2. Utilise exclusivement les styles fournis
     3. Assure-toi que le design est responsive
     4. Crée une structure claire et maintenable
     5. Ne génère ni commentaires ni balises script/link
     6. Retourne uniquement le code HTML

     Format attendu :
     <div style="[styles appropriés]">
       [contenu selon la description]
     </div>
   `;

    const result = await model.generateContent(basePrompt);

    const code = result.response
      .text()
      .replace(/```html|```/g, "")
      .replace(/style='([^']*)'/, 'style="$1"')
      .replace(/\s+/g, " ")
      .trim();

    // Validation basique du HTML généré
    if (!code.includes("<") || !code.includes(">")) {
      throw new Error("Invalid HTML generated");
    }

    return Response.json({
      generatedCode: code,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
