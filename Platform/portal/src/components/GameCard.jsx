import React from 'react';

// Hardcoded default background for games without a specific thumbnail
const DEFAULT_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0jFOXMH5A1Zrgc5HI9AOZtU-v-Hh2kGE8sUC4LsKg1Z2gGH66fi55xuOhp-H0eU9gZeSxKto17iCv6U8t5bTjsVBdJXcQXUG6uix2vr15GPAlrbtlzv9XwPMp28ZY6dnkeSK-2F34x5fssWBItKrdehU-eUrLcHHQVrRvC0g4jRGd__8owogHntIQd_HYsHsAY2YxpMtvebiK3ZXA626jwFMKKYafKrgbb3wK5ErHmrtPfC89GqPm9g";

export default function GameCard({ game, onLaunch }) {
  // Let's create varying border colors or glows based on the game name for some variety
  const isSpecial = game.name.length % 2 === 0;
  const borderClass = isSpecial ? 'border-primary/30' : 'border-secondary/30';
  const glowClass = isSpecial ? 'glow-effect' : 'glow-purple';
  
  const iconLetter = game.name.charAt(0).toUpperCase();

  return (
    <a 
      href={game.playUrl}
      className={`block w-full h-full glass-card rounded-xl relative overflow-hidden group transition-all cursor-pointer ${borderClass} ${glowClass}`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-500" 
        style={{ backgroundImage: `url('${DEFAULT_BG}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
        <div>
          <span className="inline-block px-2 py-1 bg-surface-container/80 border border-primary/50 text-primary font-label-caps text-label-caps rounded-sm mb-2">
            Local Game
          </span>
          <h3 className="font-headline-lg text-headline-lg text-primary capitalize">{game.name.replace(/-/g, ' ')}</h3>
        </div>
        <button className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-full p-2 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
      </div>
    </a>
  );
}
