import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { OrthographicView } from "@deck.gl/core";

export interface DataPoint {
  position: [number, number];
  color: [number, number, number, number];
  radius: number;
  id?: string;
  label?: string;
}

interface ScatterPlotProps {
  data: DataPoint[];
  width: number;
  height: number;
  viewState?: any;
  onViewStateChange?: (viewState: any) => void;
  showGrid?: boolean;
  showAxes?: boolean;
  onPointClick?: (point: DataPoint) => void;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  width,
  height,
  viewState,
  onViewStateChange,
  onPointClick,
}) => {
  const [hoverInfo, setHoverInfo] = useState<{
    point: DataPoint;
    x: number;
    y: number;
  } | null>(null);

  const layers = [
    new ScatterplotLayer<DataPoint>({
      id: "scatter-plot",
      data,
      getPosition: (d) => d.position,
      getFillColor: (d) => d.color,
      getRadius: (d) => d.radius,
      opacity: 0.8,
      pickable: true,
      radiusMinPixels: 0.1,
      radiusMaxPixels: 20,
      onClick: ({ object }) => object && onPointClick?.(object),
      onHover: ({ object, x, y }) =>
        setHoverInfo(object ? { point: object, x, y } : null),
    }),
  ];

  return (
    <div style={{ position: "relative", width, height }}>
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={{ inertia: true, scrollZoom: { speed: 0.01 } }}
        views={new OrthographicView({ width, height })}
        width={width}
        height={height}
      />

      {hoverInfo && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: hoverInfo.x,
            top: hoverInfo.y,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px",
            borderRadius: "4px",
            fontSize: "12px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transform: "translate(-50%, -100%)",
            border: "1px solid #ddd",
            maxWidth: "200px",
          }}
        >
          {hoverInfo.point.label && (
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              {hoverInfo.point.label}
            </div>
          )}
          <div>X: {hoverInfo.point.position[0].toFixed(2)}</div>
          <div>Y: {hoverInfo.point.position[1].toFixed(2)}</div>
          {hoverInfo.point.id && <div>ID: {hoverInfo.point.id}</div>}
        </div>
      )}
    </div>
  );
};
