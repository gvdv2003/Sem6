import React from 'react';

interface CharacterBubbleProps {
  name: string;
  image: string;
  onClick: () => void;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  name,
  image,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
      type="button"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl transition group-hover:bg-white/30" />
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-200 group-hover:scale-105">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-white/85 backdrop-blur-md whitespace-nowrap">
          {name}
        </div>
      </div>
    </button>
  );
};