"use client";
import {
  Code,
  Globe,
  ChevronDown,
  User,
  Undo,
  Redo,
  Eye,
  Settings,
} from "lucide-react";
import { Editor } from "grapesjs";
import { useGrapesEditor } from "@/hooks/useGrapesEditor";
import { Device, IEditorProps, Theme } from "@/types";

import React, { useState } from "react";
import { LoadingIAIGenerator } from "./LoadingIAIGenerator";
import { Sidebar } from "./SIdebar";
import { AIPromptSection } from "./prompt/AIPromptSection";
import { DeviceSwitcher } from "./DeviceSwitcher";

const EditorControls: React.FC<{
  theme: Theme;
  handleUndo: () => void;
  handleRedo: () => void;
  editor: Editor | null;
  isPreview: boolean;
  handleOpenCode: () => void;
  handleOpenSettings: () => void;
  handleDeviceChange: (device: Device) => void;
  activeDevice: Device;
  handlePreview: () => void;
}> = ({
  theme,
  handleUndo,
  handleRedo,
  handlePreview,
  isPreview,
  handleOpenCode,
  handleOpenSettings,
  handleDeviceChange,
  activeDevice,
}) => (
  <div className="flex items-center space-x-6">
    <DeviceSwitcher
      theme={theme}
      activeDevice={activeDevice}
      handleDeviceChange={handleDeviceChange}
    />

    <div
      className="flex items-center space-x-1 border-r pr-4"
      style={{ borderColor: theme.border }}
    >
      <button
        onClick={handleUndo}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
      >
        <Undo className="w-5 h-5" style={{ color: theme.text.secondary }} />
      </button>
      <button
        onClick={handleRedo}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
      >
        <Redo className="w-5 h-5" style={{ color: theme.text.secondary }} />
      </button>
    </div>

    <div className="flex items-center space-x-1">
      <button
        onClick={handlePreview}
        className={`p-1.5 rounded transition-colors ${
          isPreview ? "bg-blue-50" : "hover:bg-gray-100"
        }`}
      >
        <Eye
          className="w-5 h-5"
          style={{ color: isPreview ? theme.primary : theme.text.secondary }}
        />
      </button>
      <button
        onClick={handleOpenCode}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
      >
        <Code className="w-5 h-5" style={{ color: theme.text.secondary }} />
      </button>
      <button
        onClick={handleOpenSettings}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
      >
        <Settings className="w-5 h-5" style={{ color: theme.text.secondary }} />
      </button>
    </div>
  </div>
);

const ProfessionalEditor: React.FC<IEditorProps> = ({
  theme,
  styleCategories,
  onInit,
  onChange,
  onSave,
  blockGrid,
  blockTitle,
  blockText,
  blockImage,
}) => {
  const [activeTab, setActiveTab] = useState<"elements" | "pages">("elements");

  const {
    containerRef,
    generateAIComponent,
    isPreview,
    handleOpenCode,
    handleOpenSettings,
    handleDeviceChange,
    activeDevice,
    handleUndo,
    handleRedo,
    handleSave,
    editor,
    handlePreview,
    isPending,
  } = useGrapesEditor({
    theme,
    styleCategories,
    blockGrid,
    blockTitle,
    blockText,
    blockImage,
    onInit,
    onChange,
    onSave,
  });

  const handleAISubmit = async (generatedPrompt: string): Promise<void> => {
    try {
      const selectedComponent = editor?.getSelected();

      await generateAIComponent({
        description: generatedPrompt,
        action: selectedComponent ? "update" : "create",
        existingTemplate: selectedComponent?.toHTML(),
      });
    } catch (error) {
      console.error("Erreur génération :", error);
    }
  };
  return (
    <div className="h-screen flex flex-col relative">
      <LoadingIAIGenerator isPending={isPending} />

      <div
        className="h-14 flex items-center justify-between px-4"
        style={{
          backgroundColor: theme.background.primary,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold" style={{ color: theme.primary }}>
            DAILYAPPS
          </span>
          <span className="text-sm" style={{ color: theme.text.secondary }}>
            {" Livret d'accueil"}
          </span>
        </div>

        <EditorControls
          {...{
            theme,
            handleUndo,
            handleRedo,
            editor,
            isPreview,
            handleOpenCode,
            handleOpenSettings,
            handleDeviceChange,
            activeDevice,
            handlePreview,
          }}
        />

        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-1 px-3 py-1.5 border rounded hover:bg-gray-50 transition-colors"
            style={{ borderColor: theme.border, color: theme.text.secondary }}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">FR</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            className="px-4 py-1.5 rounded text-white text-sm font-medium hover:opacity-90 transition-colors"
            style={{ backgroundColor: theme.accent }}
            onClick={handleSave}
          >
            Publier
          </button>

          <button
            className="flex items-center space-x-1 p-1.5 rounded hover:bg-gray-50 transition-colors"
            style={{ color: theme.text.secondary }}
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden pb-48">
        <Sidebar {...{ theme, activeTab, setActiveTab, isPreview }} />
        <div ref={containerRef} className="flex-1" />
      </div>

      <AIPromptSection
        {...{
          theme,
          handleAISubmit,
          isPending,
        }}
      />
    </div>
  );
};

export default ProfessionalEditor;

// export const useAI = ({ editor }: { editor: Editor | null }): UseAIReturn => {
//   const uniqueIdPrefix = useId();

//   const blockCounterRef = useRef(0);

//   const generateStableId = () => {
//     blockCounterRef.current += 1;
//     return `ai-block-${uniqueIdPrefix}-${blockCounterRef.current}`;
//   };

//   const mutation = useMutation<GenerateResponse, Error, IAPayload>({
//     mutationFn: generateAICode,
//     onSuccess: (response, payload) => {
//       if (!editor) return;

//       const { description } = payload;
//       const blockId = generateStableId();

//       editor.BlockManager.add(blockId, {
//         label: `AI: ${description.slice(0, 20)}...`,
//         category: "AI Generated",
//         content: response.generatedCode,
//         attributes: {
//           class: "gjs-block-ai",
//           "data-gjs-type": "ai-generated",
//           "data-gjs-description": description,
//         },
//         onClick: () => {
//           console.log("Block clicked!");
//         },
//       });
//     },
//     onError: (error) => {
//       console.error("Erreur IA:", error);
//     },
//   });

//   return {
//     generateAIComponent: mutation.mutate,
//     isPending: mutation.isPending,
//   };
// };

// ==================================================================================================

// "use client";
// import { useAIStore } from "@/store/useAIStore";
// import { Theme } from "@/types";
// import { ChevronDown, Wand2 } from "lucide-react";
// import { useState } from "react";

// type AIPromptSectionProps = {
//   theme: Theme;
//   aiPrompt: string;
//   setAiPrompt: React.Dispatch<React.SetStateAction<string>>;
//   handleAISubmit: (e: React.FormEvent) => Promise<void>;
//   isPending: boolean;
// };

// export const AIPromptSection = ({
//   theme,
//   aiPrompt,
//   setAiPrompt,
//   handleAISubmit,
//   isPending,
// }: AIPromptSectionProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { componentSelected, error } = useAIStore();
//   const attributes = componentSelected?.getAttributes();
//   const isModifying = attributes?.["data-gjs-type"] === "ai-generated";

//   const handleSubmit = async (e: React.FormEvent) => {
//     console.log("handleSubmit", error);
//     if (!error) setIsOpen(false);
//     await handleAISubmit(e);
//   };

//   const toggleOpen = () => setIsOpen((prev) => !prev);

//   return (
//     <div
//       className={`
//         sticky mt-10 bottom-0 left-0 right-0 z-50
//         transition-all duration-300 ease-in-out
//         bg-white shadow-2xl rounded-t-2xl
//         ${isOpen ? "h-[300px]" : "h-16"}
//         overflow-hidden
//       `}
//     >
//       {/* Barre de titre cliquable */}
//       <div
//         className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center cursor-pointer"
//         onClick={toggleOpen}
//       >
//         <div className="flex items-center space-x-3">
//           <Wand2 className="w-5 h-5 text-blue-500" />
//           <h4 className="text-lg font-semibold text-gray-700">Assistant IA</h4>
//         </div>

//         {isOpen && (
//           <button
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleOpen();
//             }}
//           >
//             <ChevronDown className="w-6 h-6" />
//           </button>
//         )}
//       </div>

//       {/* Contenu du formulaire */}
//       <div
//         className={`
//           pt-16 px-6 pb-6
//           ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
//           transition-all duration-300
//           h-full
//         `}
//       >
//         <form onSubmit={handleSubmit} className="h-full flex flex-col">
//           <div className="flex flex-col items-center w-full mb-4">
//             {error && (
//               <div
//                 className="
//                   w-8/12
//                   bg-red-50
//                   border
//                   border-red-200
//                   p-3
//                   rounded-lg
//                   text-red-600
//                   text-center
//                 "
//               >
//                 {error}
//               </div>
//             )}
//           </div>

//           <div className="relative flex-grow flex justify-center items-center">
//             <textarea
//               value={aiPrompt}
//               onChange={(e) => setAiPrompt(e.target.value)}
//               placeholder={
//                 isModifying
//                   ? "Décrivez précisément les modifications souhaitées..."
//                   : "Décrivez le composant que vous voulez générer (bouton, carte, formulaire...)"
//               }
//               className={`
//                 w-8/12
//                 p-4
//                 border
//                 rounded-lg
//                 text-sm
//                 resize-none
//                 focus:outline-none
//                 focus:ring-2
//                 transition-all
//                 h-full
//                 ${
//                   error
//                     ? "border-red-500 focus:ring-red-300"
//                     : "focus:ring-blue-300"
//                 }
//               `}
//               style={{
//                 borderColor: error ? "red" : theme.border,
//                 backgroundColor: theme.background.secondary,
//                 color: theme.text.primary,
//               }}
//               disabled={isPending}
//             />

//             <div className="absolute bottom-4 right-4 flex justify-end">
//               <button
//                 type="submit"
//                 disabled={isPending}
//                 className={`
//                   w-40
//                   py-3
//                   px-4
//                   rounded-lg
//                   flex items-center
//                   justify-center
//                   gap-2
//                   transition-all
//                   ${
//                     isPending
//                       ? "opacity-50 cursor-not-allowed"
//                       : "hover:scale-105"
//                   }
//                 `}
//                 style={{
//                   backgroundColor: theme.accent,
//                   color: "white",
//                 }}
//               >
//                 <Wand2 className="w-5 h-5" />
//                 <span className="font-medium text-base">
//                   {isModifying ? "Modifier" : "Générer"}
//                 </span>
//                 {isPending && (
//                   <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 rounded-full overflow-hidden">
//                     <div className="w-1/2 h-full bg-white animate-pulse"></div>
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// ============================================================================== IAGenerator
