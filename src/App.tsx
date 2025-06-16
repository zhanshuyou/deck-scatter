import React, { useMemo, useState } from "react";

import { generateClusteredDatasets } from "@/mock";
import { ScatterPlot } from "@/components/ScatterPlot";
import { ScatterContainer } from "@/components/ScatterContainer";
import { Toolbar } from "@/components/Toolbar";
import { useScatterPlot } from "@/hooks/useScatterPlot";
import { useScatterLasso } from "@/hooks/useScatterLasso";
import type { DataPoint } from "@/types/scatter";

const DATASET_POINT_COUNT = 25_000;
const DATASET_COUNT = 10;

const App: React.FC = () => {
  const { width, height } = document.body.getBoundingClientRect();

  const [isLassoing, setIsLassoing] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<DataPoint[]>([]);

  const selectedIdSet = useMemo(
    () => new Set(selectedPoints.map((p) => p.id)),
    [selectedPoints]
  );

  const points = useMemo(() => {
    return generateClusteredDatasets({
      canvasWidth: width,
      canvasHeight: height,
      datasetCount: DATASET_COUNT,
      pointsPerDataset: DATASET_POINT_COUNT,
      clusterRadius: 150,
    });
  }, []);

  const datasets = useMemo(() => {
    const getColor = (point: DataPoint) => {
      if (selectedIdSet.size === 0) {
        return point.color;
      }
      return selectedIdSet.has(point.id)
        ? point.color
        : ([180, 180, 180, 100] as [number, number, number, number]);
    };
    const getRadius = (point: DataPoint) => {
      if (selectedIdSet.size === 0) {
        return point.radius;
      }
      return selectedIdSet.has(point.id)
        ? point.radius * 1.5
        : point.radius * 0.5;
    };

    return points.map((point) => ({
      ...point,
      color: getColor(point),
      radius: getRadius(point),
    }));
  }, [selectedIdSet]);

  const {
    viewState,
    hoverInfo,
    onViewStateChange,
    onPointClick,
    onPointHover,
  } = useScatterPlot({
    width,
    height,
  });

  const {
    selectionPoints,
    onLassoMouseDown,
    onLassoMouseMove,
    onLassoMouseUp,
  } = useScatterLasso({
    width,
    height,
    data: datasets,
    viewState,
    disabled: !isLassoing,
    onSelectionChange: (selectedPoints: DataPoint[]) => {
      console.log("selectedPoints", selectedPoints);
      setIsLassoing(false);
      setSelectedPoints(selectedPoints);
    },
  });

  return (
    <ScatterContainer
      width={width}
      height={height}
      onLassoMouseDown={onLassoMouseDown}
      onLassoMouseMove={onLassoMouseMove}
      onLassoMouseUp={onLassoMouseUp}
    >
      <Toolbar
        count={datasets.length}
        isLassoing={isLassoing}
        selectedPoints={selectedPoints}
        onLassoClick={() => setIsLassoing(!isLassoing)}
        onLassoOffClick={() => setSelectedPoints([])}
      />

      <ScatterPlot
        data={datasets}
        width={width}
        height={height}
        viewState={viewState}
        hoverInfo={hoverInfo}
        disabledController={isLassoing}
        selectionPoints={selectionPoints}
        onViewStateChange={onViewStateChange}
        onPointClick={onPointClick}
        onPointHover={onPointHover}
      />
    </ScatterContainer>
  );
};

export default App;
