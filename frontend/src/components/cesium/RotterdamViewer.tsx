import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Cesium from 'cesium';
import { CharacterBubble } from './CharacterBubble';
import pietHeinPortrait from '../../assets/characters/piet-hein-portrait.jpg';

type ScreenPosition = {
  x: number;
  y: number;
  visible: boolean;
};

export const RotterdamViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const navigate = useNavigate();

  const [pietScreenPosition, setPietScreenPosition] = useState<ScreenPosition>({
    x: 0,
    y: 0,
    visible: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_TOKEN';

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shadows: true,
      shouldAnimate: true,
    });

    viewerRef.current = viewer;

    viewer.scene.globe.enableLighting = true;

    // Rotterdam center
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(4.4777, 51.9244, 1800),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 2.5,
    });

    // Example Piet Hein marker location
    const pietPosition = Cesium.Cartesian3.fromDegrees(4.4793, 51.9225, 40);

    viewer.entities.add({
      position: pietPosition,
      point: {
        pixelSize: 10,
        color: Cesium.Color.WHITE.withAlpha(0.0),
      },
    });

    const updateBubblePosition = () => {
      if (!viewerRef.current) return;

      const scene = viewerRef.current.scene;
      const canvasPosition = scene.cartesianToCanvasCoordinates(pietPosition);

      if (!canvasPosition) {
        setPietScreenPosition((prev) => ({ ...prev, visible: false }));
        return;
      }

      const canvas = scene.canvas;
      const isVisible =
        canvasPosition.x >= 0 &&
        canvasPosition.x <= canvas.clientWidth &&
        canvasPosition.y >= 0 &&
        canvasPosition.y <= canvas.clientHeight;

      setPietScreenPosition({
        x: canvasPosition.x,
        y: canvasPosition.y,
        visible: isVisible,
      });
    };

    viewer.scene.postRender.addEventListener(updateBubblePosition);

    return () => {
      viewer.scene.postRender.removeEventListener(updateBubblePosition);
      viewer.destroy();
      viewerRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-0">
        {pietScreenPosition.visible && (
          <div
            style={{
              position: 'absolute',
              left: pietScreenPosition.x,
              top: pietScreenPosition.y,
            }}
          >
            <CharacterBubble
              name="Piet Hein"
              image={pietHeinPortrait}
              onClick={() => navigate('/characters/piet-hein')}
            />
          </div>
        )}
      </div>

      {/* Optional dashboard card */}
      <div className="absolute left-6 top-6 max-w-sm rounded-3xl border border-white/10 bg-black/35 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="text-sm font-medium text-white/85">Historisch overzicht</div>
        <p className="mt-2 text-sm leading-6 text-white/50">
          Verken 3D Rotterdam en klik op een personage om een gesprek te starten.
        </p>
      </div>
    </div>
  );
};