import type React from "react";

export const Answer: React.FC<{
  title: string;
  onRemove: () => void;
  onChange: (value: string) => void;
}> = ({ title, onRemove, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded-lg flex-1 py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Réponse possible"
        value={title}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="text-pink-500 hover:text-pink-700 text-xl transition shrink-0"
        aria-label="Supprimer la réponse"
        onClick={onRemove}
      >
        ❌
      </button>
    </div>
  );
};
