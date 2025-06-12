import React, { useState, useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers";
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
  showGrid = false,
  showAxes = false,
  onPointClick,
}) => {
  const [hoverInfo, setHoverInfo] = useState<{
    point: DataPoint;
    x: number;
    y: number;
  } | null>(null);

  // 生成网格和坐标轴
  const gridLines = useMemo(() => {
    const lines = [];
    const gridSize = Math.max(width, height) / 10;

    if (showGrid) {
      // 水平网格线
      for (let y = 0; y <= height; y += gridSize) {
        lines.push({
          sourcePosition: [0, y],
          targetPosition: [width, y],
          color: [200, 200, 200, 50],
        });
      }

      // 垂直网格线
      for (let x = 0; x <= width; x += gridSize) {
        lines.push({
          sourcePosition: [x, 0],
          targetPosition: [x, height],
          color: [200, 200, 200, 50],
        });
      }
    }

    if (showAxes) {
      lines.push(
        {
          // X轴
          sourcePosition: [0, 0],
          targetPosition: [width, 0],
          color: [0, 0, 0, 255],
          width: 2,
        },
        {
          // Y轴
          sourcePosition: [0, 0],
          targetPosition: [0, height],
          color: [0, 0, 0, 255],
          width: 2,
        }
      );
    }

    return lines;
  }, [width, height, showGrid, showAxes]);

  const layers = [
    new LineLayer({
      id: "grid-lines",
      data: gridLines,
      getSourcePosition: (d: any) => d.sourcePosition,
      getTargetPosition: (d: any) => d.targetPosition,
      getColor: (d: any) => d.color,
      getWidth: (d: any) => d.width || 1,
    }),
    new ScatterplotLayer<DataPoint>({
      id: "scatter-plot",
      data,
      getPosition: (d) => d.position,
      getFillColor: (d) => d.color,
      getRadius: (d) => d.radius,
      opacity: 0.8,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 80,
      onClick: ({ object }) => onPointClick && object && onPointClick(object),
      onHover: ({ object, x, y }) =>
        setHoverInfo(object ? { point: object, x, y } : null),
    }),
  ];

  const defaultViewState = {
    target: [width / 2, height / 2, 0],
    zoom: 1,
    minZoom: -3,
    maxZoom: 20,
  };

  return (
    <div style={{ position: "relative", width, height }}>
      <DeckGL
        layers={layers}
        viewState={viewState || defaultViewState}
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
