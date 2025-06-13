import React, { useMemo } from "react";
import { ScatterPlot } from "./components/ScatterPlot";
import { useScatterPlot } from "./hooks/useScatterPlot";
import { generateClusteredDatasets } from "./mock";

const App: React.FC = () => {
  const { width, height } = document.body.getBoundingClientRect();

  const datasets = useMemo(
    () =>
      generateClusteredDatasets({
        canvasWidth: width,
        canvasHeight: height,
        datasetCount: 10,
        pointsPerDataset: 20_000,
        clusterRadius: 150,
      }),
    [width, height]
  );

  const { viewState, onViewStateChange, onPointClick } = useScatterPlot({
    width,
    height,
  });

  return (
    <div className="relative">
      <p className="absolute top-4 left-4 bg-gray-300/50 px-2 rounded-md">
        Dataset Count: {datasets.length.toLocaleString()}
      </p>
      <ScatterPlot
        data={datasets}
        width={width}
        height={height}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        onPointClick={onPointClick}
      />
    </div>
  );
};

export default App;
