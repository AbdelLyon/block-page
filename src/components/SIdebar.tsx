import { Theme } from "@/types";

export const Sidebar: React.FC<{
  theme: Theme;
  activeTab: "elements" | "pages";
  setActiveTab: React.Dispatch<React.SetStateAction<"elements" | "pages">>;
  isPreview: boolean;
}> = ({ theme, activeTab, setActiveTab, isPreview }) => {
  if (isPreview) return null;

  return (
    <div
      className="w-64 bg-white border-r flex h-screen flex-col"
      style={{ borderColor: theme.border }}
    >
      <div className="border border-b">
        <div className="flex">
          {(["elements", "pages"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium text-center focus:outline-none ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "elements" ? "Éléments" : "Pages"}
            </button>
          ))}
        </div>
      </div>

      <div
        id="blocks-container"
        className={`flex-1 overflow-y-auto ${
          activeTab === "elements" ? "block" : "hidden"
        }`}
      />

      <div
        className={`flex-1 overflow-y-auto ${
          activeTab === "pages" ? "block" : "hidden"
        }`}
      >
        <div className="p-4">
          <p className="text-sm text-gray-500">Contenu des pages à venir</p>
        </div>
      </div>
    </div>
  );
};
