import { Check, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { NodeFormProb } from "../types";

export const NodeForm = ({ onSubmit, onCancel, placeholder = "Enter node name...", loading = false }:NodeFormProb) => {
  const [name, setName] = useState('');

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onSubmit(trimmedName);
      setName('');
    }
  };

  return (
    <div className="flex items-center space-x-2"
         onKeyDown={(e) => {
           if (e.key === 'Enter') {
             e.preventDefault();
             const trimmedName = name.trim();
             if (trimmedName) {
               onSubmit(trimmedName);
               setName('');
             }
           }
         }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={placeholder}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        disabled={loading}
        autoFocus
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!name.trim() || loading}
        className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title="Create node"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        title="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};