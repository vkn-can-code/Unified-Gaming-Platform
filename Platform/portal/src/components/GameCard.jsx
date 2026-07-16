import React, { useState, useEffect } from 'react';

// Hardcoded default background for games without a specific thumbnail
const DEFAULT_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuA0jFOXMH5A1Zrgc5HI9AOZtU-v-Hh2kGE8sUC4LsKg1Z2gGH66fi55xuOhp-H0eU9gZeSxKto17iCv6U8t5bTjsVBdJXcQXUG6uix2vr15GPAlrbtlzv9XwPMp28ZY6dnkeSK-2F34x5fssWBItKrdehU-eUrLcHHQVrRvC0g4jRGd__8owogHntIQd_HYsHsAY2YxpMtvebiK3ZXA626jwFMKKYafKrgbb3wK5ErHmrtPfC89GqPm9g";

export default function GameCard({ game }) {
  const [queueInfo, setQueueInfo] = useState(null);
  
  useEffect(() => {
    let interval;
    if (queueInfo && queueInfo.status === 'queued') {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/queue/status');
          const data = await res.json();
          if (data.status === 'playing') {
            window.location.href = game.playUrl;
          } else if (data.status === 'queued') {
            setQueueInfo(data);
          }
        } catch (e) {
          console.error('Queue poll error', e);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [queueInfo, game.playUrl]);

  const handleJoin = async () => {
    try {
      const res = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: game.name })
      });
      const data = await res.json();
      if (data.status === 'playing') {
        window.location.href = game.playUrl;
      } else {
        setQueueInfo(data);
      }
    } catch (e) {
      console.error('Failed to join queue', e);
    }
  };
  // Let's create varying border colors or glows based on the game name for some variety
  const isSpecial = game.name.length % 2 === 0;
  const borderClass = isSpecial ? 'border-primary/30' : 'border-secondary/30';
  const glowClass = isSpecial ? 'glow-effect' : 'glow-purple';
  
  const iconLetter = game.name.charAt(0).toUpperCase();

  return (
    <div 
      onClick={!queueInfo ? handleJoin : undefined}
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
        {!queueInfo && (
          <button className="bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-full p-2 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">play_arrow</span>
          </button>
        )}
      </div>

      {/* Queue Overlay */}
      {queueInfo && queueInfo.status === 'queued' && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <h4 className="text-xl font-bold text-primary mb-2">Server is Full</h4>
          <p className="text-on-surface-variant">You are in the queue.</p>
          <div className="mt-4 px-4 py-2 bg-primary/20 border border-primary text-primary rounded-lg font-bold">
            Position: {queueInfo.position + 1}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              fetch('/api/queue/leave', { method: 'POST' });
              setQueueInfo(null);
            }}
            className="mt-6 text-sm text-error hover:underline"
          >
            Leave Queue
          </button>
        </div>
      )}
    </div>
  );
}
