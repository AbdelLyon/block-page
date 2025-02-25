import React from "react";

export const LoadingIAIGenerator: React.FC<{
  isPending: boolean;
}> = ({ isPending }) => {
  if (!isPending) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-center animate-pulse">
          Génération du template en cours...
        </h3>
      </div>
    </div>
  );
};
