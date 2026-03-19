import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterMapBubble } from '../components/map/CharacterMapBubble';
import pietHeinPortrait from '../assets/characters/piet-hein-portrait.jpg';
import stadskaartRotterdam from '../assets/backgrounds/stadskaart-rotterdam-16e-eeuw.jpg';

export const HistoricalMapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      {/* Background map */}
      <div className="absolute inset-0">
        <img
          src={stadskaartRotterdam}
          alt="Historische stadskaart van Rotterdam"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      {/* UI */}
      <div className="relative z-10 flex h-full w-full flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/20 px-5 backdrop-blur-xl">
          <div>
            <h1 className="text-lg font-medium tracking-[-0.03em] text-white/90">
              Historisch Rotterdam
            </h1>
            <p className="text-xs text-white/40">
              Verken personages op de kaart
            </p>
          </div>
        </header>

        <main className="relative flex-1">
          {/* Info card */}
          <div className="absolute left-6 top-6 max-w-sm rounded-3xl border border-white/10 bg-black/30 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
            <div className="text-sm font-medium text-white/85">
              Kaartoverzicht
            </div>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Klik op Piet Hein om direct naar zijn gesprekspagina te gaan.
            </p>
          </div>

          {/* Piet Hein bubble */}
          <CharacterMapBubble
            name="Piet Hein"
            image={pietHeinPortrait}
            onClick={() => navigate('/characters/piet-hein')}
            style={{
              left: '58%',
              top: '46%',
            }}
          />
        </main>
      </div>
    </div>
  );
};
