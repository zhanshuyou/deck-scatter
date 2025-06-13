import React, { useMemo } from "react";
import DeckGL from "@deck.gl/react";
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import {
  OrthographicView,
  type OrthographicViewState,
  type LayersList,
} from "@deck.gl/core";

import type {
  DataPoint,
  Point,
  PointHoverInfo,
  ViewStateChangeHandler,
} from "@/types/scatter";
import { PointTooltip } from "@/components/PointTooltip";

interface ScatterPlotProps {
  data: DataPoint[];
  width: number;
  height: number;
  viewState?: OrthographicViewState;
  hoverInfo?: PointHoverInfo;
  disabledController?: boolean;
  selectionPoints?: Point[];
  onViewStateChange?: ViewStateChangeHandler;
  onPointClick?: (point: DataPoint) => void;
  onPointHover?: (params: PointHoverInfo) => void;
  onSelectionChange?: (selectPoints: DataPoint[]) => void;
  onLassoMouseDown?: (event: React.MouseEvent) => void;
  onLassoMouseMove?: (event: React.MouseEvent) => void;
  onLassoMouseUp?: () => void;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  width,
  height,
  viewState,
  hoverInfo,
  disabledController,
  selectionPoints = [],
  onViewStateChange,
  onPointClick,
  onPointHover,
  onLassoMouseDown,
  onLassoMouseMove,
  onLassoMouseUp,
}) => {

  const layers: LayersList = [
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
        onPointHover?.(object ? { point: object, x, y } : null),
    }),
  ];
  if (selectionPoints.length > 0) {
    const scale = viewState ? Math.pow(2, (viewState.zoom as number) ?? 0) : 1;
    layers.push(
      new PolygonLayer({
        id: "selection-area",
        data: [
          {
            polygon: selectionPoints,
          },
        ],
        getPolygon: (d) => d.polygon,
        getFillColor: [0, 0, 0, 20],
        getLineColor: [0, 0, 0, 180],
        getLineWidth: 1 / scale,
        pickable: false,
        stroked: true,
        filled: true,
        wireframe: false,
      })
    );
  }

  const controller = useMemo(() => {
    return disabledController
      ? false
      : { inertia: true, scrollZoom: { speed: 0.01 } };
  }, [disabledController]);

  return (
    <div
      style={{ position: "relative", width, height }}
      onMouseDown={onLassoMouseDown}
      onMouseMove={onLassoMouseMove}
      onMouseUp={onLassoMouseUp}
      onMouseLeave={onLassoMouseUp}
    >
      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={controller}
        views={new OrthographicView({ width, height })}
        width={width}
        height={height}
      />

      {hoverInfo && (
        <PointTooltip point={hoverInfo.point} x={hoverInfo.x} y={hoverInfo.y} />
      )}
    </div>
  );
};
