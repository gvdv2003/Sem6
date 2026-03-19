import React from 'react';
import { RotterdamViewer } from '../components/cesium/RotterdamViewer';

export const RotterdamDashboardPage: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />

      <div className="relative z-10 flex h-full w-full flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/30 px-5 backdrop-blur-xl">
          <div>
            <h1 className="text-lg font-medium tracking-[-0.03em] text-white/90">
              3D Rotterdam
            </h1>
            <p className="text-xs text-white/35">
              Historische personages in de stad
            </p>
          </div>
        </header>

        <main className="relative flex-1">
          <RotterdamViewer />
        </main>
      </div>
    </div>
  );
};