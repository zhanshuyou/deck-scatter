import React, { useMemo, useState } from "react";
import { IconLasso, IconLassoOff } from "@tabler/icons-react";

import { generateClusteredDatasets } from "@/mock";
import { ScatterPlot } from "@/components/ScatterPlot";
import { useScatterPlot } from "@/hooks/useScatterPlot";
import { useScatterLasso } from "@/hooks/useScatterLasso";
import type { DataPoint } from "@/types/scatter";

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
      datasetCount: 10,
      pointsPerDataset: 25_000,
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
    <div className="relative">
      <div className="absolute z-10 top-4 left-4 bg-gray-300/50 px-2 py-1 rounded-md">
        Dataset Count: {datasets.length.toLocaleString()}
        <div className="flex items-center gap-2">
          <span
            title="Lasso"
            className="inline-flex items-center justify-center p-[2px] hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-md"
            onClick={() => setIsLassoing(!isLassoing)}
          >
            <IconLasso className={`${isLassoing ? "text-blue-400" : ""}`} />
          </span>
          <span
            title="Lasso"
            className="inline-flex items-center justify-center p-[2px] hover:cursor-pointer hover:bg-gray-300 transition-all duration-300 rounded-md"
            onClick={() => setSelectedPoints([])}
          >
            <IconLassoOff />
          </span>
        </div>
        <div>
          <span className="flex items-center gap-[20px]">
            Selected Points: {selectedPoints.length.toLocaleString()}{" "}
          </span>
        </div>
      </div>

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
        onLassoMouseDown={onLassoMouseDown}
        onLassoMouseMove={onLassoMouseMove}
        onLassoMouseUp={onLassoMouseUp}
      />
    </div>
  );
};

export default App;
